// src/services/getAllAgendas.js
import { authFetch } from "./authFetch";

export async function getAllAgendas() {
  return authFetch("/agendas");
}
