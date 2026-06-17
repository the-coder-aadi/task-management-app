import jwt from "jsonwebtoken"
async function RefreshCheck(req,res, next) {
    try {
        const token = req.cookies["refresh-token"]
        if (!token) {
          return res.status(401).json({
   success:false,
   msg:"refresh token is not found"
})
        }
        const verify = jwt.verify(token, process.env.refresh_token)
req.user = verify
next()

    } catch (error) {

         res.clearCookie("refresh-token")
 return res.status(401).json({
   success:false,
   msg:"refresh token is not valid"
})
        
    }
}
export default RefreshCheck