import usermodel from "../models/model.js";
async function signupmiddle(req,res,next) {
    try {
        console.log(req.body.name)
        const finduser = await usermodel.findOne({
            email:req.body.email
        })
        if (finduser) {
            return res.json({
                success:false,
                msg:"user already exist"
            })
        }
       
     next()
    } catch (error) {
        res.json({
                success:false,
                msg:"server side error in signup middleware"
            })
            console.log(error)
    }
}
export default signupmiddle