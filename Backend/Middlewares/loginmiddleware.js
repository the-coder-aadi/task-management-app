import usermodel from "../models/model.js";
import bcrypt from "bcrypt"
async function Loginmiddleware(req, res, next) {
    try {
       
        const finduser = await usermodel.findOne({
            email:req.body.email,
        })
              if (!finduser) {
            return res.json({
                success:false,
                msg:"user not found please signup first"
            })
        }
        const ismatch = await bcrypt.compare(req.body.pass, finduser.pass)
  
        if (!ismatch) {
               return res.json({
                success:false,
                msg:"incorrect password"
            })
        }

        req.data = finduser
        next()
        
    } catch (error) {
         res.json({
                success:false,
                msg:"server side error hai loginmiddleware mai"
            })
            console.log(error)
    }
}
export default Loginmiddleware