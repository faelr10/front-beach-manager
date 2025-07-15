// src/services/createAgenda.js
import { authFetch } from "./authFetch";

export async function createAgenda(agendaData) {

  const userId = localStorage.getItem("user_id");

  agendaData.user_id = userId; // Ensure the agenda is linked to the user

  return authFetch("/schedule", {
    method: "POST",
    body: agendaData,
  });
}
