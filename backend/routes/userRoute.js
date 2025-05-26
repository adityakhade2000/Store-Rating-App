const express = require("express");
const router = express.Router();
let pool = require('../config/db.config');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const verifyUser = require('../middleware/verifyUser')

router.post("/change-password", verifyUser, async (req, res) => {
    const userId = req.id;// set by verifyUser middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Both fields are required" });
    }

    try {
        const userResult = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);

        if (userResult.rows.length === 0) return res.status(404).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password);
        if (!validPassword) return res.status(401).json({ message: "Current password is incorrect" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);

        res.status(200).json({ message: "Password successfully changed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router