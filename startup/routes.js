import express from "express";
import users from "../routes/users";
export default function(app){
    app.use(express.json());//set express json body parser  .This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
    app.use('/api/users', users);//set router middleware (all api routes are in this app)
}