// config lets you define a set of default parameters, and extend them for different deployment environments(development, qa, staging, production, etc.)   https://www.npmjs.com/package/config
// in this app is set in docker config it is mean that config module use config/docker.json file if you wanna change that go to docker-compose.yml and set NODE_ENV to anything you want (e.g : export NODE_ENV=production) and  create JSON file in the config and customize it
import config from "config";
import jwt from "jsonwebtoken";
export default function (req,res,next){
    const token = req.header("x-auth-token");//client must give token in header as x-auth-token
    if(!token)return res.status(401).send("access denied. no token provided.");// if there is no token this will return 401 status and access denied to router
    try{// this try catch is for jwt.verify because this function is async
        const decoded = jwt.verify(token,config.get("jwtPrivateKey"));//try:if jwt cannot verify token then throw and exception
        req.user = decoded;// change req ,add  payload to req.user in payload we have _id(user id) and iat(created at) and exp(expiration date)
        next();
    }catch(ex){
        res.status(400).send("invalid token.");
    }

}