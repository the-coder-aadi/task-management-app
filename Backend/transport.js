import nodemailer from "nodemailer"
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.gmail,
    pass: process.env.email_app_pass,
  },
  secure: false,
  port: 587
});
export default transport