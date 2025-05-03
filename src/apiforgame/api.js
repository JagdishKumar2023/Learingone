import axios from 'axios';
import Config from 'react-native-config';
// import {getAuthToken} from './useBackendApi'; // Uncomment if needed later

const API_URL = Config.BASE_URL || 'http://192.168.0.101:5000/api/v1';
console.log('API:', API_URL);

// ✅ Updated Bearer Token
const tempToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyV2l0aG91dFRva2VuIjp7InRvdGFsRGVwb3NpdCI6MCwidG90YWxXaXRoZHJhd2FsIjowLCJfaWQiOiI2N2QwN2Y0YjM5ZmMxMDA1ODdlNjI1MTciLCJmdWxsTmFtZSI6InZpcmF0IiwiZW1haWwiOiJ2aXJhdEBnbWFpbC5jb20iLCJwaG9uZU51bWJlciI6IjkwOTA5MDkwOTAiLCJiYWxhbmNlIjoxMTEsImlzU3VwZXJBZG1pbiI6dHJ1ZSwiaXNCbG9ja2VkIjpmYWxzZSwiY3JlYXRlZEF0IjoiMjAyNS0wMy0xMVQxODoyMjowMy45MTNaIiwidXBkYXRlZEF0IjoiMjAyNS0wNS0wMlQxNzoyNTowMC43NjVaIiwiX192IjowLCJpc0RvY3VtZW50c1ZlcmlmaWVkIjp0cnVlfSwiaWF0IjoxNzQ2MjA3NDUyLCJleHAiOjE3NDcwNzE0NTJ9.ElORB15v4AGr-9y8NRE7wWN6IkwjbaWxB-bn0akaHdY';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor (Attach Token)
api.interceptors.request.use(
  async config => {
    try {
      const token = tempToken;
      console.log('NewToken:', token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  error => Promise.reject(error),
);

// ✅ Response Interceptor (Global Error Handling)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error(
        `API Error [${error.response.status}]:`,
        error.response.data,
      );
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
