//make http requests to the back end 
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, 
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json'; 

    const user = localStorage.getItem('user');
    if (user) {
      const token = JSON.parse(user).token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default apiClient;


