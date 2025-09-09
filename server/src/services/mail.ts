import nodemailer from "nodemailer";
import { mailConfig } from "../configs";

class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(mailConfig);
  }

  sendTestMail = async () => {
    const info = await this.transporter.sendMail({
      from: mailConfig.from,
      to: "test@example.com",
      subject: "Test Email",
      text: "This is a test email.",
    });

    console.log("Message sent: %s", info.messageId);
  };

  sendWelcomeEmail = async (email: string) => {
    const info = await this.transporter.sendMail({
      from: mailConfig.from,
      to: email,
      subject: "Welcome to our platform!",
      html: `<p>Thank you for joining our platform!</p>`,
    });

    console.log("Message sent: %s", info.messageId);
  };

  sendResetPasswordEmail = async (email: string, resetToken: string) => {
    const info = await this.transporter.sendMail({
      from: mailConfig.from,
      to: email,
      subject: "Reset Password",
      html: `<p>Click <a href="http://localhost:3000/reset-password/${resetToken}">here</a> to reset your password.</p>`,
    });

    console.log("Message sent: %s", info.messageId);
  };

  sendVerificationEmail = async (email: string, verificationToken: string) => {
    const info = await this.transporter.sendMail({
      from: mailConfig.from,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click <a href="http://localhost:3000/verify-email/${verificationToken}">here</a> to verify your email.</p>`,
    });

    console.log("Message sent: %s", info.messageId);
  };
}

const mailService = new MailService();

export default mailService;
