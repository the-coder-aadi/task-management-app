import express from "express"
const logoutrouter = express.Router()
logoutrouter.post("/logout",(req,res)=>{
    try {
   res.clearCookie("refresh-token",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
   })
   res.json({
    success:true,
    msg:"logout ho gya bhai...."
   })
           
    } catch (error) {
        res.json({
            success:false,
            msg:"logout nahi ho raha"
        })
    }
})
export default logoutrouter