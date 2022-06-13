const sendEmail = require('../Utils/SendMail')
const crypto = require("crypto");
const User = require('../models/UserModel');
const Token = require('../models/TokenModel');
const bcryptjs = require('bcryptjs');


const Registration = async(req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        
        if(user){
            return res.status(400).send("User with given email already exist!");
        }
        let hashPass = bcryptjs.hashSync(req.body.password, 10);
        user = await new User({
            email: req.body.email,
            password: hashPass,
        }).save();

        let token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const message = `<p> Click<a href='http://localhost:3200/api/verify/${user.id}/${token.token}'> here </a>to verify</p>`;
        await sendEmail(user.email, "Verify Email", 'Please verify your email', message);

        res.status(200).json({message: "An Email sent to your account please verify", data: {email: user.email, _id: user._id}})
    } catch (error) {
        console.log(error);
        res.status(400).send("An error occured");
    }
}


const verifyEmail = async(req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send("Invalid link");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });

        if (!token) return res.status(400).send("Invalid link");
        await User.updateOne({ _id: user._id}, {isEmailVerified: true });
        await Token.findByIdAndRemove(token._id);

        res.send("Thank you, your email verified sucessfully, you can close this window");
    } catch (error) {
        console.log(error);
        res.status(400).send("An error occured");
    }
}


const Login = async(req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if(user){
            let hashPwd = bcryptjs.compareSync(req.body.password, user.password)
            if(!hashPwd){
                return res.status(400).send("Email or Password is incorrect")
            }
            return res.status(200).json({message: "User loggedIn successfully", data: {email: user.email, _id: user._id}});
        }else{
            return res.status(400).send("User does not exist, please register yourself")
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("An error occured");
    }
}


const resetPassLink = async(req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(400).json({message:'User does not exist'})
        }
        let token = await Token.findOne({ userId: user._id });
        if (token) { 
            await token.deleteOne()
      };
      let resetToken = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const message = `<p> Click<a href='http://localhost:3000/reset-password?id=${user._id}&token=${resetToken.token}'> here </a>to reset password</p>`;
        await sendEmail(user.email, "Password Reset", 'Please reset your password', message);

        res.status(200).json({message: "An Email sent to your account please verify"})
      
    } catch (error) {
        res.status(400).json({message: "Something went wrong"})
    }
}


const resetPassword = async(req, res) =>{
    try {
        const user = await User.findOne({ _id: req.body.id });
        if (!user) return res.status(400).send("Invalid link");

        const token = await Token.findOne({
            userId: user._id,
            token: req.body.token,
        });
        if (!token) return res.status(400).send("Invalid link");

        let encryptPass = bcryptjs.hashSync(req.body.password, 10);
        await User.updateOne({ _id: user._id}, {password: encryptPass });
        await Token.findByIdAndRemove(token._id);

        res.send("Your password has been reset successfully");
    } catch (error) {
        res.status(400).send("An error occured")
    }
}
module.exports = { Login, verifyEmail, Registration, resetPassLink, resetPassword }