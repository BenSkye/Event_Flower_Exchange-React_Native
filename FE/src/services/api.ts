import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_API_URL;

console.log('BASE_URL', BASE_URL)

const TOKEN_KEY = 'token';
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Thêm interceptor để đính kèm token vào mỗi request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out');
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with error:', error.response.status, error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }
    } else {
      console.error('Non-Axios error occurred:', error);
    }
    return Promise.reject(error);
  }
);





export default apiClient;