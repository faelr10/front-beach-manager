// src/services/getAllAgendas.js
import { authFetch } from "./authFetch";

export async function getAllAgendas(id) {
  return authFetch(`/agenda-publica/${id}`);
}
