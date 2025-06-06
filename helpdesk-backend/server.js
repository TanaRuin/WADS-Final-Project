const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');
const cloudinary = require('cloudinary').v2;

const commentsRoutes = require('./routes/commentsRoute');
const ticketsRoutes = require('./routes/ticketsRoute');
const attachmentsRoutes = require('./routes/attachmentsRoute');
const userRoutes = require('./routes/userRoute');
const dashboardRoutes = require('./routes/dashboardRoute');

dotenv.config();

const app = express();


app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',  // adjust this to your frontend domain if needed
  credentials: true
}));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Make cloudinary available in req.app.get('cloudinary')
app.set('cloudinary', cloudinary);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.log('MongoDB connection error:', error.message));

// Base route
app.get('/', (req, res) => {
  res.send('Connection Successful');
});

// API Routes
app.use('/api/comments', commentsRoutes);
app.use('/api/attachment', attachmentsRoutes);
app.use('/api/ticket', ticketsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Swagger Documentation
app.use("/helpdesk/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Belantara Ticketing System API",
}));
