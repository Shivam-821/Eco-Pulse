import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { sendSMS } from "../utils/twilio.js";

const worker = new Worker(
  "notificationQueue",
  async (job) => {
    const { name, data } = job;
    console.log(`[Worker] Processing Job ID ${job.id} (${name})`);

    // Handle different types of notification events
    switch (name) {
      case "registerDump": {
        const { dumpReporter, uniqueCode } = data;
        await sendSMS(
          "+919060871087", // Phone configuration
          `Thank you ${dumpReporter} for your contribution. Your dump (${uniqueCode}) was registered successfully!`
        );
        break;
      }
      case "assignTask": {
        const { teamname, uniqueNumber, address, distanceInKm } = data;
        await sendSMS(
          "+919060871087",
          `Team ${teamname}, you are assigned to task ${uniqueNumber} at ${address} (${distanceInKm} KM away).`
        );
        break;
      }
      case "sendOTP": {
        const { otp } = data;
        await sendSMS("+919060871087", `Your Eco-Pulse verification OTP is: ${otp}`);
        break;
      }
      default:
        throw new Error(`Unknown job type: ${name}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, // Process up to 5 notification dispatches concurrently
  }
);

// Event Listeners
worker.on("completed", (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully.`);
});

worker.on("failed", (job, error) => {
  console.error(`[Worker] Job ${job.id || 'unknown'} failed: ${error.message}`);
});

export default worker;
