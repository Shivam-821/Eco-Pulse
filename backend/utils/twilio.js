import twilio from "twilio";
import { ApiError } from "../utils/ApiError.js";
import dotenv from 'dotenv'
dotenv.config();

const { ACCOUNT_SID, AUTH_TOKEN, MESS_FROM } = process.env;

if (!ACCOUNT_SID || !AUTH_TOKEN || !MESS_FROM) {
  throw new ApiError(
    "Twilio credentials are missing from environment variables"
  );
}

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

export const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: MESS_FROM,
      to,
    });
    console.log("Message sent successfully: ", response.sid);
    return response.sid;
  } catch (error) {
    console.error("Error sending Message: ", error);
  }
};
