import nodemailer from "nodemailer";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.SENDER_EMAIL,
    pass: config.SENDER_EMAIL_PASSWORD,
  },
});

export const emailSender = async (to: string, token: string) => {
  const info = await transporter.sendMail({
    from: `Healthcare <${config.SENDER_EMAIL}>`,
    to,
    subject: "Reset Password Email",
    html: `<div>
                <h3>Reset Password Email</h3>
                <p>Click <a href="${config.CLIENT_URL}?email=${to}&token=${token}">here</a> to reset your password</p>
           </div>`,
  });

  console.log("Message sent:", info.messageId);
};
