const express = require('express');
const router = express.Router();
const { getWeather, getWeatherForecast } = require('../controllers/weatherController');

// GET /api/weather/current?location=Delhi
router.get('/current', getWeather);

// GET /api/weather/forecast?location=Delhi&days=7
router.get('/forecast', getWeatherForecast);

module.exports = router;
