// src/pages/usuarios/UsuariosList.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import CustomTable from "../../components/ui/CustomTable";
import {
  SecondaryButton,
  FichaButtonWithIcon,
} from "../../components/ui/Buttons";
import NuevoUsuarioModal from "../../components/modales/NuevoUsuarioModal";
import VerUsuarioModal from "../../components/modales/VerUsuarioModal";

const UsuariosList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/users");
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleVerUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
  };

  const handleEliminarUsuario = async (usuario) => {
    if (!window.confirm(`¿Eliminar al usuario ${usuario.username}?`)) return;

    try {
      const response = await fetch(`http://localhost:4000/api/users/${usuario._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar usuario");
      alert("Usuario eliminado correctamente");
      fetchUsuarios();
      setUsuarioSeleccionado(null);
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el usuario");
    }
  };

  const columns = isMobile
    ? ["", "Usuario", "Rol", "Acción"]
    : ["", "Usuario", "Rol", "Acción"];

  const rows = usuarios.map((user) => {
    return {
      foto: (
        <Avatar sx={{ width: 40, height: 40 }}>
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
      ),
      username: user.username,
      role: user.role,
      accion: (
        <FichaButtonWithIcon
          icon={DescriptionIcon}
          label="Ver Usuario"
          onClick={() => handleVerUsuario(user)}
        />
      ),
    };
  });

  return (
    <Box sx={{ padding: "2rem" }}>
      {/* Encabezado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: "#585858", mb: 1 }}>
            Usuarios
          </Typography>
          <Typography variant="body2" sx={{ color: "#808080" }}>
            Visualizá el listado completo de usuarios y accedé a su información detallada
          </Typography>
        </Box>

        <SecondaryButton startIcon={<EditIcon />} onClick={() => setModalOpen(true)}>
          Nuevo Usuario
        </SecondaryButton>
      </Box>

      {/* Tabla */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : usuarios.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "#808080", mt: 5 }}>
          No hay usuarios registrados aún.
        </Typography>
      ) : (
        <CustomTable
          columns={columns}
          rows={
            isMobile
              ? rows.map((row) => ({
                  foto: row.foto,
                  username: row.username,
                  role: row.role,
                  accion: row.accion,
                }))
              : rows
          }
        />
      )}

      {/* Modal Nuevo Usuario */}
      <NuevoUsuarioModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUsuarioGuardado={fetchUsuarios}
      />

      {/* Modal Ver Usuario */}
      <VerUsuarioModal
        open={!!usuarioSeleccionado}
        onClose={() => setUsuarioSeleccionado(null)}
        usuario={usuarioSeleccionado}
        onEditar={() => {
          setModalOpen(true);
          setUsuarioSeleccionado(null);
        }}
        onEliminar={() => handleEliminarUsuario(usuarioSeleccionado)}
      />
    </Box>
  );
};

export default UsuariosList;

