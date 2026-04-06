const express=require("express");
const router=express.Router();
const branchSchema=require("../model/branch.model");
const controller=require("../controller/controller");
const { verifyToken, isAdmin } = require("../middlewares/midddleware");

router.get('/',(req,res)=>(
    controller.getData(req,res,branchSchema)
));
router.post("/",verifyToken,isAdmin,(req,res)=>{
    controller.createData(req,res,branchSchema)
});
router.put("/:id",verifyToken,isAdmin,(req,res)=>{
    controller.updateData(req,res,branchSchema)
});
router.delete("/:id",verifyToken,isAdmin,(req,res)=>{
    controller.deleteData(req,res,branchSchema);
});
module.exports=router;
