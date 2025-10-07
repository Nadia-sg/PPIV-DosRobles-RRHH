/* src/layouts/AppLayout.jsx */

import React from "react";
import { Outlet } from "react-router-dom"; 
import MainLayout from "./MainLayout";
import Sidebar from "../components/Sidebar"; 
import styles from "../styles/AppLayout.module.css";

export default function AppLayout({ user, isAdmin }) {
  return (
    <MainLayout>
      <div className={styles.pageContainer}>
        {/* Sidebar dinámico */}
        <Sidebar user={user} isAdmin={isAdmin} />

        {/* Contenido principal */}
        <section className={styles.mainContent}>
          <Outlet /> {/* las páginas se insertan aquí */}
        </section>
      </div>
    </MainLayout>
  );
}

