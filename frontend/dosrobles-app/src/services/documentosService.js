const API_URL = "http://localhost:4000/api/documentos";

export const documentosService = {
  // Obtener documentos del empleado
  obtenerDocumentos: async (empleadoId) => {
    try {
      const response = await fetch(`${API_URL}?empleadoId=${empleadoId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener documentos");
      }

      return data;
    } catch (error) {
      console.error("Error en obtenerDocumentos:", error);
      throw error;
    }
  },

  // Crear/subir nuevo documento con archivo
  crearDocumento: async (documentoData) => {
    try {
      // Detectar si es FormData (para archivos) o JSON
      const isFormData = documentoData instanceof FormData;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        body: isFormData ? documentoData : JSON.stringify(documentoData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al subir documento");
      }

      return data;
    } catch (error) {
      console.error("Error en crearDocumento:", error);
      throw error;
    }
  },

  // Obtener documento por ID
  obtenerDocumentoById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener documento");
      }

      return data;
    } catch (error) {
      console.error("Error en obtenerDocumentoById:", error);
      throw error;
    }
  },

  // Descargar documento (como blob para archivos binarios)
  descargarDocumento: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/descargar`);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          data = { message: await response.text() };
        }

        throw new Error(data.message || "Error al descargar documento");
      }

      // Verificar que sea un PDF
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/pdf')) {
        throw new Error("El archivo descargado no es un PDF válido");
      }

      // Obtener el blob del archivo
      const blob = await response.blob();

      // Obtener el nombre del archivo del header Content-Disposition si está disponible
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'documento.pdf';

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
          // Asegurar que tenga extensión .pdf
          if (!filename.endsWith('.pdf')) {
            filename += '.pdf';
          }
        }
      }

      return { blob, filename };
    } catch (error) {
      console.error("Error en descargarDocumento:", error);
      throw error;
    }
  },

  // Eliminar documento
  eliminarDocumento: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al eliminar documento");
      }

      return data;
    } catch (error) {
      console.error("Error en eliminarDocumento:", error);
      throw error;
    }
  },
};
