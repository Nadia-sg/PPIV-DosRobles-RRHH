/* src/pages/Home.jsx */

import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CakeIcon from "@mui/icons-material/Cake";
import { useNavigate } from "react-router-dom";
import FichajeCard from "../components/home/FichajeCard";
import EstadoEquipoCard from "../components/home/EstadoEquipoCard";
import BandejaEntradaCard from "../components/home/BandejaEntradaCard";
import EventosCard from "../components/home/EventosCard";


export default function Home() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [seconds, setSeconds] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Simulador de fichaje
  useEffect(() => {
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Leer rol del token (si existe)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
      } catch (e) {
        console.error("Error decodificando token:", e);
      }
    }
  }, []);

  const totalSeconds = 8 * 3600;
  const progress = Math.min((seconds / totalSeconds) * 100, 100);

  const eventos = [
    { fecha: "25 Oct", hora: "14:00", nombre: "Cumpleaños Erica", icono: <CakeIcon /> },
    { fecha: "27 Oct", hora: "09:30", nombre: "Reunión de equipo", icono: <EmojiEventsIcon /> },
    { fecha: "29 Oct", hora: "16:00", nombre: "Entrega de proyecto", icono: <EmojiEventsIcon /> },
  ];

  if (!userRole) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: isMobile ? "auto" : "100dvh",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        gap: 2,
        boxSizing: "border-box",
        padding: 4,
      }}
    >
      {/* ===================
          FILA SUPERIOR
          =================== */}
      {userRole === "admin" ? (
        <>
          {/* ADMIN */}
          <Box
            sx={{
              display: "flex",
              flex: isMobile ? "0 0 auto" : "0 0 30%",
              gap: 2,
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            {/* CUADRANTE 1: FICHAJE */}
            <FichajeCard
              isMobile={isMobile}
              progress={progress}
              seconds={seconds}
              navigate={navigate}
            />
            {/* CUADRANTE 2: ESTADO DEL EQUIPO */}
            <EstadoEquipoCard isMobile={isMobile} />
          </Box>

          {/* ===================
            FILA INFERIOR
          =================== */}
          <Box
            sx={{
              display: "flex",
              flex: isMobile ? "0 0 auto" : "0 0 40%",
              gap: 2,
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
        {/* CUADRANTE 3: BANDEJA DE ENTRADA */}
            <BandejaEntradaCard isMobile={isMobile} navigate={navigate} />
       {/* CUADRANTE 4: EVENTOS */}
            <EventosCard isMobile={isMobile} eventos={eventos} />
          </Box>
        </>
      ) : (
        /* EMPLEADO */
        <Box
          sx={{
            display: "flex",
            flex: 1,
            gap: 2,
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          {/* Columna izquierda (idéntica al admin) */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flex: isMobile ? "0 0 100%" : "0 0 50%",
            }}
          >
            <FichajeCard
              isMobile={isMobile}
              progress={progress}
              seconds={seconds}
              navigate={navigate}
            />
            <BandejaEntradaCard isMobile={isMobile} navigate={navigate} />
          </Box>

          {/* Columna derecha — eventos ocupa todo el alto */}
          <Box
            sx={{
              flex: isMobile ? "0 0 100%" : "0 0 50%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <EventosCard
              isMobile={isMobile}
              eventos={eventos}
              fullHeight
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

