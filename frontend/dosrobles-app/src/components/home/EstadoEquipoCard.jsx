/* src/components/home/EstadoEquipoCard.jsx*/

import React from "react";
import {
  Box,
  Card,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useFichaje } from "../../context/fichajeContextHelper";

export default function EstadoEquipoCard() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const { estadoEquipo } = useFichaje();

  return (
    <>
      {/* ===========================
          CUADRANTE 2 ESTADOS
          ============================== */}
          <Card
          sx={{
            flex: isMobile ? "0 0 100%" : "0 0 50%",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            p: 2,
            height: isMobile ? "auto" : "98%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="#808080">
              Estado del Equipo
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
            {[
              {
                color: "#FFD0D0",
                title: "Ausentes",
                count: estadoEquipo.ausentes,
              },
              {
                color: "#8EC6BA",
                title: "Fichados",
                count: estadoEquipo.fichados,
              },
            ].map((item, idx) => (
              <Box
                key={idx}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: item.color,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#808080"
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="#A0A0A0">
                    {item.count} empleados
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
    </>
  );
}
