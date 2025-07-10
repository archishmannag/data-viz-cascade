import axios from "axios";

// Create an axios instance with a prefilled base API URL
const axiosInstance = axios.create({
  baseURL: "https://ragconsole.riequation.com", // Base API URL
});

export default axiosInstance;
