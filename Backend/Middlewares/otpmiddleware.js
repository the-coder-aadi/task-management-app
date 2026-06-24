import sendEmail from "../transport.js";
import client from "../Routers/redis.js";

import otpmodel from "../models/otpmodel.js";
import bcrypt from "bcrypt"
async function otpmiddleware(req,res,next) {
    try {
        const otp = await Math.floor(100000+Math.random()*900000)
const hashed = await bcrypt.hash(req.body.pass, 10)

const existing = await client.get(`otp_limit:${req.body.email}`)

if (existing) {
    return res.json({
        success:false,
        msg:"wait for 1 min"
    })
}

   await sendEmail({
      to: req.body.email,
      subject: "Verify your TaskForge account",
      html: `<h1>${otp}</h1>`
    })

        // await otpmodel.create({
        //     email:req.body.email,
        //     otp:otp,
        //     pass:hashed,
        //     name:req.body.name,
        //    otpExpiresAt: new Date(Date.now() + 60 * 1000),
        //      deleteAt: new Date(Date.now() + 15 * 60 * 1000)
        // })
        await client.set(
    req.body.email,
    JSON.stringify({
        otp,
        name:req.body.name,
        pass:hashed
    }),
    {
        ex: 60
    }
)

await client.set(
    `otp_limit:${req.body.email}`,
    "sent",
    {
        ex:60
    }
)

console.log("OTP saved in Redis")
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