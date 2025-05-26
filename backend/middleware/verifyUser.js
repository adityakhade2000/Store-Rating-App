var jwt = require('jsonwebtoken');


const verifyUser = (req, res, next) => {
    const token = req.cookies.access_token;
    // console.log('cookies',token);
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) return res.json({ Status: false, Error: "Wrong token" })
            req.id = decoded.id;
            req.role = decoded.role;
            // req.userTypeId = decoded.userTypeId;
            return next();
        })
    } else {
        return res.json({ Status: false, Error: "Not Autheticated" })
    }
}

module.exports = verifyUser;
