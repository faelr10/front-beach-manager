const API_URL = "https://beach-manager-api.onrender.com";

export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // permite salvar o cookie HttpOnly do refresh token
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao fazer login");
    }

    const data = await response.json();

    // Armazena apenas o access token no localStorage
    localStorage.setItem("token", data.token);

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
