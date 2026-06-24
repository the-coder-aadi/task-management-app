import jwt from "jsonwebtoken"
async function Accesstokencheck(req, res, next) {
       try {
           const token = req.headers.authorization

           if (!token) {
            return res.status(401).json({
                success:false,
                msg:"access token not found"
            })
           }
       
   const verify = jwt.verify(token, process.env.access_token)
   req.data = verify
   next()

       } catch (error) {
return res.status(401).json({
   success:false,
   msg:"Access token invalid"
})
       }
}
export default Accesstokencheck