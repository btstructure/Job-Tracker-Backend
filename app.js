const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

//middleware
app.use(express.json())
app.use(cors());

//MongoDb Connection

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
})

//Routes
const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

// Start server

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});