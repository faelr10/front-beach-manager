// src/services/agendas/updateBookingAPI.js
import { authFetch } from "./authFetch";

export async function updateBookingAPI(id, data) {
  try {
    const response = await authFetch(`/agendas/${id}`, {
      method: "PUT",
      body: data,
    });

    return response;
  } catch (error) {
    console.error("Erro ao atualizar o agendamento:", error);
    throw error;
  }
}
