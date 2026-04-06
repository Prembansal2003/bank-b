const bcrypt=require("bcrypt");
const mongo=require('mongoose');
const {Schema}=mongo;
const userSchema=new Schema({
    fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
},
    mobile:{
        type:String,
        required:[true,'Mobile number is required'],
        match:[/^\d{10}$/,'Mobile number must be exactly 10 digits']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'Email is required'],
        match:[/^\S+@\S+\.\S+$/,'Please enter a valid email address']
    },
    key:String,
    password:{
        type:String,
        required:[true,'Password is required']
    },
    profile:String,
    address:{
        type:String,
        required:[true,'Address is required']
    },
    branch:{
        type:String,
        required:[true,'Branch is required']
    },
    userType:{
        type:String,
        enum:['admin','employee','customer'],
        required:[true,'User type is required']
    },
    isActive:{
        type:Boolean,
        default:false
    }

 },{timestamps:true});
userSchema.pre('save',async function(next){
    const user=this;
    if(!user.isModified('password')){
        return next();
    }
    const salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password,salt);
})
 module.exports=mongo.model('user',userSchema);
