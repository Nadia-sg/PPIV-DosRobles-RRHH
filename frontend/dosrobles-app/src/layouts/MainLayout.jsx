import React from "react";
import styles from "../styles/MainLayout.module.css";
import logo from "../assets/logo.png";
import topVector from "../assets/topVector.svg";
import topVectorMobile from "../assets/topVector-mobile.svg"; 
import logoutIcon from "../assets/logout.svg"; 
import { useNavigate } from "react-router-dom";

export default function MainLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
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
          <button className={styles.logoutBtn} title="Cerrar sesión">
            <img src={logoutIcon} alt="Salir" className={styles.logoutIcon} />
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className={styles.content}>{children}</main>
    </div>
  );
}
