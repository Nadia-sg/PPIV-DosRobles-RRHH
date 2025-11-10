/* src/pages/Home.jsx */

import React from "react";
import { Box, Grid, useMediaQuery } from "@mui/material";
import FichajeCard from "../components/home/FichajeCard";
import EstadoEquipoCard from "../components/home/EstadoEquipoCard";
import BandejaEntradaCard from "../components/home/BandejaEntradaCard";
import EventosCard from "../components/home/EventosCard";

export default function Home() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

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
      <Box
        sx={{
          display: "flex",
          flex: isMobile ? "0 0 auto" : "0 0 30%",
          gap: 2,
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        {/* CUADRANTE 1: FICHAJE */}
        <FichajeCard />

        {/* CUADRANTE 2: ESTADO DEL EQUIPO */}
        <EstadoEquipoCard />
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
        <BandejaEntradaCard />

        {/* CUADRANTE 4: EVENTOS */}
        <EventosCard API_BASE={API_BASE} />
      </Box>
    </Box>
  );
}