// src/services/getAllAgendas.js
import { authFetch } from "./authFetch";

export async function getAllAgendas() {
  const userId = localStorage.getItem("user_id");
  return authFetch(`/schedule/${userId}`);
}
