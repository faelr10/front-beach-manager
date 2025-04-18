const API_URL = "http://34.230.56.163:8082"; // URL da API

export async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Não foi possível renovar o token");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return true;
  } catch (error) {
    return false;
  }
}
