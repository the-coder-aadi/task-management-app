import express from "express"
import taskmodel from "../models/taskmodel.js"
import Accesstokencheck from "../Middlewares/Accesstokencheck.js"
import validator from "../Middlewares/expressvelidation.js"
import { body } from "express-validator"
import client from "./redis.js"
const savechangesrouter = express.Router()
savechangesrouter.put("/savechanges/:id",
        [
            body("title").notEmpty().withMessage("title is empty please fill it"),
            body("description").notEmpty().withMessage("description is empty please fill it"),
            body("category").notEmpty().withMessage("category is empty please fill it"),
    body("duedate")
      .notEmpty()
      .withMessage("due date is required")
      .custom((value) => {
        const dueDate = new Date(value);
    
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        if (dueDate < today) {
          throw new Error("due date cannot be in the past");
        }
    
        return true;
      })
    
        ],
        validator,
    Accesstokencheck,async(req,res)=>{
try {

    const findandupdate = await taskmodel.findByIdAndUpdate(
        req.params.id,
        req.body,
         {
        returnDocument: "after"
    }
    )
      const userId = req.user.id 
     await client.del(`task:${userId}`)
    res.json({
        success:true,
              task:findandupdate,
        msg:"task update ho chuka hai..."
    })

} catch (error) {
        res.json({
        success:false,
        msg:"task update nhi ho pa raha kuch to error hai"
       
        
    })
     console.log(error);
}
})
export default savechangesrouter