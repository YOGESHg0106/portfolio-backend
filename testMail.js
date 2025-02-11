const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendTestMail() {
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
      from: `"Test Email" <${SENDER_EMAIL}>`,
      to: "yogesh798714@gmail.com",
      subject: "Test Email from Node.js",
      text: "Hello! This is a test email to check if everything is working.",
    };

    console.log(`📩 Sending test email to: ${mailOptions.to}`);
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Test Email Sent Successfully:", result.response);
  } catch (error) {
    console.error("❌ Error Sending Test Email:", error.message);
  }
}

// Run the test function
sendTestMail();
