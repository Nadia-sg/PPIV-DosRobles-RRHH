import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Box, CircularProgress } from "@mui/material";

export default function ProtectedRoute({
  element,
  requiredRole = null,
}) {
  const { user, loading, isAuthenticated } = useUser();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifica un rol requerido, verificar
  if (requiredRole) {
    const rolesPermitidos = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];

    console.log("🔐 [ProtectedRoute] Verificando acceso. Usuario rol:", user.role, "Roles permitidos:", rolesPermitidos);

    if (!rolesPermitidos.includes(user.role)) {
      console.log("❌ [ProtectedRoute] Acceso denegado. Usuario no tiene un rol permitido");
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ fontSize: "2rem", fontWeight: "bold", color: "#FF7779" }}>
            Acceso Denegado
          </Box>
          <Box sx={{ fontSize: "1rem", color: "#808080" }}>
            No tienes permisos para acceder a esta página
          </Box>
        </Box>
      );
    }
    console.log("✅ [ProtectedRoute] Acceso permitido");
  }

  return element;
}
