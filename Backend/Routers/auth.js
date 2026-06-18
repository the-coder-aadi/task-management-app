import express from "express"
const authrouter = express.Router()
import jwt from "jsonwebtoken"
import passport from "passport"
authrouter.get("/auth/google", passport.authenticate("google",
    {scope:["email", "profile"]}
))

authrouter.get("/auth/google/callback", passport.authenticate("google",{
    session:false
}),(req,res)=>{
        const token = jwt.sign(
      {
        id: req.user.id,
        name: req.user.name
      },
      process.env.refresh_token,
      { expiresIn: "5d" }
    )

        res.cookie("refresh-token", token, {
      httpOnly: true,
  sameSite: "none",
secure: true,
      maxAge: 5 * 24 * 60 * 60 * 1000
    })

   res.redirect("https://task-mng-app.vercel.app/")

})
export default authrouter