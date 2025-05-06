// src/axiosInstance.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL
});

axiosInstance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('jwtToken');
      console.log("DEBUG axiosInstance: aggiungo Authorization?", token);
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

export default axiosInstance;
