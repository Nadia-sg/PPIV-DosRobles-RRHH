import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { UserContext } from "./UserContextType";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay usuario al cargar la app
  useEffect(() => {
    const verificarAutenticacion = () => {
      try {
        console.log("🔍 [UserContext] Verificando autenticación...");
        const token = authService.getToken();
        const usuarioLocal = authService.getUser();

        console.log("🔍 [UserContext] Token:", !!token);
        console.log("🔍 [UserContext] Usuario local:", usuarioLocal);

        if (token && usuarioLocal) {
          console.log("✅ [UserContext] Token y usuario encontrados, usando usuario local");
          setUser(usuarioLocal);
        } else {
          console.log("⚠️ [UserContext] No hay token o usuario local. Token:", !!token, "Usuario:", !!usuarioLocal);
        }
      } catch {
        console.log("Token inválido, realizando logout");
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    verificarAutenticacion();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await authService.login(username, password);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage = err.message || "Error al iniciar sesión";
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error("Error en logout:", error);
      // Igual limpiar estado local aunque falle
      setUser(null);
      setError(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
