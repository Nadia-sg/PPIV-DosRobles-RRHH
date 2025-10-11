/* src/layouts/AppLayout.jsx */

import React from "react";
import MainLayout from "./MainLayout";
import Sidebar from "../components/Sidebar";
import styles from "../styles/AppLayout.module.css";
import { Outlet, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

export default function AppLayout({ user, isAdmin }) {
  const location = useLocation();

  // Detectamos si estamos en mobile
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <MainLayout>
      <div className={styles.pageContainer}>
        {/* Sidebar dinámico */}
        <Sidebar user={user} isAdmin={isAdmin} />

        {/* Contenido principal */}
        <section
          className={styles.mainContent}
          style={{
            // En desktop: ocultamos scroll si estamos en /home, en mobile siempre auto
            overflowY:
              !isMobile && location.pathname === "/home" ? "hidden" : "auto",
            height: "100%", 
          }}
        >
          <Outlet />
        </section>
      </div>
    </MainLayout>
  );
}
