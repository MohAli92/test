// Twilio WhatsApp verification utility
const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

// Validate environment variables
if (!accountSid || !authToken || !whatsappFrom) {
  console.warn('⚠️  Twilio environment variables not found. WhatsApp verification will be disabled.');
  console.warn('Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM');
}

let client;
try {
  client = twilio(accountSid, authToken);
  console.log('✅ Twilio client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Twilio client:', error.message);
  client = null;
}

// In-memory store for phone verifications (for demo, use Redis/DB in production)
const phoneVerifications = {};

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationCode(phone) {
  try {
    // Check if Twilio is properly configured
    if (!client) {
      throw new Error('Twilio client not initialized. Check your environment variables.');
    }

    // Validate phone number format
    if (!phone || typeof phone !== 'string') {
      throw new Error('Invalid phone number format');
    }

    // Ensure phone number has country code
    let formattedPhone = phone;
    if (!phone.startsWith('+')) {
      formattedPhone = `+${phone}`;
    }

    const code = generateCode();
    phoneVerifications[phone] = { 
      code, 
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0 
    };

    console.log(`📱 Attempting to send WhatsApp code to: ${formattedPhone}`);

    // Send WhatsApp message with timeout and retry logic
    const message = await Promise.race([
      client.messages.create({
        from: whatsappFrom,
        to: `whatsapp:${formattedPhone}`,
        body: `Your Share Dish verification code is: ${code}\n\nThis code will expire in 5 minutes.`
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
    ]);

    console.log(`✅ WhatsApp code sent successfully to ${formattedPhone}`);
    console.log(`📋 Message SID: ${message.sid}`);
    
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('❌ Failed to send WhatsApp code:', error);
    
    // Provide specific error messages for common issues
    let errorMessage = 'Failed to send WhatsApp code';
    
    if (error.code === 21211) {
      errorMessage = 'Invalid phone number format. Please include country code (e.g., +1234567890)';
    } else if (error.code === 21214) {
      errorMessage = 'Phone number is not a valid WhatsApp number';
    } else if (error.code === 21608) {
      errorMessage = 'WhatsApp messaging is not enabled for this account';
    } else if (error.code === 21610) {
      errorMessage = 'Message content violates WhatsApp policies';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timeout. Please check your internet connection and try again';
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Network error. Please check your internet connection';
    } else if (error.message.includes('authentication')) {
      errorMessage = 'Twilio authentication failed. Please check your credentials';
    }
    
    throw new Error(errorMessage);
  }
}

function verifyCode(phone, code) {
  try {
    const entry = phoneVerifications[phone];
    
    if (!entry) {
      console.log(`❌ No verification code found for phone: ${phone}`);
      return false;
    }
    
    if (Date.now() > entry.expires) {
      console.log(`❌ Verification code expired for phone: ${phone}`);
      delete phoneVerifications[phone];
      return false;
    }
    
    if (entry.code !== code) {
      entry.attempts = (entry.attempts || 0) + 1;
      console.log(`❌ Invalid verification code for phone: ${phone}. Attempts: ${entry.attempts}`);
      
      // Delete after 3 failed attempts
      if (entry.attempts >= 3) {
        delete phoneVerifications[phone];
        console.log(`❌ Too many failed attempts for phone: ${phone}. Code deleted.`);
      }
      return false;
    }
    
    console.log(`✅ Verification code verified successfully for phone: ${phone}`);
    delete phoneVerifications[phone];
    return true;
  } catch (error) {
    console.error('❌ Error during code verification:', error);
    return false;
  }
}

// Clean up expired codes periodically
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  
  Object.keys(phoneVerifications).forEach(phone => {
    if (phoneVerifications[phone].expires < now) {
      delete phoneVerifications[phone];
      cleanedCount++;
    }
  });
  
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned up ${cleanedCount} expired verification codes`);
  }
}, 60000); // Run every minute

module.exports = { sendVerificationCode, verifyCode }; 