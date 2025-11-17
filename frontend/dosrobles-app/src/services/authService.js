const API_URL = "http://localhost:4000/api/auth";

export const authService = {
  // Login
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guardar token en localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const token = localStorage.getItem("token");

      // Llamar a la API de logout para validar y registrar
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.warn("Advertencia en logout API:", error);
      // No bloquear logout si hay error en la API
    } finally {
      // Siempre limpiar localStorage, incluso si hay error en la API
      localStorage.clear();
      console.log("✅ Sesión cerrada localmente");
    }
  },

  // Verificar token
  verificarToken: async (token) => {
    try {
      const response = await fetch(`${API_URL}/verificar`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Token inválido");
      }

      return data;
    } catch (error) {
      console.error("Error verificando token:", error);
      throw error;
    }
  },

  // Obtener usuario del localStorage
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Obtener token del localStorage
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Verificar rol
  hasRole: (requiredRole) => {
    const user = authService.getUser();
    if (!user) return false;
    if (requiredRole instanceof Array) {
      return requiredRole.includes(user.role);
    }
    return user.role === requiredRole;
  },
};
