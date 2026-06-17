import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGODBURL)
       
        console.log("db connect ho gya")
    } catch (error) {
        console.log(error)
    }
}
export default connectdb