import { useState, useRef } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { PrimaryButton, SecondaryButton } from "../ui/Buttons";
import { documentosService } from "../../services/documentosService";

const TIPOS_DOCUMENTO = [
  { value: "certificado", label: "Certificado" },
  { value: "constancia_medica", label: "Constancia Médica" },
  { value: "comprobante", label: "Comprobante" },
  { value: "recibo", label: "Recibo" },
  { value: "otro", label: "Otro" },
];

export default function ModalSubirDocumento({
  open,
  onClose,
  empleadoId,
  onDocumentoSubido,
}) {
  const [tipoDocumento, setTipoDocumento] = useState("certificado");
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleArchivoSeleccionado = (e) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      // Validar que sea un PDF
      if (archivo.type !== "application/pdf") {
        setError("Por favor selecciona un archivo PDF válido");
        setArchivoSeleccionado(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Validar extensión
      if (!archivo.name.toLowerCase().endsWith(".pdf")) {
        setError("El archivo debe tener extensión .pdf");
        setArchivoSeleccionado(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setArchivoSeleccionado(archivo);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!archivoSeleccionado) {
      setError("Por favor selecciona un archivo");
      return;
    }

    try {
      setError("");
      setLoading(true);

      // Usar el nombre del archivo seleccionado
      const tipoNombre = TIPOS_DOCUMENTO.find(
        (t) => t.value === tipoDocumento
      )?.label;

      // Crear FormData con el archivo binario
      const formData = new FormData();
      formData.append("archivo", archivoSeleccionado);
      formData.append("empleadoId", empleadoId);
      formData.append("tipoDocumento", tipoDocumento);
      formData.append("tipoNombre", tipoNombre || tipoDocumento);
      formData.append("descripcion", `Archivo: ${archivoSeleccionado.name}`);

      const response = await documentosService.crearDocumento(formData);

      if (response.success) {
        setTipoDocumento("certificado");
        setArchivoSeleccionado(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onDocumentoSubido(response.data);
        onClose();
      }
    } catch (err) {
      setError(err.message || "Error al subir documento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#F5F5F5",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #E0E0E0",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <UploadFileIcon sx={{ color: "#7FC6BA", fontSize: 28 }} />
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 600, color: "#585858" }}>
            Subir Documento
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#808080" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Contenido */}
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Error */}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Tipo de Documento */}
        <Box>
          <label style={{ fontSize: "0.9rem", color: "#808080", fontWeight: 600 }}>
            Tipo de Documento *
          </label>
          <select
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              border: "1px solid #D0D0D0",
              borderRadius: "6px",
              fontFamily: "inherit",
              fontSize: "0.95rem",
              backgroundColor: "#FFFFFF",
            }}
          >
            {TIPOS_DOCUMENTO.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </Box>

        {/* Input File Oculto - Solo acepta PDF */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleArchivoSeleccionado}
          disabled={loading}
          accept=".pdf,application/pdf"
          style={{ display: "none" }}
        />

        {/* Botón para seleccionar archivo */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <label style={{ fontSize: "0.9rem", color: "#808080", fontWeight: 600 }}>
              Archivo PDF *
            </label>
            <Typography sx={{ fontSize: "0.75rem", color: "#999999" }}>
              Solo PDF
            </Typography>
          </Box>
          <PrimaryButton
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            fullWidth
            sx={{ bgcolor: "#7FC6BA" }}
          >
            Seleccionar Archivo
          </PrimaryButton>
          {archivoSeleccionado && (
            <Typography
              sx={{
                fontSize: "0.85rem",
                color: "#7FC6BA",
                mt: 1,
                fontWeight: 500,
              }}
            >
              ✓ {archivoSeleccionado.name}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #E0E0E0",
          backgroundColor: "#FFFFFF",
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <SecondaryButton onClick={onClose} disabled={loading}>
          Cancelar
        </SecondaryButton>
        <PrimaryButton
          onClick={handleSubmit}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Subir"
          )}
        </PrimaryButton>
      </Box>
    </Dialog>
  );
}
