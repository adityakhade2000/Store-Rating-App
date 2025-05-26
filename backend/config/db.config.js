const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
})

pool.connect((err) => {
    if (err) {
        console.log('connection error', err.stack)
    } else {
        console.log('connected')
    }
})

module.exports = pool;