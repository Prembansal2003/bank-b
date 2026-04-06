const express=require("express");
const router=express.Router();
const rateLimit=require("express-rate-limit");
const userSchema=require("../model/users.model");
const loginController=require("../controller/login.controller");
const { validateLogin } = require("../middlewares/validate");

const loginLimiter=rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message:{
        message:"Too many login attempts. Please try again after 15 minutes.",
        isLogged:false
    }
});

router.post('/',loginLimiter,validateLogin,(req,res)=>{
    loginController.loginFunc(req,res,userSchema)
});

module.exports=router;
