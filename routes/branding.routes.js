const express=require("express");
const router=express.Router();
const brandingSchema=require("../model/branding.model");
const controller=require("../controller/controller");
router.get('/',(req,res)=>(
    controller.getData(req,res,brandingSchema)
));
router.post("/",(req,res)=>{
    controller.createData(req,res,brandingSchema)
});
router.put("/:id",(req,res)=>{
    controller.updateData(req,res,brandingSchema)
});
router.delete("/:id",(req,res)=>{
    controller.deleteData(req,res,brandingSchema);
});
module.exports=router;