import mongoose from "mongoose";

const otpschema =  new mongoose.Schema({
        email:{
        type:String,
        required:true
    },
        otp:{
        type:Number,
        required:true,
      
    },
    pass:{
   type:String,
        required:true
    },
    name:{
           type:String,
        required:true
    },
      otpExpiresAt: {
        type: Date,
        required: true
    },
    deleteAt:{
        type:Date,
        required: true,
     expires: 0
    }

})

const otpmodel = mongoose.model("otp", otpschema)
export default otpmodel
