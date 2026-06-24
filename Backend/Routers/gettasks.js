import express from "express"
import taskmodel from "../models/taskmodel.js"
import jwt from "jsonwebtoken"
const gettasksrouter = express.Router()
gettasksrouter.post("/gettasks",async(req,res)=>{
    try {

const token = req.headers.authorization
if (!token) {
    return res.json({
        success:false,
        msg:"token not found"
    })
}
const decoded = await jwt.verify(token, process.env.access_token)
const findtasks = await taskmodel.find({
    user:decoded.id
})
res.json({
    success:true,
    tasks:findtasks
})

    } catch (error) {
        console.log(error);
          if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    msg: "Access token expired"
                })
            }
        res.json({
            success:false,
            msg:"error in get tasks server side"
        })
    }
})
export default gettasksrouter