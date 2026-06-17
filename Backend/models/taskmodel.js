import mongoose from "mongoose";

const taskschema =  new mongoose.Schema({
    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "users",
  required: true
},
title:{
    type:String,
    required:true,
},
description:{
    type:String,
    required:true
},
priority:{
   type:String,
   enum:["high", "medium", "low"],
   default:"medium"
},
status:{
   type:String,
   enum:["pending", "inprogress", "completed"],
   default:"pending"
},
duedate:{
   type:Date,
  required:true
},
category:{
   type:String,
required:true
},


},
{ timestamps: true }

)

const taskmodel = mongoose.model("tasks", taskschema)
export default taskmodel
