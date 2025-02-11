const express = require("express");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const router = express.Router();

// OAuth2 Credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

if (
  !CLIENT_ID ||
  !CLIENT_SECRET ||
  !REDIRECT_URI ||
  !REFRESH_TOKEN ||
  !SENDER_EMAIL
) {
  console.error("❌ Missing environment variables. Please check .env file.");
  process.exit(1);
}

// Set up OAuth2 Client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Function to send email
async function sendMail(to, subject, text) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    if (!accessToken) throw new Error("Failed to retrieve access token.");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `"Contact Form" <${SENDER_EMAIL}>`,
      to,
      subject,
      text,
    };

    console.log(
      `📩 Sending email to: ${to} \nSubject: ${subject} \nText: ${text}`
    );
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", result.response);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
}

// API Route for sending email
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const subject = "New Contact Form Submission";
    const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

    await sendMail("yogesh798714@gmail.com", subject, text);

    res.status(200).json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "❌ Error sending email", details: error.message });
  }
});

module.exports = router;
