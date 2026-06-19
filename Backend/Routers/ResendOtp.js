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
    await transport.sendMail({
  from: "TaskForge <codearscommunity@gmail.com>",
  to: req.body.email,
  subject: "Verify your TaskForge account",
  html: `<h1>${otp}</h1>`
})

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