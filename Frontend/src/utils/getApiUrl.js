// src/utils/getApiUrl.js
export function getApiUrl() {
  // Vite style
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // CRA style
  if (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // fallback
  return "http://localhost:3000";
}
