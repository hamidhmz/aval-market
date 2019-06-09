import express from "express";
import users from "../routes/users";
// import auth from "../middleware/auth";
export default function(app){
    app.use(express.json());
    app.use('/api/users', users);
}