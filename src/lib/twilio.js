import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client;

try {
  client = twilio(accountSid, authToken);
} catch (error) {
  console.error('Failed to initialize Twilio client:', error);
}

export async function sendSMS(to, message) {
  if (!client) {
    console.log(`SIMULATED SMS to ${to}: ${message}`);
    return { success: true, simulated: true };
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to
    });
    
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return { success: false, error: error.message };
  }
}

export async function sendVerificationCode(phoneNumber) {
  const code = Math.floor(100000 + Math.random() * 900000);
  const message = `Your AdoptAPaw verification code is: ${code}`;
  
  await sendSMS(phoneNumber, message);
  
  return code;
}

export async function sendApplicationUpdate(phoneNumber, status, dogName) {
  let message;
  
  switch (status) {
    case 'SUBMITTED':
      message = `Your adoption application for ${dogName} has been received. We'll contact you soon to schedule a home visit.`;
      break;
    case 'HOME_VISIT_SCHEDULED':
      message = `Your home visit for the adoption of ${dogName} has been scheduled. Please prepare for the visit.`;
      break;
    case 'HOME_VISIT_COMPLETED':
      message = `Great news! Your home visit for ${dogName}'s adoption has been completed. We'll schedule your final visit soon.`;
      break;
    case 'FINAL_VISIT_SCHEDULED':
      message = `Your final visit to complete ${dogName}'s adoption has been scheduled. Please bring all required documents.`;
      break;
    case 'COMPLETED':
      message = `Congratulations! Your adoption of ${dogName} is now complete. Welcome to the AdoptAPaw family!`;
      break;
    case 'REJECTED':
      message = `We regret to inform you that your application for ${dogName} has been declined. Please contact us for more information.`;
      break;
    default:
      message = `There's an update on your adoption application for ${dogName}. Please check your account for details.`;
  }
  
  return await sendSMS(phoneNumber, message);
}