import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

import limiter from "./middleware/rateLimiter.js";
import connectDB from "./config/db.js";

import apiRoutes from "./routes/index.js";

dotenv.config();
const app = express();

const server = http.createServer(app);
export const io = new Server(server);

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

connectDB();

app.use("/api", apiRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

import cron from "node-cron";

cron.schedule("*/14 * * * *", () => {
  // Get current time in IST (Indian Standard Time)
  const date = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );
  const currentHour = date.getHours();

  console.log(`Cron job triggered. IST Hour: ${currentHour}`);

  // Sleep window: 1 AM to 7 AM IST
  if (currentHour >= 1 && currentHour < 7) {
    console.log("Skipping keep-alive ping (Sleep Window 1AM-7AM IST)");
    return;
  }

  const backendUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`;
  console.log(`Pinging backend at ${backendUrl}/health to keep it alive...`);

  // Using global fetch (available in Node 18+)
  fetch(`${backendUrl}/health`)
    .then((response) => {
      if (response.ok) {
        console.log("Keep-alive ping successful");
      } else {
        console.error(`Keep-alive ping failed with status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Keep-alive ping error:", error.message);
    });
});

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
