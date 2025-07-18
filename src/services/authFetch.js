import { refreshToken } from "./refreshToken";

const API_URL = "https://sporting-manager-api.onrender.com";
//const API_URL = "http://localhost:8082";

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
    credentials: "include",
  };

  try {
    let response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
      const errorData = await response.json().catch(() => null);

      if (errorData?.message === "Token expirado.") {
        // Remove os tokens
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");

        // Redireciona ou avisa o usuário (opcional)
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      // Tenta renovar o token se não for o caso acima
      const refreshed = await refreshToken();
      if (!refreshed) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const newToken = localStorage.getItem("token");
      config.headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(`${API_URL}${endpoint}`, config);
    }

    if (!response.ok) {
      let errorMessage = "Erro ao fazer requisição";
      try {
        const errorData = await response.text(); // caso backend retorne string
        errorMessage = errorData || errorMessage;
      } catch (_) {}

      const error = new Error(errorMessage);
      error.status = response.status;
      error.body = errorMessage;
      throw error;
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    throw error;
  }
}
