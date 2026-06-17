import express from "express"
import usermodel from "../models/model.js"
import jwt from "jsonwebtoken"
const usernameourter = express.Router()
usernameourter.post("/me",async(req,res)=>{
try {
    const token = req.cookies["refresh-token"];
    if (!token) {
       return res.json({
            success:false,
            msg:"refresh token not found balle balle"
        })
    }
    const verify = await jwt.verify(token, process.env.refresh_token)
     res.json({
            success:true,
            username:verify.name
        })
} catch (error) {
      res.json({
            success:false,
            msg:"token invalid"
        })
}
})
export default usernameourter