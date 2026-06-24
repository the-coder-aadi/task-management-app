import express from "express"
import taskmodel from "../models/taskmodel.js"
import Accesstokencheck from "../Middlewares/Accesstokencheck.js"
import client from "./redis.js"
const deleterouter = express.Router()
deleterouter.delete("/delete/:id", Accesstokencheck,async(req,res)=>{
    try {
            const userid = req.data.id
        await client.del(`task:${userId}`)
        await taskmodel.findByIdAndDelete(req.params.id)
        res.json({
            success:true,
            msg:"task is deleted"
        })
    
    } catch (error) {
            res.json({
            success:false,
            msg:"task is not deleted"
        })
    }
})

export default deleterouter