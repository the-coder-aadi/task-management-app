import express from "express"
import Loginmiddleware from "../Middlewares/loginmiddleware.js"
import validator from "../Middlewares/expressvelidation.js"
import { body } from "express-validator"
import jwt from "jsonwebtoken"
const loginrouter = express.Router()
loginrouter.post("/login",
        [
        body("email").notEmpty().withMessage("please fill email").trim(),
        body("pass").notEmpty().withMessage("please fill pass").trim()
    ],
 validator,
    
    Loginmiddleware,(req,res)=>{
try {
    const Accesstoken =  jwt.sign(
        {id: req.data._id, name:req.data.name},
        process.env.access_token,
        {expiresIn:"5m"}
    )

        const Refreshtoken =  jwt.sign(
        {id: req.data._id, name:req.data.name},
        process.env.refresh_token,
        {expiresIn:"5d"}
    )

     res.cookie("refresh-token", Refreshtoken,{
        httpOnly:true,
      sameSite: "none",
secure: true,
        maxAge: 5 * 24 * 60 * 60 * 1000
    })

    res.json({
        success:true,
        token:Accesstoken,
        image:req.data.image,
        username:req.data.name

    })

} catch (error) {
    res.json({
        success:false,
        msg:"server side error hai login router mai"
    })
}
})
export default loginrouter