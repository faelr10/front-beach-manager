// src/services/agendas/deleteBookingAPI.js
import { authFetch } from "./authFetch";

export async function deleteBookingAPI(id) {
  try {
    await authFetch(`/agendas/${id}`, {
      method: "DELETE",
    });

    return true;
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
    throw error;
  }
}
