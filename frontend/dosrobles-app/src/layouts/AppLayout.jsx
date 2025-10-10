/* src/layouts/AppLayout.jsx */

import React from "react";
import MainLayout from "./MainLayout";
import Sidebar from "../components/Sidebar";
import styles from "../styles/AppLayout.module.css";
import { Outlet, useLocation } from "react-router-dom";

export default function AppLayout({ user, isAdmin }) {
  const location = useLocation();

  return (
    <MainLayout>
      <div className={styles.pageContainer}>
        {/* Sidebar dinámico */}
        <Sidebar user={user} isAdmin={isAdmin} />

        {/* Contenido principal */}
        <section
          className={styles.mainContent}
          style={{
            overflowY: location.pathname === "/home" ? "hidden" : "auto",
          }}
        >
          <Outlet />
        </section>
      </div>
    </MainLayout>
  );
}
