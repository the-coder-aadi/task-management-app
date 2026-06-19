import express from "express"
import otpmodel from "../models/otpmodel.js"
import transport from "../transport.js";
const Resendotprouter = express.Router()
Resendotprouter.post("/resendotp",async(req,res)=>{
    try {
        const finduser = await otpmodel.findOne({
            email: req.body.email
        })
        if (!finduser) {
            return res.json({
                success:false,
                msg:"signup session expire"
            })
        }
        const otp = await Math.floor(100000+Math.random()*900000)
             await transport.emails.send({
  from: "TaskForge <onboarding@resend.dev>",
  to: req.body.email,
  subject: "Verify your TaskForge account",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background:#f8fafc;">
      
      <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
        
        <h1 style="color:#2563eb; text-align:center; margin-bottom:10px;">
          TaskForge
        </h1>

        <p style="font-size:16px; color:#334155;">
          Hello,
        </p>

        <p style="font-size:15px; color:#475569;">
          Use the OTP below to verify your account:
        </p>

        <div style="text-align:center; margin:30px 0;">
          <span style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#111827;">
            ${otp}
          </span>
        </div>

        <p style="font-size:14px; color:#64748b;">
          This OTP is valid for 1 minute.
        </p>


      </div>
    </div>
  `
});
        finduser.otp = otp
        finduser.otpExpiresAt = new Date(Date.now() + 60 * 1000)
        await finduser.save()
        res.json({
            success:true,
            msg:"otp send successfully"
        })
        
    } catch (error) {
            res.json({
            success:false,
            msg:"kuch error aa raha hai resend otp router mai"
        })
    }
})
export default Resendotprouter