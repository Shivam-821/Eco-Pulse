import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

// Instantiating the queue
export const notificationQueue = new Queue("notificationQueue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // auto retry 3 times if failed
    backoff: {
      type: "exponential",
      delay: 5000, // 5-10-20
    },
    removeOnComplete: true, 
    removeOnFail: false,   
  },
});

// A producer helper to push jobs to the queue
export const queueNotification = async (jobName, jobData) => {
  try {
    await notificationQueue.add(jobName, jobData);
  } catch (error) {
    console.error("Failed to add job to notification queue:", error);
  }
};
