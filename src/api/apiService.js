import axiosInstance from "./axiosInstance.js";

// Common GET request
export const get = async (url, params = {}) => {
  try {
 
    const response = await axiosInstance.get(url, { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Common POST request
export const post = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Common PUT request
export const put = async (url, data) => {
  try {
    const response = await axiosInstance.put(url, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Common File Upload
export const uploadFile = async (url, file, additionalData = {}) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Append additional data if provided
    for (const key in additionalData) {
      formData.append(key, additionalData[key]);
    }

    const response = await axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Error handler
const handleError = (error) => {
  console.error("API call failed:", error);
  // Optionally, show an error notification to the user
  throw error;
};
