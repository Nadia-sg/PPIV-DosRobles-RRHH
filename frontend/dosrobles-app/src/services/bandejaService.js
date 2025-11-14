// frontend/dosrobles-app/src/services/bandejaService.js
import { authService } from "./authService";

const API_URL = "http://localhost:4000/api/bandeja";

export const bandejaService = {
  getMensajes: async ({ limit = 5 } = {}) => {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}?limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cargar mensajes");
    }

    return response.json();
  },
};
