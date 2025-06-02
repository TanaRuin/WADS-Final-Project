const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');

const commentsRoutes = require('./routes/commentsRoute');
const ticketsRoutes = require('./routes/ticketsRoute');
const attachmentsRoutes = require('./routes/attachmentsRoute');
const userRoutes = require('./routes/userRoute');
const dashboardRoutes = require('./routes/dashboardRoute');

dotenv.config();
const app = express();

express.static(path.join(__dirname, 'uploads'))

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true  
}));

const CONNECTION_URL = process.env.MONGO_URI
const PORT = process.env.PORT

mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

app.get('/', (req, res) => {
  res.send('Connection Successful');
});

app.use('/api/comment', commentsRoutes);
app.use('/api/attachment', attachmentsRoutes);
app.use('/api/ticket', ticketsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);


