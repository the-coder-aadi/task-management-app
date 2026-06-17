import { validationResult } from "express-validator";
function validator(req,res,next) {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.json({
            success:false,
            error:error.array()
        })
    }
    next()
}
export default validator