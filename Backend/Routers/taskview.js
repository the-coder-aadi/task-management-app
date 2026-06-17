import express from "express"
import taskmodel from "../models/taskmodel.js"
const taskviewrouter = express.Router()
taskviewrouter.get("/task/:id",async(req,res)=>{
    try {

    const findtask = await taskmodel.findById(req.params.id)
    if (!findtask) {
        return res.status(401).json({
            success:false,
            msg:"task not found"
        })
    }
    res.json({
        success:true,
        task:findtask
    })
            
    } catch (error) {
        res.json({
            success:false,
            msg:"task find karne par error aa raha hai server side se"
        })
    }
})
export default taskviewrouter