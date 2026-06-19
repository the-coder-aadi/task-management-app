import transport from "../transport.js";
import otpmodel from "../models/otpmodel.js";
import bcrypt from "bcrypt"
async function otpmiddleware(req,res,next) {
    try {
        const otp = await Math.floor(100000+Math.random()*900000)
const hashed = await bcrypt.hash(req.body.pass, 10)
await transport.sendMail({
  from: "TaskForge <codearscommunity@gmail.com>",
  to: req.body.email,
  subject: "Verify your TaskForge account",
  html: `<h1>${otp}</h1>`
})

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