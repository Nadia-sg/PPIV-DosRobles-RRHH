import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import styles from "../styles/MainLayout.module.css";
import logo from "../assets/logo.png";
import topVector from "../assets/topVector.svg";
import topVectorMobile from "../assets/topVector-mobile.svg";
import logoutIcon from "../assets/logout.svg";
import { useUser } from "../context/userContextHelper";
import LogoutConfirmationModal from "../components/ui/LogoutConfirmationModal";

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const { logout } = useUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      logout();
      setShowLogoutModal(false);

      // Mostrar toast de éxito
      setToast({
        open: true,
        message: "Sesión cerrada correctamente",
        severity: "success",
      });

      // Redirigir al login después de cerrar sesión
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setToast({
        open: true,
        message: "Error al cerrar sesión",
        severity: "error",
      });
    }
  };

  return (
    <div className={styles.container} style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      {/* Vector decorativo superior responsivo */}
      <picture className={styles.topVector}>
        <source srcSet={topVectorMobile} media="(max-width: 768px)" />
        <img
          src={topVector}
          alt="Decoración superior"
          className={styles.topVector}
        />
      </picture>

      {/* Barra superior */}
      <header className={styles.topBar}>
        {/* Logo */}
        <div
          className={styles.logoContainer}
          onClick={() => navigate("/home")} // redirige al Home
          style={{ cursor: "pointer" }}  // indica que se puede clickear
        >
          <img src={logo} alt="Logo Dos Robles" className={styles.logo} />
        </div>

        {/* Botón de logout */}
        <div className={styles.logoutContainer}>
          <button
            className={styles.logoutBtn}
            title="Cerrar sesión"
            onClick={handleLogoutClick}
            style={{ cursor: "pointer" }}
          >
            <img src={logoutIcon} alt="Salir" className={styles.logoutIcon} />
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className={styles.content}>{children}</main>

      {/* Modal de confirmación de logout */}
      <LogoutConfirmationModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />

      {/* Toast de notificación */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2000,
        }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
