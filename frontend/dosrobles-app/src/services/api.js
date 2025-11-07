// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/**
 * Función genérica para hacer peticiones a la API
 * @param {string} endpoint - Ruta del endpoint (ej: /licencias)
 * @param {object} options - Opciones de fetch (method, body, headers, etc)
 * @returns {Promise<object>} Respuesta de la API
 */
export const apiCall = async (endpoint, options = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Si la respuesta no es exitosa, lanzar error
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Error: ${response.status}`);
    }

    // Para descargas de PDF, retornar el blob
    if (options.responseType === "blob") {
      return await response.blob();
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en API call a ${endpoint}:`, error);
    throw error;
  }
};

/**
 * GET - Obtener datos
 */
export const apiGet = (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return apiCall(url, { method: "GET" });
};

/**
 * POST - Crear datos
 */
export const apiPost = (endpoint, data = {}) => {
  return apiCall(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * PUT - Actualizar datos completos
 */
export const apiPut = (endpoint, data = {}) => {
  return apiCall(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * PATCH - Actualizar datos parciales
 */
export const apiPatch = (endpoint, data = {}) => {
  return apiCall(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

/**
 * DELETE - Eliminar datos
 */
export const apiDelete = (endpoint) => {
  return apiCall(endpoint, { method: "DELETE" });
};

/**
 * Descargar archivo (PDF, etc)
 */
export const apiDownload = async (endpoint) => {
  return apiCall(endpoint, {
    method: "GET",
    responseType: "blob",
  });
};

export default {
  apiCall,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  apiDownload,
};
