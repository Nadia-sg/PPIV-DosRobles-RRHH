/* src/layouts/AppLayout.jsx */

/* src/layouts/AppLayout.jsx */

import React from "react";
import MainLayout from "./MainLayout";
import Sidebar from "../components/Sidebar"; 
import styles from "../styles/AppLayout.module.css";

export default function AppLayout({ children, user, isAdmin }) {
  return (
    <MainLayout>
      <div className={styles.pageContainer}>
        {/* Sidebar dinámico */}
        <Sidebar user={user} isAdmin={isAdmin} />

        {/* Contenido principal */}
        <section className={styles.mainContent}>
          {children}
        </section>
      </div>
    </MainLayout>
  );
}
