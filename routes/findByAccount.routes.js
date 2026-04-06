const express=require("express");
const router=express.Router();
const customerSchema=require("../model/customer.model");
const controller=require("../controller/controller");

router.post("/",(req,res)=>{
    controller.findByAccountNo(req,res,customerSchema)
});

module.exports=router;