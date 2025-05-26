const express = require('express');
const cors = require('cors');
var cookieParser = require('cookie-parser');
require('dotenv').config();
var adminRouter = require('./routes/adminRoute');
var storeRouter = require('./routes/storeRoute');
var userRouter = require('./routes/userRoute');
const verifyUser = require('./middleware/verifyUser');
const port = 3000

const app = express()

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))
app.use(cookieParser())
app.use(express.json())
app.use('/auth', adminRouter)
app.use('/users', userRouter)
app.use('/store', storeRouter);

app.use(express.static('Public'))


app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id })
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

