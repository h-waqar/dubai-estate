import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("Testing Email Configuration...");
  console.log("Host:", process.env.BREVO_SMTP_HOST);
  console.log("Port:", process.env.BREVO_SMTP_PORT);
  console.log("User:", process.env.BREVO_SMTP_USER);
  console.log("Sender:", process.env.SENDER_EMAIL);

  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.BREVO_SMTP_PORT) || 587,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASSWORD,
    },
    debug: true, // Enable debug output
    logger: true // Log to console
  });

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SENDER_NAME || 'Test'}" <${process.env.SENDER_EMAIL}>`,
      to: process.env.SENDER_EMAIL, // Send to self
      subject: "Test Email from Dubai Estate Localhost",
      text: "If you receive this, the SMTP configuration is working correctly!",
      html: "<b>If you receive this, the SMTP configuration is working correctly!</b>",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

main().catch(console.error);
