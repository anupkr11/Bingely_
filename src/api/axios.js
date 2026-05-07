import axios from 'axios';

/**
 * Custom Axios Instance
 * Pre-configured with the backend API base URL from environment variables.
 * This ensures all requests seamlessly point to the correct server endpoints.
 */
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

export default API;
