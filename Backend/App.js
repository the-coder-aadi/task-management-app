import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import connectdb from "./db.js"
import signuprouter from "./Routers/Signup.js"
import otpverirouter from "./Routers/verifyotp.js"
import loginrouter from "./Routers/Login.js"
import cookieParser from "cookie-parser"
import accesstokencheck from "./Routers/accesstokencheck.js"
import refreshtokencheck from "./Routers/refreshtokencheck.js"
import forgotrouter from "./Routers/forgotpass.js"
import resetpassrouter from "./Routers/resetpass.js"
import authrouter from "./Routers/auth.js"
import passport from "passport"
import "./config/passport.js"
import logoutrouter from "./Routers/logout.js"
import createtaskrouter from "./Routers/createtask.js"
import gettasksrouter from "./Routers/gettasks.js"
import usernameourter from "./Routers/username.js"
import taskviewrouter from "./Routers/taskview.js"
import deleterouter from "./Routers/delete.js"
import savechangesrouter from "./Routers/savechanges.js"
import Resendotprouter from "./Routers/ResendOtp.js"
const server = express()
server.use(express.json())
server.use(cors({
    origin: [
    "http://localhost:5173",
    "https://task-mng-app.vercel.app"
  ], 
  
  credentials: true
}));
server.use(cookieParser())
connectdb()
server.use(passport.initialize())
server.use("/", signuprouter)
server.use("/", otpverirouter)
server.use("/",loginrouter)
server.use("/",accesstokencheck)
server.use("/",refreshtokencheck)
server.use("/",forgotrouter)
server.use("/", resetpassrouter)
server.use("/",authrouter)
server.use("/", logoutrouter)
server.use("/", createtaskrouter)
server.use("/", gettasksrouter)
server.use("/", usernameourter)
server.use("/",taskviewrouter)
server.use("/", deleterouter)
server.use("/", savechangesrouter)
server.use("/", Resendotprouter)

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on", PORT);
});