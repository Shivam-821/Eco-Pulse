const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const limiter = require("./middleware/rateLimiter");
app.use(limiter);

require("./config/db");

app.use("/api/auth", require("./routes/auth"));
app.use("/api/teams", require("./routes/teams"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/report-dump", require("./routes/reports"));
app.use("/api/dump-reports", require("./routes/reports"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/map", require("./routes/map"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/stats", require("./routes/stats"));

app.listen(3001, () => console.log("Backend running on port 3001"));