const express = require('express');
const mongoose = require('mongoose');
const userProfileRoutes = require('./routes/userProfileRoutes');

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/user_profiles', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/user-profiles', userProfileRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
