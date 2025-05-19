const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./database');
const commentsRoutes = require('./routes/commentsRoute');
const ticketsRoutes = require('./routes/ticketsRoute');
const attachmentsRoutes = require('./routes/attachmentsRoute');
const userRoutes = require('./routes/userRoute');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true  
}));


connectDB(); 
// Test route 
app.get('/', (req, res) => {
    res.send('Connection Successful');
});

app.use('/api/comment', commentsRoutes);
app.use('/api/attachment', attachmentsRoutes);
app.use('/api/ticket', ticketsRoutes);
app.use('/api/user', userRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})