// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const ragChat = async (query) => {
  const response = await api.post('/api/rag-chat', { query });
  return response.data;
};

export const basicChat = async (query) => {
  const response = await api.post('/api/ask-query', { query });
  return response.data;
};

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/add-to-knowledge', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const summarizeDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/summarize', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};