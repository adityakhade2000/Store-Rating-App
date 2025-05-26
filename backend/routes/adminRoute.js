const express = require("express");
const router = express.Router();
let pool = require('../config/db.config');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SALT_ROUNDS = 10;


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const sql = `SELECT u.*, ut.role 
                     FROM users u 
                     JOIN userType ut ON u.userTypeId = ut.id 
                     WHERE u.email = $1`;
        const { rows } = await pool.query(sql, [email]);

        if (rows.length === 0) {
            return res.json({ loginStatus: false, Error: "User not found" });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, userTypeId: user.userTypeId },
            process.env.ACCESS_TOKEN,
            { expiresIn: "1d" }
        );

        res.cookie("access_token", token, {
            httpOnly: true,
        });

        return res.json({
            loginStatus: true,
            role: user.role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ loginStatus: false, Error: "Internal server error" });
    }
});


router.get('/admins', (req, res) => {
    const sql = "select u.id, u.email,u.name,u.address,ut.role from users u join userType ut ON u.userTypeId = ut.id where role ='admin'";
    pool.query(sql, (err, result) => {
        if (err) return res.json({ status: false, Error: "Query error" + err })
        return res.json({ Status: true, Result: result.rows })
    })
})

router.get('/admin_count', (req, res) => {
    const sql = "select count(u.id) as admin from users u join userType ut ON u.userTypeId = ut.id where role ='admin'";
    pool.query(sql, (err, result) => {
        if (err) return res.json({ status: false, Error: "Query error" + err })
        return res.json({ Status: true, Result: result.rows })
    })
})

router.get('/users_count', (req, res) => {
    const sql = "select count(u.id) as users from users u join userType ut ON u.userTypeId = ut.id where role ='user'";
    pool.query(sql, (err, result) => {
        if (err) return res.json({ status: false, Error: "Query error" + err })
        return res.json({ Status: true, Result: result.rows })
    })
})
router.get('/store_count', (req, res) => {
    const sql = "select count(id) as stores from stores";
    pool.query(sql, (err, result) => {
        if (err) return res.json({ status: false, Error: "Query error" + err })
        return res.json({ Status: true, Result: result.rows })
    })
})
router.get('/rating_count', (req, res) => {
    const sql = "select count(id) as subratings from store_ratings";
    pool.query(sql, (err, result) => {
        if (err) return res.json({ status: false, Error: "Query error" + err })
        return res.json({ Status: true, Result: result.rows })
    })
})


router.get('/userType', (req, res) => {
    const sql = "select id, role from userType";
    pool.query(sql, (err, result) => {
        if (err) return res.json({ status: false, Error: "Query error" + err })
        return res.json({ Status: true, Result: result.rows })
    })
})


router.post('/signup', async (req, res) => {
    const { name, email, address } = req.body;
    let { password } = req.body;

    try {
        password = await bcrypt.hash(password, SALT_ROUNDS);
        const user = "INSERT INTO users (name,email,address,password) VALUES ($1,$2,$3,$4)";
        await pool.query(user, [name, email, address, password]);
        return res.json({ status: true });
    } catch (err) {
        console.error("Insert error:", err);
        return res.json({ status: false, Error: "Query error*******" });
    }
});

router.post('/add_User', async (req, res) => {
    const { name, email, address, userTypeId } = req.body;
    let { password } = req.body;

    try {
        password = await bcrypt.hash(password, SALT_ROUNDS);
        const user = "INSERT INTO users (name,email,address,userTypeId,password) VALUES ($1,$2,$3,$4,$5)";
        await pool.query(user, [name, email, address, userTypeId, password]);
        return res.json({ status: true });
    } catch (err) {
        console.error("Insert error:", err);
        return res.json({ status: false, Error: "Query error*******" });
    }
});

router.post('/add_Store', async (req, res) => {
    const { storename, name, email, address } = req.body;
    let { password } = req.body;

    try {
        password = await bcrypt.hash(password, SALT_ROUNDS);         // Hash password


        // Begin transaction
        try {
            await pool.query('BEGIN');

            // Insert into stores
            const insertStoreQuery = `
                INSERT INTO stores (storename,name, email, address)
                VALUES ($1, $2, $3, $4)
            `;
            await pool.query(insertStoreQuery, [storename, name, email, address]);


            // Insert into users as store owner
            let userTypeId = '4cc6226c-393d-4fce-841c-f4f776df8a50'
            const insertUserQuery = `
                INSERT INTO users (name, email, address, password, userTypeId)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await pool.query(insertUserQuery, [name, email, address, password, userTypeId]);

            await pool.query('COMMIT');
            return res.json({ status: true });
        } catch (err) {
            await pool.query('ROLLBACK');
            console.error("Transaction error:", err);
            return res.json({ status: false, Error: "Transaction failed" });
        }

    } catch (err) {
        console.error("Insert error:", err);
        return res.json({ status: false, Error: "Query error" });
    }
});


router.get('/users', (req, res) => {
    const sql = "select u.id, u.name,u.email,u.address,u.userTypeId,ut.role as userrole from users u left join userType ut on userTypeId = ut.id WHERE u.userTypeId != '4cc6226c-393d-4fce-841c-f4f776df8a50'";
    pool.query(sql, (err, result) => {
        if (err) return res.json({ status: false, Error: "Query error" + err })
        return res.json({ Status: true, Result: result.rows })
    })
})

router.get('/stores', (req, res) => {
    const sql = "select id, storename,email,address from stores";
    pool.query(sql, (err, result) => {
        if (err) return res.json({ status: false, Error: "Query error" + err })
        return res.json({ Status: true, Result: result.rows })
    })
})

router.post('/logout', (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        // sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production' // Only over HTTPS in production
    });
    return res.json({ logoutStatus: true, message: "Logged out successfully" });
});

module.exports = router