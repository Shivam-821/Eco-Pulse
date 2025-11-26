import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from 'socket.io'
import http from 'http'

import limiter from "./middleware/rateLimiter.js";
import connectDB from "./config/db.js";


import apiRoutes from "./routes/index.js";

dotenv.config();
const app = express();

const server = http.createServer(app)
export const io = new Server(server)

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(limiter);


connectDB();


app.use("/api", apiRoutes);

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));