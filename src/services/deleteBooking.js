// src/services/agendas/deleteBookingAPI.js
import { authFetch } from "./authFetch";

export async function deleteBookingAPI(id) {
  try {
    const response = await authFetch(`/agendas/${id}`, {
      method: "DELETE",
    });

    if (response === null || response === undefined) {
      return true;
    }
    return response;
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
    throw error;
  }
}
