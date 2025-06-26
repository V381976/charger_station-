const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const chargingStationsRoutes = require('./routes/chargingStations');
const { authenticate } = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/chargerinformation',) //{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});



// Public Auth Routes
app.use('/api/auth', authRoutes);

// Protected Charging Station routes
app.use('/api/charging-stations', authenticate, chargingStationsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
