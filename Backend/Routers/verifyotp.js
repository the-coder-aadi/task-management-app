import express from "express"
import usermodel from "../models/model.js"
import client from "./redis.js"

const otpverirouter = express.Router()

otpverirouter.post("/otp", async (req, res) => {
    try {

        const verify = await client.get(req.body.email)

        if (!verify) {
            return res.json({
                success:false,
                msg:"otp expired"
            })
        }

        const parsedData = JSON.parse(verify)

        if (parsedData.otp != req.body.otp) {
            return res.json({
                success:false,
                msg:"otp invalid"
            })
        }

        await usermodel.create({
            name: parsedData.name,
            email: req.body.email,
            pass: parsedData.pass
        })

        await client.del(req.body.email)

        return res.json({
            success:true,
            msg:"otp verify successfully"
        })

    } catch (error) {
        res.json({
            success:false,
            msg:"error aa raha hai server side se otp verify karne par"
        })
    }
})

export default otpverirouter