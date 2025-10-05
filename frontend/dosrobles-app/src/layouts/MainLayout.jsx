/*src/layouts/MainLayout.jsx*/ 


import React from 'react';
import styles from '../styles/MainLayout.module.css';
import topVector from '../assets/topVector.svg';
import logo from '../assets/logo.png';
import { IconButton, Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export default function MainLayout({ children }) {
  return (
    <div className={styles.container}>

      {/* Vector decorativo superior */}
      <img src={topVector} alt="Decoración superior" className={styles.topVector} />

      {/* Barra superior con logo e ícono */}
      <div className={styles.topBar}>

        {/* Logo a la izquierda */}
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo Dos Robles" className={styles.logo} />
        </div>

        {/* Botón de logout a la derecha, con contenedor propio */}
        <div className={styles.logoutContainer}>
          <Tooltip title="Cerrar sesión" arrow placement="bottom">
            <IconButton className={styles.logoutBtn} aria-label="Cerrar sesión">
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </div>

      </div>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}

