import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import limiter from "./middleware/rateLimiter.js";
import connectDB from "./config/db.js";

// Import the aggregated API routes from /routes/index.js
import apiRoutes from "./routes/index.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(limiter);

// Connect DB
connectDB();

// Mount all API routes under "/api"
app.use("/api", apiRoutes);

// Serve static files (e.g. processed uploads)
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));