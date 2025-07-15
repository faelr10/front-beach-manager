// src/services/createAgenda.js
import { authFetch } from "./authFetch";

export async function createAgenda(agendaData) {
  return authFetch("/schedule", {
    method: "POST",
    body: agendaData,
  });
}
