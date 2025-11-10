import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay usuario al cargar la app
  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const token = authService.getToken();
        const usuarioLocal = authService.getUser();

        if (token && usuarioLocal) {
          // Verificar que el token sea válido
          const respuestaVerificacion = await authService.verificarToken(token);

          // Usar el usuario del backend (con rol actualizado)
          if (respuestaVerificacion.usuario) {
            setUser(respuestaVerificacion.usuario);
            // Actualizar también en localStorage para mantener sincronizado
            localStorage.setItem("user", JSON.stringify(respuestaVerificacion.usuario));
          } else {
            setUser(usuarioLocal);
          }
        }
      } catch (err) {
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
      setUser(response.usuario);
      return response;
    } catch (err) {
      const errorMessage = err.message || "Error al iniciar sesión";
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
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

// Hook para usar el contexto
export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};
