const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// Your routes will go here

// app.use('/routes/auth', authRoutes);
//
// app.use('/routes/data', dataRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});