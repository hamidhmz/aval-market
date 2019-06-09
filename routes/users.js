import bcrypt from "bcrypt-nodejs";
import _ from "lodash";
import {User, registerValidation,loginValidation} from "../models/user";
import express from "express";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/",auth,async function(req,res) {
    const users = await User.find().select('-__v -password -_id');
    res.send(users);
});

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    let user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).send("User already registered.");

    user = new User(_.pick(req.body,["userName","email","password"]));


    bcrypt.genSalt(10, async function (err, salt){
        bcrypt.hash(req.body.password,salt,null,function(err,hash){
            user.password = hash;
        });
    });
    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth-token",token).send(_.pick(user,["userName","email"]));

    // res.send(user);
});
//login
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    let user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send("Invalid Email or Password.");

    bcrypt.compare(req.body.password,user.password,async function (err, validPassword){
        if(!validPassword) return res.status(400).send("Invalid Email or Password.");
        const token = user.generateAuthToken();
        res.header("x-auth-token",token).send(_.pick(user,["userName","email"]));

    });
});

export default router;