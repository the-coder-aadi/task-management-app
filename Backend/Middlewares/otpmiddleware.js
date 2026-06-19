import transport from "../transport.js";
import otpmodel from "../models/otpmodel.js";
import bcrypt from "bcrypt"
async function otpmiddleware(req,res,next) {
    try {
        const otp = await Math.floor(100000+Math.random()*900000)
const hashed = await bcrypt.hash(req.body.pass, 10)
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

        await otpmodel.create({
            email:req.body.email,
            otp:otp,
            pass:hashed,
            name:req.body.name,
           otpExpiresAt: new Date(Date.now() + 60 * 1000),
             deleteAt: new Date(Date.now() + 15 * 60 * 1000)
        })
        next()

    } catch (error) {
        console.log("🔥 EMAIL ERROR FULL:", error);
        res.json({
            success:false,
            msg:"server side error ki bajah se otp send nahi ho paygi"
        })
        console.log(error)
    }
}
export default otpmiddleware