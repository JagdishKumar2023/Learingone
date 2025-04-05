import axios from 'axios';

const API_URL = 'http://192.168.0.102:5000/api/v1';

const tempToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyV2l0aG91dFRva2VuIjp7InRvdGFsRGVwb3NpdCI6MCwidG90YWxXaXRoZHJhd2FsIjowLCJfaWQiOiI2N2QwN2Y0YjM5ZmMxMDA1ODdlNjI1MTciLCJmdWxsTmFtZSI6InZpcmF0IiwiZW1haWwiOiJ2aXJhdEBnbWFpbC5jb20iLCJwaG9uZU51bWJlciI6IjkwOTA5MDkwOTAiLCJiYWxhbmNlIjoxMTEsImlzU3VwZXJBZG1pbiI6dHJ1ZSwiaXNCbG9ja2VkIjpmYWxzZSwiY3JlYXRlZEF0IjoiMjAyNS0wMy0xMVQxODoyMjowMy45MTNaIiwidXBkYXRlZEF0IjoiMjAyNS0wNC0wMlQxODoyMjoyNy4wNTBaIiwiX192IjowLCJpc0RvY3VtZW50c1ZlcmlmaWVkIjp0cnVlfSwiaWF0IjoxNzQzNjE4MzgzLCJleHAiOjE3NDQ0ODIzODN9._YGRecOVRr8iuFlbrwe1SdVakit0fB8tW8YcA2RMic4';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor (Attach Token)
api.interceptors.request.use(
  config => {
    if (tempToken) {
      config.headers.Authorization = `Bearer ${tempToken}`;
    }
    return config;
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
