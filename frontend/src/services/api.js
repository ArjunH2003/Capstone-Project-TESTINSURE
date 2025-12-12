import axios from 'axios';

// 1. Create the Axios Instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Connect to Spring Boot
});

// 2. Add an Interceptor (The "Spy")
// Before sending ANY request, this code runs automatically.
api.interceptors.request.use(
  (config) => {
    // Check if we have a token saved in the browser
    const token = localStorage.getItem('token');
    
    // If token exists, attach it to the header "Authorization: Bearer eyJ..."
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;