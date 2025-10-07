// src/pages/ComponentsDemo.jsx

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import {
  PrimaryButton,
  SecondaryButton,
  NextButton,
  PrevButton,
  LoginButton,
  RejectButton,
} from "../components/ui/Buttons";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PetsIcon from "@mui/icons-material/Pets";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";

export default function ComponentsDemo() {
  const sections = [
    {
      title: "Botones Principales",
      description: "Usados para acciones primarias o destacadas.",
      buttons: [
        <PrimaryButton startIcon={<FavoriteIcon />}>Botón Primario</PrimaryButton>,
        <RejectButton startIcon={<CloseIcon />}>Rechazar</RejectButton>,
      ],
    },
    {
      title: "Botones Secundarios",
      description: "Usados para acciones de apoyo o secundarias.",
      buttons: [
        <SecondaryButton startIcon={<FavoriteIcon />}>
          Botón Secundario
        </SecondaryButton>,
      ],
    },
    {
      title: "Navegación",
      description: "Botones para avanzar o retroceder entre pasos.",
      buttons: [
        <PrevButton startIcon={<ArrowBackIcon />}>Anterior</PrevButton>,
        <NextButton endIcon={<ArrowForwardIcon />}>Siguiente</NextButton>,
      ],
    },
    {
      title: "Autenticación",
      description: "Acciones relacionadas al inicio de sesión o registro.",
      buttons: [<LoginButton>Ingresar</LoginButton>],
    },
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        🎨 Catálogo de Componentes — Botones
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Esta página sirve como guía visual y de referencia para los distintos estilos de botones
        definidos en el proyecto.
      </Typography>

      <Grid container spacing={3}>
        {sections.map((section, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {section.description}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {section.buttons.map((btn, idx) => (
                    <Box key={idx}>{btn}</Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
