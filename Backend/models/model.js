import mongoose from "mongoose";

const userschema =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
        email:{
        type:String,
        required:true
    },
        pass:{
        type:String,
         default: null 
    },

        provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },

       googleId: {
        type: String,
        default: null
    },

        image: {
        type: String,
        default: null
    },

    resettoken:{
        type:String,
    },
    exptime:{
        type:Date
    }

})

const usermodel = mongoose.model("users", userschema)
export default usermodel
