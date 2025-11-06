// src/api/authService.js
import API_BASE_URL from "./apiConfig";

export async function loginUser(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error en el inicio de sesión");
    }

    return data; // contiene el token y/o datos del usuario
  } catch (error) {
    throw error;
  }
}

export async function registerUser(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error en el registro");
    }

    return data;
  } catch (error) {
    throw error;
  }
}
