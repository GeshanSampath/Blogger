import axios from 'axios';
import { getAuthHeaders } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const createComment = (data) => {
  return axios.post(`${API_URL}/comments`, data, { headers: getAuthHeaders() });
};

export const getPendingComments = () => {
  return axios.get(`${API_URL}/comments/pending`, { headers: getAuthHeaders() });
};

export const selectCommentByAuthor = (id) => {
  return axios.patch(`${API_URL}/comments/${id}/select`, {}, { headers: getAuthHeaders() });
};

export const approveComment = (id) => {
  return axios.patch(`${API_URL}/comments/${id}/approve`, {}, { headers: getAuthHeaders() });
};

export const rejectComment = (id) => {
  return axios.patch(`${API_URL}/comments/${id}/reject`, {}, { headers: getAuthHeaders() });
};

export const getApprovedComments = (blogId) => {
  return axios.get(`${API_URL}/comments/approved/${blogId}`);
};
