import { apiGet, apiPost, apiPatch, apiDownload } from "./api.js";

/**
 * Servicio para gestionar Nóminas
 */

export const nominaService = {
  /**
   * Obtener todas las nóminas con filtros
   * @param {object} filtros - {empleadoId, estado, periodo}
   */
  obtenerNominas: (filtros = {}) => {
    return apiGet("/nomina", filtros);
  },

  /**
   * Obtener una nómina por ID
   */
  obtenerNominaById: (id) => {
    return apiGet(`/nomina/${id}`);
  },

  /**
   * Obtener resumen de un período
   */
  obtenerResumenPeriodo: (periodo) => {
    return apiGet(`/nomina/periodo/${periodo}/resumen`);
  },

  /**
   * Calcular nómina para un empleado
   */
  calcularNomina: (empleadoId, periodo) => {
    return apiPost("/nomina", {
      empleadoId,
      periodo,
    });
  },

  /**
   * Calcular nóminas para múltiples empleados
   */
  calcularNominasMultiples: (empleadoIds, periodo) => {
    return apiPost("/nomina/masivo/calcular", {
      empleadoIds,
      periodo,
    });
  },

  /**
   * Aprobar una nómina
   */
  aprobarNomina: (id, aprobadoPor) => {
    return apiPatch(`/nomina/${id}/aprobar`, {
      aprobadoPor,
    });
  },

  /**
   * Obtener nóminas por estado
   */
  obtenerNominasPorEstado: (estado) => {
    return apiGet("/nomina", { estado });
  },

  /**
   * Obtener nóminas de un empleado
   */
  obtenerNominasEmpleado: (empleadoId) => {
    return apiGet("/nomina", { empleadoId });
  },

  /**
   * Descargar recibo en PDF
   */
  descargarReciboPDF: async (nominaId) => {
    const blob = await apiDownload(`/pdf/recibo/${nominaId}`);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `recibo_${nominaId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  },

  /**
   * Obtener nóminas disponibles para descargar
   */
  obtenerRecibosDisponibles: (periodo) => {
    return apiPost("/pdf/recibos/disponibles", {
      periodo,
    });
  },
};

export default nominaService;
