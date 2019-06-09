import config from "config";
import jwt from "jsonwebtoken";
export default function (req,res,next){
    const token = req.header("x-auth-token");
    if(!token)return res.status(401).send("access denied. no token provided.");
    try{
        const decoded = jwt.verify(token,config.get("jwtPrivateKey"));
        req.user = decoded;
        next();
    }catch(ex){
        res.status(400).send("invalid token.");
    }

}