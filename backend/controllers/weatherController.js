const asyncHandler = require('express-async-handler');
const { getCurrentWeather, getForecast, getAgriWeatherInsights } = require('../services/weatherService');

// @desc    Get current weather
// @route   GET /api/weather/current
// @access  Public
const getWeather = asyncHandler(async (req, res) => {
    const { location } = req.query;

    if (!location) {
        res.status(400);
        throw new Error('Please provide a location');
    }

    const weatherData = await getCurrentWeather(location);
    const insights = getAgriWeatherInsights(weatherData);

    res.json({
        location: weatherData.location,
        current: weatherData.current,
        insights: insights
    });
});

// @desc    Get weather forecast
// @route   GET /api/weather/forecast
// @access  Public
const getWeatherForecast = asyncHandler(async (req, res) => {
    const { location, days = 7 } = req.query;

    if (!location) {
        res.status(400);
        throw new Error('Please provide a location');
    }

    const forecastData = await getForecast(location, days);
    const insights = getAgriWeatherInsights(forecastData);

    res.json({
        location: forecastData.location,
        current: forecastData.current,
        forecast: forecastData.forecast,
        alerts: forecastData.alerts,
        insights: insights
    });
});

module.exports = {
    getWeather,
    getWeatherForecast
};
