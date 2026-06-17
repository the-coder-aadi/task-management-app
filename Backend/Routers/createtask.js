import express from "express"
import taskmodel from "../models/taskmodel.js"
import validator from "../Middlewares/expressvelidation.js"
import { body } from "express-validator"
import jwt from "jsonwebtoken"
const createtaskrouter = express.Router()
createtaskrouter.post("/createtask",
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
    validator, async (req, res) => {
        try {
            const token = req.headers.authorization
            
            if (
    !token ||
    token === "null" ||
    token === "undefined"
) {
    return res.status(401).json({
        success: false,
        msg: "Token not found"
    });
}
            const verify = jwt.verify(token, process.env.access_token)

            await taskmodel.create({
                title: req.body.title,
                description: req.body.description,
                priority: req.body.priority || undefined,
                status: req.body.status || undefined,
                duedate: req.body.duedate,
                category: req.body.category,
                user: verify.id
            })
            res.json({
                success: true,
                msg: "task create ho chuka hai db mai"

            })

        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    msg: "Access token expired"
                })
            }
            res.json({
                success: false,
                msg: "kuch error aa raha hai server side se task create krne par"

            })
            console.log(error);

        }

    })
export default createtaskrouter