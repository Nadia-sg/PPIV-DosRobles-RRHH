// src/services/empleadosService.js
export const getEmpleadoPorId = async (id) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/empleados/${id}`);
    if (!response.ok) throw new Error("Error al obtener empleado");
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getEmpleadoPorId:", error);
    return null;
  }
};