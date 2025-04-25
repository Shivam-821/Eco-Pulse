const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*', // For development only
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Error:', err));

// Routes
app.use("/api/schedule", require("./routes/scheduleRoutes"));
app.use("/api/bill", require("./routes/billRoutes"));
app.use('/pickup-request', require('./routes/pickup'));


// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});
