const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const swaggerSpec = require('./utils/swagger.js');
const swaggerUi = require('swagger-ui-express');

const commentsRoutes = require('./routes/commentsRoute');
const ticketsRoutes = require('./routes/ticketsRoute');
const attachmentsRoutes = require('./routes/attachmentsRoute');
const userRoutes = require('./routes/userRoute');
const dashboardRoutes = require('./routes/dashboardRoute');


const app = express();

dotenv.config();

// Middleware
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "*",
  credentials: false,
};

app.use(cors(corsOptions))

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Helpdesk API Documentation"
}));

// Ensure trust for reverse proxies (e.g., Nginx or cloud hosting)
app.set('trust proxy', true);
mongoose.set("strictQuery", true)
// Routes
app.use('/api/comment', commentsRoutes);
app.use('/api/attachment', attachmentsRoutes);
app.use('/api/ticket', ticketsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Connection Successful');
});

// Database connection and server start
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

mongoose.connect(MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));


