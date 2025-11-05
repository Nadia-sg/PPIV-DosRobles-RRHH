// frontend/dosrobles-app/src/services/fichajesService.js

const API_URL = "http://localhost:4000/fichajes";

export const getFichajes = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener fichajes");
    return await response.json();
  } catch (error) {
    console.error("Error en getFichajes:", error);
    throw error;
  }
};
