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


export const notifyOnAssignTask = async (teamname, uniqueNumber, address, distanceInKm) => {
  try{
    await sendSMS(
      "+919060871087",
      `Team ${teamname} you are assigned with a new cleaning task: \n
    Unique-number: ${uniqueNumber}, reported at place: ${address}, which is ${distanceInKm} KM away from you. \n
    clean it as soon as possible.
                 - by Admin(municipality)`
    )
  } catch (error) {
    console.error("Error sending assigning message")
  }
}

export const sendOTP = async (otp) => {
  try{
    await sendSMS(
      "+919060871087",
      `OTP for verifying mobile number for Eco-Pulse is: ${otp}`
    )
  }catch (error){
    console.log("Error sending otp")
  }
}