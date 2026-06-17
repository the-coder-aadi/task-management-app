import express from "express"
import { body } from "express-validator"
import validator from "../Middlewares/expressvelidation.js"
const resetpassrouter = express.Router()
import usermodel from "../models/model.js"
import bcrypt from "bcrypt"
resetpassrouter.post("/resetpass",
    [
body("pass").notEmpty().withMessage("password is empty").isStrongPassword().withMessage("keep pass strong"),
    ],
    validator,
    async(req,res)=>{
        try {
            
if (req.body.pass !== req.body.confirmpass) {
    return res.json({
        success:false,
        msg:"passwords do not match"
    })
}
const finduser = await usermodel.findOne({
   resettoken: req.body.token,
   exptime: {$gt: Date.now()}
})

if (!finduser) {
   return res.json({
        success:false,
        msg:"token invalid or not found"
    })
}
const hashed = await bcrypt.hash(req.body.pass, 10)
finduser.pass = hashed
finduser.resettoken = null
finduser.exptime = null
await finduser.save()
res.json({
    success:true,
    msg:"password reset successfully"
})

} catch (error) {
            res.json({
success:false,
msg:"kuch error aa raha hai server side se password ko reset karne par"
            })
            console.log(error)
        }
})
export default resetpassrouter