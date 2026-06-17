import express from "express"
import signupmiddle from "../Middlewares/signupmiddle.js"
import otpmiddleware from "../Middlewares/otpmiddleware.js"
import { body } from "express-validator"
import validator from "../Middlewares/expressvelidation.js"
const signuprouter = express.Router()
signuprouter.post("/signup",
    [
        body("email").notEmpty().withMessage("please fill email").isEmail().withMessage("invalid email formate").trim(),
        body("name").notEmpty().withMessage("please fill name").trim(),
        body("pass").notEmpty().withMessage("please fill pass").isStrongPassword().withMessage("keep pass strong").trim()
    ],
 validator,
    signupmiddle,otpmiddleware,async(req,res)=>{

res.json({
    success:true,
    msg:"otp send ho chuka hai dekh lo",
    user:req.body.name,
    email:req.body.email
})
})
export default signuprouter