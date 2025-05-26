const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const verifyUser = require('../middleware/verifyUser');
const bcrypt = require('bcrypt');


// Get all stores with average rating and user rating
router.get('/ratings', verifyUser, async (req, res) => {
    const userId = req.id;

    try {
        const stores = await pool.query(`
      SELECT s.id, s.storename, s.address,s.email,
        COALESCE(AVG(r.rating), 0)::numeric(2,1) AS overall_rating,
        COUNT(DISTINCT r.userId) AS user_count,
        ur.rating AS user_rating,
        ur.comments AS user_comment
      FROM stores s
      LEFT JOIN store_ratings r ON s.id = r.storeId
      LEFT JOIN store_ratings ur ON s.id = ur.storeId AND ur.userId = $1
      GROUP BY s.id, ur.rating, ur.comments
    `, [userId]);

        res.json(stores.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/myStoreRatings', verifyUser, async (req, res) => {
    const userId = req.id;

    try {
        // Get the logged-in user's email first
        const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0)
            return res.status(404).json({ status: false, error: "User not found" });

        const userEmail = userResult.rows[0].email;

        // Find the store owned by this user (match by email)
        const storeResult = await pool.query('SELECT id FROM stores WHERE email = $1', [userEmail]);
        if (storeResult.rows.length === 0)
            return res.status(404).json({ status: false, error: "Store not found for this user" });

        const storeId = storeResult.rows[0].id;

        // Get ratings submitted for this store
        const ratingsSql = `
            SELECT
                sr.id as id,
                sr.rating,
                sr.comments,
                u.id as userId,
                u.name,
                u.email,
                u.address,
                u.userTypeId
            FROM store_ratings sr
            JOIN users u ON sr.userId = u.id
            WHERE sr.storeId = $1
        `;
        const ratingsResult = await pool.query(ratingsSql, [storeId]);
        return res.json({ status: true, ratings: ratingsResult.rows });
    } catch (err) {
        console.error('Error fetching myStoreRatings:', err);
        return res.status(500).json({ status: false, error: 'Server error' });
    }
});


// Submit or update rating
router.post('/rate', verifyUser, async (req, res) => {
    const userId = req.id;
    const userTypeId = req.userTypeId;
    const { storeId, rating, comments } = req.body;

    if (!storeId || !rating) {
        return res.status(400).json({ message: 'Missing storeId or rating' });
    }

    try {
        // Check if the rating already exists
        const ratings = await pool.query(
            `SELECT * FROM store_ratings WHERE userId = $1 AND storeId = $2`,
            [userId, storeId]
        );

        if (ratings.rows.length > 0) {
            // Update existing rating
            await pool.query(
                `UPDATE store_ratings
                 SET rating = $1, comments = $2
                 WHERE userId = $3 AND storeId = $4`,
                [rating, comments, userId, storeId]
            );
            res.json({ message: 'Rating updated' });
        } else {
            // Insert new rating
            await pool.query(
                `INSERT INTO store_ratings (userId, userTypeId, storeId, rating, comments)
                 VALUES ($1, $2, $3, $4, $5)`,
                [userId, userTypeId, storeId, rating, comments]
            );
            res.json({ message: 'Rating submitted' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

router.post("/change-password", verifyUser, async (req, res) => {
    const userId = req.id; // Set by your `verifyUser` middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Both fields are required" });
    }

    try {
        const storeResult = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);

        if (storeResult.rows.length === 0) return res.status(404).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(currentPassword, storeResult.rows[0].password);
        if (!validPassword) return res.status(401).json({ message: "Current password is incorrect" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);

        res.status(200).json({ message: "Password successfully changed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
