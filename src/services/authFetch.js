// src/services/authFetch.js
import { refreshToken } from "./refreshToken";

const API_URL = "https://beach-manager.onrender.com";

export async function authFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    method: options.method || "GET",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include", // envia cookies (refresh_token)
  };

  try {
    let response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      // Retry com novo token
      const newToken = localStorage.getItem("token");
      config.headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(`${API_URL}${endpoint}`, config);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao fazer requisição");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}
