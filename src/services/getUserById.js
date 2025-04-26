// src/services/getAllAgendas.js
import { authFetch } from "./authFetch";

export async function getUserById(id) {
  return authFetch(`/users/${id}`);
}
