const mongo=require('mongoose');
const {Schema}=mongo;

const transactionSchema=new Schema({
   transactionType:{
      type:String,
      enum:['cr','dr'],
      required:[true,'Transaction type is required (cr or dr)']
   },
   transactionAmount:{
      type:Number,
      required:[true,'Transaction amount is required'],
      min:[1,'Amount must be greater than 0']
   },
   category:{
      type:String,
      enum:['salary','deposit','withdrawal','transfer','loan','fee','other'],
      required:[true,'Category is required']
   },
   notes:{
      type:String,
      maxlength:[300,'Notes cannot exceed 300 characters'],
      default:''
   },
   refrence:String,
   currentBalance:Number,
   accountNo:{
      type:String,
      required:[true,'Account number is required']
   },
   key:String,
   branch:{
      type:String,
      required:[true,'Branch is required']
   },
   customerId:String
},{timestamps:true});

module.exports=mongo.model('transaction',transactionSchema);
