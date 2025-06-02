import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
    }
})

const sendMail=async(to,subject,text,html)=>{
    try{
       await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
       })
    }catch(err){   
    console.error("Email sending failed:", err.message);
    throw err;
    }
}
export default sendMail;