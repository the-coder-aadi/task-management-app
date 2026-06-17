import express from "express"
import jwt from "jsonwebtoken"
import RefreshCheck from "../Middlewares/RefreshCheck.js"
const refreshtokencheck = express.Router()
refreshtokencheck.post("/refreshtokenverification",RefreshCheck,(req,res)=>{
    try {

        const newaccesstoken = jwt.sign(
            {id:req.user.id, name:req.user.name},
            process.env.access_token,
            {expiresIn:"5m"}
        )

             const newrefreshtoken = jwt.sign(
            {id:req.user.id, name:req.user.name},
            process.env.refresh_token,
            {expiresIn:"5d"}
        )

        res.cookie("refresh-token",newrefreshtoken,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge: 5 * 24 * 60 * 60 * 1000
        })

        res.json({
            success:true,
            token:newaccesstoken
        })
                
    } catch (error) {
        res.json({
            success:false,
            msg:"kuch to error aa rah ahai refresh token router mai"
        })
    }
})
export default refreshtokencheck