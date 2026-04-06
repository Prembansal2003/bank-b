const express=require("express");
const router=express.Router();
const tokenService= require("../services/token.services");
router.get("/",async(req,res)=>{
    const verified=await tokenService.verifyToken(req,res);
    if(verified.isVerified){
        return res.status(200).json({
            messsage:"Token Verified",
            data:verified.data,
            isVerified:true
        })
    }
    else{
        return res.status(401).json({
            message:"Unauthorized User",
            isVerified:false
        })
    }
});

module.exports=router;