import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000/api/ai' : '/api/ai',
});

const WEATHER_API = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000/api/weather' : '/api/weather',
});

export const recommendCrop = (data) => API.post('/recommend-crop', data);
export const predictYield = (data) => API.post('/predict-yield', data);
export const predictDisease = (data) => API.post('/predict-disease', data);
export const chatAgent = (data) => API.post('/chat', data);

// Weather APIs
export const getCurrentWeather = (location) => WEATHER_API.get(`/current?location=${encodeURIComponent(location)}`);
export const getWeatherForecast = (location, days = 7) => WEATHER_API.get(`/forecast?location=${encodeURIComponent(location)}&days=${days}`);

export default API;
