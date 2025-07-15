// src/services/createAgenda.js
import { authFetch } from "./authFetch";

export async function createUser(userData) {
  return authFetch("/user", {
    method: "POST",
    body: userData,
  });
}
