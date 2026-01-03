import express from "express";
import { Resend } from "resend";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

/* ================= STRICT VALIDATION HELPERS ================= */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const blockedPrefixes = ["test", "fake", "demo", "temp"];
const disposableDomains = [
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "guerrillamail.com",
];

const isValidEmail = (email) => {
  if (!emailRegex.test(email)) return false;

  const [local, domain] = email.toLowerCase().split("@");

  if (blockedPrefixes.some((p) => local.startsWith(p))) return false;
  if (disposableDomains.includes(domain)) return false;

  return true;
};

const isMeaningfulMessage = (msg) => {
  const text = msg.trim();

  // Allow short human messages
  if (text.length < 2) return false;

  // Reject pure random keyboard smash (no vowels at all)
  const hasVowel = /[aeiou]/i.test(text);

  return hasVowel;
};


/* ============================================================= */

router.post("/", async (req, res) => {
  console.log("🔥 FEEDBACK API HIT FROM BROWSER");
  console.log("BODY:", req.body);

  const { email, message } = req.body;

  if (!email || !message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email and message required",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address",
    });
  }

  if (!isMeaningfulMessage(message)) {
    return res.status(400).json({
      success: false,
      message: "Message is not meaningful",
    });
  }

  try {
    await resend.emails.send({
      from: "NovaOS <no-reply@resend.dev>",
      to: ["vishaldev111a@gmail.com"],
      reply_to: email,
      subject: "NovaOS Feedback / Suggestion",
      text: `
New feedback received on NovaOS

From Email:
${email}

Message:
${message}
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Feedback email error:", error);
    res.status(500).json({ success: false });
  }
});

export default router;
