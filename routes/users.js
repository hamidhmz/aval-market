import bcrypt from "bcrypt-nodejs";//this module is like bcryptjs or bcrypt and they work the same way
import _ from "lodash";// this module is like underscore and work the same way by providing more consistent API behavior
import {User, registerValidation,loginValidation} from "../models/user";// this import 2 validation functions and in user model this give you jwt.sign and schema of user model
import express from "express";
import auth from "../middleware/auth";// this middleware check valid token  if client doesn't have token or doesn't have valid token this middleware give them 400 response

const router = express.Router();// with this middleware you can load application-level and router-level middleware with an optional mount path
/**
 * @desc this route give client all user information from mongodb except __v , password , _id (client that have valid token) if they don't have valid token then cannot access to this route
 * @method GET
 * @uses {get} /api/users Request all Users information
 * @requires in header client must set x-auth-token=valid token
 * @examples http://localhost/api/users (header{x-auth-token=valid token} )
 * @author hamidreza nasrollahy h.mosaferkocholo@gmail.com
 * @return all Users information except __v , password , _id
 */
router.get("/",auth,async function(req,res) {
    const users = await User.find().select('-__v -password -_id');// this function will return all user
    res.send(users);
});

/**
 * @desc this route allow client side to register new user and then give client a valid token that will expire after 1h
 * @method POST
 * @uses {post} /api/users/register create new user and send client a valid token that will expire after 1h
 * @requires userName minimum 5 character and maximum 50 character , a valid email (unique) , password minimum 5 character and maximum 50 character
 * @examples http://localhost/api/users/register ( req.body = {userName":"hamid123","email":"hamid1@gmail.com","password":"123123"} )
 * @author hamidreza nasrollahy h.mosaferkocholo@gmail.com
 * @return new user userName and email and a valid token in header that will expire after 1h in x-auth-token
 */
router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);// this function come from User model file and this function use joi module for validation .userName,password,email is require and userName minimum 5 character and maximum 50 character,a valid email (unique) ,password minimum 5 character and maximum 50 character
    if (error) return res.status(400).send(error.details[0].message);//if req data that come from client aren't valid data registerValidation function will return error object


    let user = await User.findOne({email:req.body.email});//this function is for finding user by email address if this email is used before client doesn't have allow to register new user
    if(user) return res.status(400).send("User already registered.");//if there is a user with that email address that come from client , it cannot have another registry with this email

    user = new User(_.pick(req.body,["userName","email","password"]));// pick method come from lodash that return an object with picked item (e.g:{ userName: 'hamid123', email: 'hamid1@gmail.com', password: '123123' })  this is for prevent user save additional parameter in database


    bcrypt.genSalt(10, async function (err, salt){//generate salt with rounds 10 this salt is essential for creating secure hash
        bcrypt.hash(req.body.password,salt,null,function(err,hash){//
            user.password = hash;
        });
    });
    await user.save();//save new user in db

    const token = user.generateAuthToken();//generate valid token that after 1h would be expired
    res.header("x-auth-token",token).send(_.pick(user,["userName","email"])); // send token in header to client as x-auth-token  and send email and userName user that just registered
});
/**
 * @desc this route allow client side to Login user and then give client a valid token that will expire after 1h
 * @method POST
 * @uses {post} /api/users/login login user and send client a valid token that will expire after 1h
 * @requires userName minimum 5 character and maximum 50 character , a valid email (unique) , password minimum 5 character and maximum 50 character
 * @examples http://localhost/api/users/register ( req.body = {userName":"hamid123","email":"hamid1@gmail.com","password":"123123"} )
 * @author hamidreza nasrollahy h.mosaferkocholo@gmail.com
 * @return user userName and email and a valid token in header that will expire after 1h in x-auth-token
 */
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);// this function come from User model file and this function use joi module for validation .password,email is require and a valid email (unique) is require ,password minimum 5 character and maximum 50 character is require
    if (error) return res.status(400).send(error.details[0].message);


    let user = await User.findOne({email:req.body.email});// finding user by email address
    if(!user) return res.status(400).send("Invalid Email or Password."); //if could not find that user it return "Invalid Email or Password." response with 400 status

    bcrypt.compare(req.body.password,user.password,async function (err, validPassword){//compare 2 pass with each other first argument is Unhashed password and second is hashed password that saved in to db
        if(!validPassword) return res.status(400).send("Invalid Email or Password.");// if 2 password are Deference then it return "Invalid Email or Password." response with 400 status
        const token = user.generateAuthToken();//generate token this function work with jwt.sign function that will be expire after 1h
        res.header("x-auth-token",token).send(_.pick(user,["userName","email"]));// send token in header to client as x-auth-token  and send email and userName user that just logged in

    });
});

export default router;