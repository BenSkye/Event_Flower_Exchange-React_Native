import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://c44f-125-235-238-244.ngrok-free.app/api/v1';
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
    return Promise.reject(error);
  }
);

export default apiClient;