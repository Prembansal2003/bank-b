const express=require("express");
const router=express.Router();
const emailcontroller=require("../controller/email.controller");
router.post('/',emailcontroller);
module.exports=router;