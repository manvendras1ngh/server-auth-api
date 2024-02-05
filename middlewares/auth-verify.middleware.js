const jwt = require("jsonwebtoken");
const secret = require("../config/secrets");

const JWT_SECRET = secret.jwtSecret;

const authVerify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  try{
    const token = authHeader && authHeader.split(" ")[1];
    
    if(!token){
      return res.status(401).json({message: "Unauthorized - Token not provided"});
    }
    
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = {id: decodedToken.id};
    
    next();
  }catch(error){
    console.error("Token Verification failed", error);
    res.send(401).json({message: "Unauthorized - Invalid Token!"});
  }
};

module.exports = {authVerify};