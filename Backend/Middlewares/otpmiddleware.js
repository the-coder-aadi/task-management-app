import transport from "../transport.js";
import otpmodel from "../models/otpmodel.js";
import bcrypt from "bcrypt"
async function otpmiddleware(req,res,next) {
    try {
        const otp = await Math.floor(100000+Math.random()*900000)
const hashed = await bcrypt.hash(req.body.pass, 10)
await transport.emails.send({
  from: "TaskForge Security <onboarding@resend.dev>",
  to: req.body.email,
  subject: `Your TaskForge verification code: ${otp}`,
  text: `Your TaskForge verification code is ${otp}. This code expires in 1 minute. If you did not request this, please ignore this email.`,
  html: `
    <div style="font-family: Arial, sans-serif; background:#ffffff; padding:24px; color:#111827;">
      
      <div style="max-width:520px; margin:auto; border:1px solid #e5e7eb; border-radius:10px; padding:28px;">
        
        <h2 style="margin:0 0 16px 0;">
          TaskForge Account Verification
        </h2>

        <p style="font-size:15px; line-height:1.6;">
          Hello,
        </p>

        <p style="font-size:15px; line-height:1.6;">
          Use the verification code below to complete your sign up.
        </p>

        <div style="margin:24px 0; text-align:center;">
          <div style="font-size:30px; font-weight:700; letter-spacing:5px;">
            ${otp}
          </div>
        </div>

        <p style="font-size:14px; line-height:1.6; color:#4b5563;">
          This code will expire in 1 minute.
        </p>

        <p style="font-size:14px; line-height:1.6; color:#4b5563;">
          If you did not request this email, you can safely ignore it.
        </p>

        <hr style="margin:24px 0; border:none; border-top:1px solid #e5e7eb;" />

        <p style="font-size:12px; color:#6b7280;">
          TaskForge Security Team
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