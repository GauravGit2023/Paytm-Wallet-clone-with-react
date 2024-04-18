const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next){
    
    const authHeader = req.headers.authorization;
    const words = authHeader.split(" ");
    const token = words[1];
    

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(413).json({});
    }
    try{
        const decodedValue = jwt.verify(token, JWT_SECRET);
        req.userId = decodedValue.userId;
        next();
    } 
    catch {
        return res.status(403).json({
            msg: "Auth failed"
        });
    }
}

module.exports = {
    authMiddleware
}