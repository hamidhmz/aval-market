import mongoose from "mongoose";//for connect to mongodb database
import joi from "joi";//for validation data
import jwt from "jsonwebtoken";//for generate token
// config lets you define a set of default parameters, and extend them for different deployment environments(development, qa, staging, production, etc.)   https://www.npmjs.com/package/config
// in this app is set in docker config it is mean that config module use config/docker.json file if you wanna change that go to docker-compose.yml and set NODE_ENV to anything you want (e.g : export NODE_ENV=production) and  create JSON file in the config and customize it
import config from "config";
const userSchema = new mongoose.Schema({ // create schema with mongoose module
    userName:{
        type:String,
        require:true,
        minlength:5,
        maxlength:50
    },
    email:{
        type:String,
        require: true,
        unique:true//email must be unique
    },
    password:{
        type:String,
        require: true,
        minlength: 5,
        maxlength: 255
    },
});
userSchema.methods.generateAuthToken = function(){//add generateAuthToken to userSchema.methods will give generateAuthToken to User and we can use it like this user.generateAuthToken()
    return jwt.sign({_id:this._id},config.get("jwtPrivateKey"),{ expiresIn:  "1h" });// whenever you use user.generateAuthToken() _id will take from user
};

const User = mongoose.model('User', userSchema);

/**
 * @desc this function is for validate data in user object for register user operation
 * @uses for validation give user object and return error object
 * @examples const { error } = registerValidation({userName:"username",email:"email@email.com",password:"password"})
 * @author hamidreza nasrollahy h.mosaferkocholo@gmail.com
 * @return an object include of error , value ,then, catch
 * @param User this is an object include userName,email,password
 */
function registerValidation(User) {
    const schema = {
        userName: joi.string().min(5).max(50).required(),
        email: joi.string().email().min(5).max(50).required(),
        password: joi.string().min(5).max(50).required().strip()//Marks a key to be removed from a resulting object or array after validation. Used to sanitize output.
    };

    return joi.validate(User, schema);
}
/**
 * @desc this function is for validate data in user object for login user operation
 * @uses for validation give user object and return error object if there is any error then fail rest of operation
 * @examples const { error } = loginValidation({email:"email@email.com",password:"password"})
 * @author hamidreza nasrollahy h.mosaferkocholo@gmail.com
 * @return an object include of error , value ,then, catch
 * @param User this is an object include email,password
 */
function loginValidation(User) {
    const schema = {
        email: joi.string().email().min(5).max(50).required(),
        password: joi.string().min(5).max(50).required().strip()//Marks a key to be removed from a resulting object or array after validation. Used to sanitize output.
    };

    return joi.validate(User, schema);
}
export {User,registerValidation,loginValidation};