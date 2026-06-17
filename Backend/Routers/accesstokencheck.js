import express from "express"
import jwt from "jsonwebtoken"
import Accesstokencheck from "../Middlewares/Accesstokencheck.js"
const accesstokencheck = express.Router()
accesstokencheck.post("/accesstokenverification",Accesstokencheck,(req,res)=>{
res.json({
    success:true,
    msg:"access token is valid"
})

})
export default accesstokencheck