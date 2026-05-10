/**
 * take auth header from the header.authorization
 * now check weather the user is giving authheader or not
 * if not then return with an error message no token provided,
 * now convert the authheader in in token format or “We split the Authorization header to separate the Bearer keyword from the actual JWT token.”
 * const token = authHeader.split(" ")[1];
 * now decode the token using jwt.verify
 * now give the decoded.id to req.userId
 * now call the next(),
 * 
 */
const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD} = require("../../config");

function middleware(req,res,next){
    const authHeader = req.headers.authorization;
    try{
        if(!authHeader){
            return res.status(401).json({
                message : "Token Missing"
            })
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,JWT_USER_PASSWORD);
        req.userId = decoded.id;
        next();
    }
    catch(error){
        return res.status(401).json({
            message : "Invalid token provided!"
        })
    }
}

module.exports = middleware;