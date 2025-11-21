// src/config/index.js
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000',
  ENDPOINTS: {
    RAG_CHAT: '/api/rag-chat',
    BASIC_CHAT: '/api/ask-query', 
    SUMMARIZE: '/api/summarize',
    ADD_KNOWLEDGE: '/api/add-to-knowledge'
  }
};