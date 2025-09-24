// src/services/auth.js
import axios from "axios";

const API_URL = "http://localhost:3000/auth"; // matches your NestJS AuthController

// Register new user
export const register = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Login user
export const login = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
