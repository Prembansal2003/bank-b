const express=require("express");
const router=express.Router();
const currencySchema=require("../model/currency.model");
const controller=require("../controller/controller");
const { verifyToken, isAdmin } = require("../middlewares/midddleware");

router.get('/',(req,res)=>(
    controller.getData(req,res,currencySchema)
));
router.post("/",verifyToken,isAdmin,(req,res)=>{
    controller.createData(req,res,currencySchema)
});
router.put("/:id",verifyToken,isAdmin,(req,res)=>{
    controller.updateData(req,res,currencySchema)
});
router.delete("/:id",verifyToken,isAdmin,(req,res)=>{
    controller.deleteData(req,res,currencySchema);
});
module.exports=router;

