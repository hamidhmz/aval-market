import express from "express";// import for create app instance
import mongoose from "mongoose";// import for create mongoose instance
import startupRoutes from "./startup/routes";//import all routes
import startupDb from "./startup/db";//import db configuration
import startupConfig from "./startup/config";
import startupProd from "./startup/prod";
const app = express();// an instance of express
startupRoutes(app);// set router middleware and express json body parser
startupDb(mongoose);// set connection for mongodb
startupConfig();// if jwtPrivateKey does not exist it throw an error
startupProd(app);// set helmet middleware

const port = process.env.PORT || 3000; // if PORT environment variables have been sets then set port = PORT otherwise set port = 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));//This method is identical to Node’s http.Server.listen().