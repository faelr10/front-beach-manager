// src/services/createAgenda.js
import { authFetch } from "./authFetch";

export async function createAgenda(agendaData) {
  return authFetch("/agendas", {
    method: "POST",
    body: agendaData,
  });
}
