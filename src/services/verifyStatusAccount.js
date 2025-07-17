// src/services/getAllAgendas.js
import { authFetch } from "./authFetch";

export async function verifyStatusAccount(id) {
  return authFetch(`/account/${id}`);
}
