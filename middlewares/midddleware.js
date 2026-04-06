const jwt=require("jsonwebtoken");
require("dotenv").config();
const verifyToken=(req,res,next)=>{
    try{
        
        const authHeader=req.headers.authorization;
        if(!authHeader||!authHeader.startsWith("Bearer")){
            return res.status(401).json({
                message:"Unathourized token missing"
            })
        }
        const token=authHeader.split(" ")[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(err){
        return res.status(401).json({
            message:"Invalid or expired token"
        })
    }
}
const isAdmin=(req,res,next)=>{
    if(req.user?.userType=="admin"){
        return next();
    }
    return res.status(401).json({message:"Access denied"});
}
const isAdminEmployee=(req,res,next)=>{
    if(["admin","employee"].includes(req.user?.userType)){
        return next();
    }
    return res.status(401).json({
        message:"Access denied",
    })
}
const isAdminEmployeeCustomer=(req,res,next)=>{
    if(["admin","employee","customer"].includes(req.user?.userType)){
        return next();
    }
    return res.status(401).json({
        message:"Access denied",
    })
}
module.exports={verifyToken,isAdmin,isAdminEmployee,isAdminEmployeeCustomer};
