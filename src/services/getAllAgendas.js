// src/services/getAllAgendas.js
import { authFetch } from "./authFetch";

export async function getAllAgendas() {
  const userId = localStorage.getItem("userId");
  return authFetch(`/schedule/${userId}`);
}
