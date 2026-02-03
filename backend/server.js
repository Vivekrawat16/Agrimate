const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', require('./routes/aiRoutes'));

app.get('/', (req, res) => {
    res.send('AgriSense AI API is running...');
});

// Error Handling Middleware
app.use(require('./middleware/errorMiddleware').errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
