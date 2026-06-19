import express from "express"
import usermodel from "../models/model.js"
import sendEmail from "../transport.js"
import crypto from "crypto"

const forgotrouter = express.Router()
forgotrouter.post("/forgotpass",async(req,res)=>{
    try {
        
    
const finduser = await usermodel.findOne(
    {email:req.body.email}
)
if (!finduser) {
    return res.json({
        success:false,
        msg:"email does not found in db"
    })
}

const token =  crypto.randomBytes(32).toString("hex")
const resetLink = `http://task-mng-app.vercel.app/reset-password/${token}`;


finduser.resettoken = token
finduser.exptime = Date.now() + 2 * 60 * 1000

await finduser.save()

await sendEmail({
  to: req.body.email,
  subject: "Reset Password",
  html: `<a href="${resetLink}">Reset Password</a>`
})

res.json({
    success:true,
    msg:"reset link send successfully"
})

    } catch (error) {
        res.json({
    success:false,
    msg:"kuch error reset link send nahi ho paygi"
})
    }

})
export default forgotrouter