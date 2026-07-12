import axios from 'axios';

const api = axios.create({
  baseURL: 'https://inkshelf-api.onrender.com/api', // Replace with your Render URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// ... rest of the code