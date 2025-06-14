import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const fromEmail = process.env.FROM_EMAIL || "no-reply@yourdomain.com";

// For Gmail, enable "App Passwords" or "Allow less secure apps" in your Google Account
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `Orbit <${fromEmail}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", to, "by", fromEmail);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};