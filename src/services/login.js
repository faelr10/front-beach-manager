const API_URL = "https://beach-manager-api.onrender.com";

export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // ❌ REMOVIDO: não precisa mais enviar cookies
      // credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao fazer login");
    }

    const data = await response.json();

    // ✅ Armazena o access token e o refresh token no localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("refresh_token", data.refresh_token);

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
