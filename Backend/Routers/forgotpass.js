import express from "express"
import usermodel from "../models/model.js"
import transport from "../transport.js"
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

await transport.emails.send({
  from: "TaskForge <onboarding@resend.dev>",
  to: req.body.email,
  subject: "Reset your TaskForge password",
  html: `
    <div style="font-family: Arial, sans-serif; padding:20px; background:#f8fafc;">
      <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:12px;">
        
        <h1 style="color:#2563eb; text-align:center;">TaskForge</h1>

        <p>You requested a password reset.</p>

        <p>Click the button below to reset your password:</p>

        <div style="text-align:center; margin:30px 0;">
          <a href="${resetLink}"
             style="background:#2563eb; color:white; padding:12px 20px; text-decoration:none; border-radius:8px;">
             Reset Password
          </a>
        </div>

        <p>This link will expire in 2 minutes.</p>

      </div>
    </div>
  `
});

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