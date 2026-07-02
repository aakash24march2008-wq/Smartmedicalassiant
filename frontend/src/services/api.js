import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const getToken = () =>
  localStorage.getItem('mediai_token') || sessionStorage.getItem('mediai_token');

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const api = {
  // Standard auth
  login: (data) => axios.post(`${API_BASE_URL}/auth/login`, data),
  register: (data) => axios.post(`${API_BASE_URL}/auth/register`, data),
  forgotPassword: (data) => axios.post(`${API_BASE_URL}/auth/forgot-password`, data),

  // OAuth auth
  loginWithGoogle: (data) => axios.post(`${API_BASE_URL}/auth/google`, data),
  loginWithGitHub: (data) => axios.post(`${API_BASE_URL}/auth/github`, data),

  // Features (protected)
  analyzeImage: (formData) => {
    return axios.post(`${API_BASE_URL}/image-diagnosis`, formData, {
      headers: { 'Content-Type': 'multipart/form-data', ...authHeaders().headers },
    });
  },
  analyzeReport: (formData) => {
    return axios.post(`${API_BASE_URL}/report-analysis`, formData, {
      headers: { 'Content-Type': 'multipart/form-data', ...authHeaders().headers },
    });
  },
  chatMessage: (data) => axios.post(`${API_BASE_URL}/chat/message`, data, authHeaders()),
  uploadChatDocument: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE_URL}/chat/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data', ...authHeaders().headers },
    });
  },
  checkSymptoms: (data) => axios.post(`${API_BASE_URL}/symptom-check`, data, authHeaders()),
};
