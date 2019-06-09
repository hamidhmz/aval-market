import mongoose from "mongoose";
import joi from "joi";
import jwt from "jsonwebtoken";
import config from "config";
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        require:true,
        minlength:5,
        maxlength:50
    },
    email:{
        type:String,
        require: true,
        unique:true
    },
    password:{
        type:String,
        require: true,
        minlength: 5,
        maxlength: 255
    },
});
userSchema.methods.generateAuthToken = function(){
    return jwt.sign({_id:this._id},config.get("jwtPrivateKey"),{ expiresIn:  "1h" });
};

const User = mongoose.model('User', userSchema);

function registerValidation(User) {
    const schema = {
        userName: joi.string().min(5).max(50).required(),
        email: joi.string().email().min(5).max(50).required(),
        password: joi.string().min(5).max(50).required().strip()
    };

    return joi.validate(User, schema);
}
function loginValidation(User) {
    const schema = {
        email: joi.string().email().min(5).max(50).required(),
        password: joi.string().min(5).max(50).required().strip()
    };

    return joi.validate(User, schema);
}
export {User,registerValidation,loginValidation};