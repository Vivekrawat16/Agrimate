import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api/ai', // Ensure this matches backend port
});

export const recommendCrop = (data) => API.post('/recommend-crop', data);
export const predictYield = (data) => API.post('/predict-yield', data);
export const predictDisease = (data) => API.post('/predict-disease', data);
export const chatAgent = (data) => API.post('/chat', data);

export default API;
