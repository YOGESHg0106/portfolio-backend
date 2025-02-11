const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("📥 Saving to MongoDB:", { name, email, message });

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    console.log("✅ Message saved to MongoDB");

    res
      .status(201)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ MongoDB Save Error:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
});

module.exports = router;
