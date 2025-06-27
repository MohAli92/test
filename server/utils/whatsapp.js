// Twilio WhatsApp verification utility
const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

const client = twilio(accountSid, authToken);

// In-memory store for phone verifications (for demo, use Redis/DB in production)
const phoneVerifications = {};

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationCode(phone) {
  const code = generateCode();
  phoneVerifications[phone] = { code, expires: Date.now() + 5 * 60 * 1000 };
  await client.messages.create({
    from: `whatsapp:${whatsappFrom}`,
    to: `whatsapp:${phone}`,
    body: `Your Share Dish verification code is: ${code}`
  });
  return true;
}

function verifyCode(phone, code) {
  const entry = phoneVerifications[phone];
  if (!entry) return false;
  if (Date.now() > entry.expires) return false;
  if (entry.code !== code) return false;
  delete phoneVerifications[phone];
  return true;
}

module.exports = { sendVerificationCode, verifyCode }; 