import twilio from "twilio";
import { ApiError } from "../utils/ApiError.js";


const ACCOUNT_SID = "AC9dba8a8d8f83f6d59a08e5ce88883047";
const AUTH_TOKEN = "e6975f87cd5e0684aa7c3e4a4110d5ab";
const MESS_FROM = "+19127155650";

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
