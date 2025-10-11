/* src/pages/Home.jsx */

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  useMediaQuery,
  IconButton,
  CircularProgress,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  PrimaryButton,
  SecondaryButton,
  NextButton,
  IconNextButton,
} from "../components/ui/Buttons";

export default function Home() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [seconds, setSeconds] = useState(0);

  // Temporizador simulando fichaje
  useEffect(() => {
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const totalSeconds = 8 * 3600;
  const progress = Math.min((seconds / totalSeconds) * 100, 100);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        gap: 1.5,
        boxSizing: "border-box",
        padding: 4,
      }}
    >
      {/* ///////////////////////
             ///// FILA SUPERIOR ////
             /////////////////////// */}
      <Box
        sx={{
          display: "flex",
          flex: "0 0 30%",
          gap: 2,
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        {/* ///////////////////////
               ///// CUADRANTE 1 ////
               /////////////////////// */}

        <Card
          sx={{
            flex: isMobile ? "0 0 100%" : "0 0 50%",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
            height: "90%",
            boxSizing: "border-box",
          }}
        >
          {/* Encabezado */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="#808080">
              Fichaje
            </Typography>
            <IconNextButton>
              <ArrowForwardIosIcon />
            </IconNextButton>
          </Box>

          {/* Cuerpo */}
          <Box
            sx={{
              display: "flex",
              flex: 1,
              gap: 2,
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            {/* Columna de botones */}
            <Box
              sx={{
                flex: "1 1 50%",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                marginLeft: 1.5,
              }}
            >
              <PrimaryButton startIcon={<PlayArrowIcon />}>
                Fichaje oficina
              </PrimaryButton>
              <SecondaryButton startIcon={<PlayArrowIcon />}>
                Fichaje remoto
              </SecondaryButton>
              <Typography
                sx={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "primary.main",
                  "&:hover": { color: "primary.dark" },
                  mt: 1,
                }}
              >
                Solicitar corrección
              </Typography>
            </Box>

            {/* Columna de temporizador */}
            <Box
              sx={{
                flex: "1 1 50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
              }}
            >
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                {/* Fondo */}
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={100}
                  thickness={5}
                  sx={{ color: "#e0e0e0" }}
                />
                {/* Progreso */}
                <CircularProgress
                  variant="determinate"
                  value={progress}
                  size={100}
                  thickness={5}
                  sx={{ color: "#817A6F", position: "absolute", left: 0 }}
                />
                {/* Texto central */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption">
                    {Math.floor(seconds / 3600)}h{" "}
                    {Math.floor((seconds % 3600) / 60)}m
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* ///////////////////////
               ///// CUADRANTE 2 ////
               /////////////////////// */}
        <Card
          sx={{
            flex: isMobile ? "0 0 100%" : "0 0 50%",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            p: 2,
            height: "90%",
          }}
        >
          {/* Encabezado */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="h6" fontWeight="bold" color="#808080">
              Estado del Equipo
            </Typography>
            <IconNextButton>
              <ArrowForwardIosIcon />
            </IconNextButton>
          </Box>

          {/* Tabla de estado */}
          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 1,
            pt: 4, }}>

            {/* Fila 1 - Ausentes */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: "#FFD0D0",
                  flexShrink: 0,
                  ml: 2, 
                }}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="subtitle1" fontWeight="bold" color="#808080">
                  Ausentes
                </Typography>
                <Typography variant="body2" color="#A0A0A0">
                  3 empleados
                </Typography>
              </Box>
            </Box>

            {/* Fila 2 - Fichados */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: "#8EC6BA",
                  flexShrink: 0,
                  ml: 2,
                  }}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="subtitle1" fontWeight="bold" color="#808080">
                  Fichados
                </Typography>
                <Typography variant="body2" color="#A0A0A0">
                  12 empleados
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* ///////////////////////
             ///// FILA INFERIOR ////
             /////////////////////// */}
      <Box
        sx={{
          display: "flex",
          flex: "0 0 40%",
          gap: 2,
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        {/* ///////////////////////
               ///// CUADRANTE 3 ////
               /////////////////////// */}
        <Card
          sx={{
            flex: isMobile ? "0 0 100%" : "0 0 50%",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            height: "100%",
          }}
        >
          <Typography variant="h6">Cuadrante 3</Typography>
        </Card>

        {/* ///////////////////////
               ///// CUADRANTE 4 ////
               /////////////////////// */}
         <Card
          sx={{
            flex: isMobile ? "0 0 100%" : "0 0 50%",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            height: "100%",
          }}
        >
          <Typography variant="h6">Cuadrante 4</Typography>
        </Card>
      </Box>
    </Box>
  );
}