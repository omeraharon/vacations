const jwt = require("jsonwebtoken");

function verifyLoggedIn(req, res, next) {
    if(!req.headers.authorization) return res.status(401).send("You are not logged in !");

    const token = req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).send("You are not logged in !");

    jwt.verify(token, config.jwtKey, (err, payload) => {
        if(err && err.message === "jwt expired") {
            return res.status(403).send("Your login session has expired.");
        }
        if(err) return res.status(401).send("You are not logged in !");
        req.headers.userDetails = payload.payload;
        next();
    });
}

module.exports = verifyLoggedIn;