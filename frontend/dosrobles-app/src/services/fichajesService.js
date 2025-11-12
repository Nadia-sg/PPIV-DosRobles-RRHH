// frontend/dosrobles-app/src/services/fichajesService.js

const API_URL = 'http://localhost:4000/fichajes';

export async function getFichajesPorEmpleado(empleadoId) {
  try {
    const response = await fetch(`${API_URL}/empleado/${empleadoId}`);
    
    if (response.status === 404) {
      return []; // ← devuelve array vacío en lugar de lanzar error
    }
    
    if (!response.ok) {
      throw new Error('Error al obtener los fichajes');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getFichajesPorEmpleado:', error);
    throw error;
  }
}