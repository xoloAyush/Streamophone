import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (!transporter) {
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      throw new Error(
        "EMAIL or EMAIL_PASSWORD is missing from environment variables"
      );
    }
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
}

export const sendWelcomeEmail = async (email, name) => {
  await getTransporter().sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Welcome to StreamoPhone 🎉",
    html: `
      <h2>Hi ${name},</h2>
      <p>Welcome to <b>StreamoPhone</b>.</p>
      <p>Your account has been created successfully.</p>
      <p>Happy learning! 🚀</p>
    `,
  });
};

export const sendLoginEmail = async (email, name) => {
  await getTransporter().sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "New Login",
    html: `
      <h2>Hello ${name},</h2>
      <p>Your StreamoPhone account was just logged into.</p>
      <p>If this wasn't you, please change your password immediately.</p>
    `,
  });
};