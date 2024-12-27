import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8888/api", // Replace with your API base URL
  timeout: 10000, // Timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue = [];

// Helper function to process the queue
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Add a request interceptor to include access token
axiosInstance.interceptors.request.use(
  (config) => {
 
    const token = localStorage.getItem("auth"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue failed requests while the token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try { 
        // Call refresh token endpoint
        const token = localStorage.getItem("refreshToken");
        const response = await axios.post("http://localhost:8888/api/admin/refresh-token", {
          token,
        }); 
        const { accessToken } = response.data.data; 
        // Update localStorage with new token  
       // if(accessToken){
          localStorage.removeItem("auth");
          localStorage.setItem("auth", accessToken); 
        //}
        // Update failed requests with new token
        processQueue(null, accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Clear tokens and redirect to login on refresh failure
        localStorage.removeItem("auth");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
