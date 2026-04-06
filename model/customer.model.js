const mongo=require('mongoose');
const {Schema}=mongo;
const customerSchema=new Schema({
   accountNo:String,
   fullName:{
      type:String,
      required:[true,'Full name is required'],
      trim:true
   },
   mobile:{
      type:String,
      required:[true,'Mobile number is required'],
      match:[/^\d{10}$/,'Mobile number must be exactly 10 digits']
   },
   password:{
      type:String,
      required:[true,'Password is required']
   },
   fatherName:{
      type:String,
      required:[true,"Father's name is required"]
   },
   email:{
    type:String,
    unique:true,
    required:[true,'Email is required'],
    match:[/^\S+@\S+\.\S+$/,'Please enter a valid email address']
   },
   dob:{
      type:String,
      required:[true,'Date of birth is required']
   },
   gender:{
      type:String,
      enum:['male','female','other'],
      required:[true,'Gender is required']
   },
   currency:String,
   key: String,
   profile: String,
   signature:String,
   document:String,
   finalBalance:{
    type:Number,
    default:0
   },
   address:{
      type:String,
      required:[true,'Address is required']
   },
   userType:String,
   branch:{
      type:String,
      required:[true,'Branch is required']
   },
   createdBy:String,
   customerLoginId:String,
   isActive:{
    type:Boolean,
    default:false
   }
 },{timestamps:true});

 module.exports=mongo.model('customer',customerSchema);
