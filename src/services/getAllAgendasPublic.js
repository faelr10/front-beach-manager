// src/services/getAllAgendas.js
import { authFetch } from "./authFetch";

export async function getAllAgendasPublic(id) {
  return authFetch(`/agenda-publica/${id}`);
}
