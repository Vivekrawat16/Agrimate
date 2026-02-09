const axios = require('axios');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1';

/**
 * Get current weather for a location
 * @param {string} location - City name or lat,lon
 */
const getCurrentWeather = async (location) => {
    try {
        const response = await axios.get(`${BASE_URL}/current.json`, {
            params: {
                key: WEATHER_API_KEY,
                q: location,
                aqi: 'yes'  // Include air quality
            }
        });
        return response.data;
    } catch (error) {
        console.error('Weather API Error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Get 7-day forecast for a location
 * @param {string} location - City name or lat,lon
 */
const getForecast = async (location, days = 7) => {
    try {
        const response = await axios.get(`${BASE_URL}/forecast.json`, {
            params: {
                key: WEATHER_API_KEY,
                q: location,
                days: days,
                aqi: 'yes',
                alerts: 'yes'  // Include weather alerts
            }
        });
        return response.data;
    } catch (error) {
        console.error('Weather API Error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Get agriculture-relevant weather insights
 */
const getAgriWeatherInsights = (weatherData) => {
    const current = weatherData.current;
    const insights = [];

    // Temperature insights
    if (current.temp_c > 35) {
        insights.push({ type: 'warning', message: 'High temperature! Consider extra irrigation and shade for crops.' });
    } else if (current.temp_c < 10) {
        insights.push({ type: 'warning', message: 'Low temperature! Protect sensitive crops from frost damage.' });
    }

    // Humidity insights
    if (current.humidity > 80) {
        insights.push({ type: 'info', message: 'High humidity - watch for fungal diseases in crops.' });
    } else if (current.humidity < 30) {
        insights.push({ type: 'info', message: 'Low humidity - increase watering frequency.' });
    }

    // Wind insights
    if (current.wind_kph > 40) {
        insights.push({ type: 'warning', message: 'Strong winds! Avoid spraying pesticides today.' });
    }

    // Rain insights
    if (current.precip_mm > 0) {
        insights.push({ type: 'success', message: 'Rainfall detected - can reduce irrigation.' });
    }

    // UV insights
    if (current.uv >= 8) {
        insights.push({ type: 'warning', message: 'High UV index - avoid field work during noon.' });
    }

    return insights;
};

module.exports = {
    getCurrentWeather,
    getForecast,
    getAgriWeatherInsights
};
