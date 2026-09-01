import axios from 'axios';

const API = axios.create({
  baseURL: 'https://hackathon-project-khatri6.vercel.app', // Live Vercel backend URL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;