import axios from "axios";

const API_URL = "http://localhost:3000/auth";

export const register = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, formData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const login = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/login`, formData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
