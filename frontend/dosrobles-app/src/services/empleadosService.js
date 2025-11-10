import { apiGet, apiPost, apiPut, apiPatch } from "./api.js";

/**
 * Servicio para gestionar Empleados
 */

export const empleadosService = {
  /**
   * Obtener todos los empleados con filtros opcionales
   * @param {object} filtros - {estado, area, puesto, etc}
   */
  obtenerEmpleados: (filtros = {}) => {
    return apiGet("/empleados", filtros);
  },

  /**
   * Obtener un empleado por ID
   */
  obtenerEmpleadoById: (id) => {
    return apiGet(`/empleados/${id}`);
  },

  /**
   * Obtener un empleado por legajo
   */
  obtenerEmpleadoPorLegajo: (legajo) => {
    return apiGet(`/empleados/legajo/${legajo}`);
  },

  /**
   * Crear un nuevo empleado
   */
  crearEmpleado: (datos) => {
    return apiPost("/empleados", datos);
  },

  /**
   * Actualizar un empleado
   */
  actualizarEmpleado: (id, datos) => {
    return apiPut(`/empleados/${id}`, datos);
  },

  /**
   * Desactivar un empleado (cambiar estado a inactivo)
   */
  desactivarEmpleado: (id) => {
    return apiPatch(`/empleados/${id}/desactivar`, {});
  },

  /**
   * Obtener empleados activos
   */
  obtenerEmpleadosActivos: () => {
    return apiGet("/empleados", { estado: "activo" });
  },

  /**
   * Obtener empleados por área
   */
  obtenerEmpleadosPorArea: (area) => {
    return apiGet("/empleados", { area });
  },

  /**
   * Obtener empleados por puesto
   */
  obtenerEmpleadosPorPuesto: (puesto) => {
    return apiGet("/empleados", { puesto });
  },
};

export default empleadosService;
