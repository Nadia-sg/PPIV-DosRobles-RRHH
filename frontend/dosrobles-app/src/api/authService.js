// src/api/authService.js
import API_BASE_URL from "./apiConfig";

export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en el inicio de sesión");
  }

  // Guardamos token y rol en localStorage
  localStorage.setItem("token", data.token);
  if (data.user?.role) {
    localStorage.setItem("role", data.user.role);
  }

  return data;
}

export async function registerUser(username, password, role = "empleado") {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en el registro");
  }

  return data;
}
