import { apiGet, apiPost, apiPut, apiPatch } from "./api.js";

/**
 * Servicio para gestionar Licencias/Ausencias
 */

export const licenciasService = {
  /**
   * Obtener todas las licencias con filtros opcionales
   * @param {object} filtros - {estado, empleadoId, desde, hasta}
   */
  obtenerLicencias: (filtros = {}) => {
    return apiGet("/licencias", filtros);
  },

  /**
   * Obtener una licencia por ID
   */
  obtenerLicenciaById: (id) => {
    return apiGet(`/licencias/${id}`);
  },

  /**
   * Obtener resumen de licencias por empleado
   */
  obtenerResumenEmpleado: (empleadoId) => {
    return apiGet(`/licencias/empleado/${empleadoId}/resumen`);
  },

  /**
   * Solicitar una nueva licencia
   */
  solicitarLicencia: (datos) => {
    return apiPost("/licencias", datos);
  },

  /**
   * Actualizar una licencia (solo si está pendiente)
   */
  actualizarLicencia: (id, datos) => {
    return apiPut(`/licencias/${id}`, datos);
  },

  /**
   * Aprobar una licencia
   */
  aprobarLicencia: (id, gerenteId, comentario = "") => {
    return apiPatch(`/licencias/${id}/aprobar`, {
      gerenteId,
      comentarioGerente: comentario,
    });
  },

  /**
   * Rechazar una licencia
   */
  rechazarLicencia: (id, gerenteId, comentario = "") => {
    return apiPatch(`/licencias/${id}/rechazar`, {
      gerenteId,
      comentarioGerente: comentario,
    });
  },

  /**
   * Cancelar una licencia
   */
  cancelarLicencia: (id) => {
    return apiPatch(`/licencias/${id}/cancelar`, {});
  },

  /**
   * Filtrar licencias por estado
   */
  obtenerLicenciasPorEstado: (estado) => {
    return apiGet("/licencias", { estado });
  },

  /**
   * Filtrar licencias por período de fechas
   */
  obtenerLicenciasPorFechas: (desde, hasta) => {
    return apiGet("/licencias", { desde, hasta });
  },
};

export default licenciasService;
