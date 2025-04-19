import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://hms-api-okfi.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Hotel-Domain': 'dewilliams.com'
  },
});

export default axiosInstance;