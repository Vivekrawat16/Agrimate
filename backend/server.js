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
app.use('/api/weather', require('./routes/weatherRoutes'));

// Serve static assets in production
const path = require('path');

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // Use regex for catch-all in Express 5
    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('AgriSense AI API is running... (Development Mode)');
    });
}

// Error Handling Middleware
app.use(require('./middleware/errorMiddleware').errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
