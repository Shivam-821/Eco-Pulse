import { sendSMS } from "../utils/twilio.js";

export const notifyOnRegisteringDump = async (
  dumpReporter,
  uniqueCode
) => {
  try {
    await sendSMS(
      "+919060871087",
      `Thank you ${dumpReporter} for your contribution towards a healthy nature.
      Your dump with unique-code ${uniqueCode} registered successfully and our respective cleaning team will clean it very soon.
      Keep traking the status of your registred dump.
      We will notify you soon as dump will get clean.
      - by municipality team(admin)`
    );
  } catch (error) {
    console.error("Error sending success dump Registration message:", error);
  }
};


export const notifyOnCompletionOfWork = async (
) => {

  try {
    await sendSMS(
      "+919060871087",
      `Your registered dump is cleaned by the respective assigned team: ${assignTeam}`
    );
  } catch (error) {
    console.error("Error sending successfully cleaness of registered dump:", error);
  }
};