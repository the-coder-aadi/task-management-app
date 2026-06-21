import express from "express"
import otpmodel from "../models/otpmodel.js"
import usermodel from "../models/model.js"

const otpverirouter = express.Router()
otpverirouter.post("/otp",async(req,res)=>{
    try {
const verify = await otpmodel.findOne({
   otp: req.body.otp,
    otpExpiresAt: {$gt: new Date()}
})

if (verify) {

    await usermodel.create({
        name:verify.name,
        email:verify.email,
        pass:verify.pass
    })

      await otpmodel.deleteOne({
        _id: verify._id
    });

        res.json({
        success:true,
        msg:"otp verify successfully"
    })

}
    res.json({
        success:false,
        msg:"otp invalid"
    })
}
 catch (error) {
        res.json({
            success:false,
            msg:"error aa raha hai server side se otp verify karne par"
        })
    }

})
export default otpverirouter
