// src/pages/ComponentsDemo.jsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import {
  PrimaryButton,
  SecondaryButton,
  NextButton,
  PrevButton,
  LoginButton,
  RejectButton,
  CloseButton,
  FichaButtonWithIcon, 
} from "../components/ui/Buttons";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import SearchBar from "../components/ui/SearchBar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CustomTable from "../components/ui/CustomTable";
import ModalDialog from "../components/ui/ModalDialog";
import ModalCard from "../components/ui/ModalCard";

export default function ComponentsDemo() {
  const [openModal, setOpenModal] = useState(false);
  const [openModalCard, setOpenModalCard] = useState(false);

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
        <SecondaryButton startIcon={<FavoriteIcon />}>Botón Secundario</SecondaryButton>,
      ],
    },
    {
      title: "Otros botones",
      description: "Botones para avanzar o retroceder entre pasos y cerrar.",
      buttons: [
        <PrevButton startIcon={<ArrowBackIcon />}>Anterior</PrevButton>,
        <NextButton endIcon={<ArrowForwardIcon />}>Siguiente</NextButton>,
        <CloseButton>
          <CloseIcon />
        </CloseButton>,
        <FichaButtonWithIcon icon={AssignmentIcon} label="Ver Ficha" />, // ✅ corregido
      ],
    },
    {
      title: "Autenticación",
      description: "Acciones relacionadas al inicio de sesión o registro.",
      buttons: [<LoginButton>Ingresar</LoginButton>],
    },
    {
      title: "Campos de Búsqueda",
      description:
        "Usados para buscar empleados, registros o datos específicos.",
      buttons: [<SearchBar placeholder="Buscar..." />],
    },
  ];

  // Datos de ejemplo para la tabla
  const tableColumns = ["Nombre y Apellido", "Legajo", "Email"];
  const tableRows = [
    { nombre: "Sol Juarez", legajo: 154, email: "sol@gmail.com" },
    { nombre: "Luna Pérez", legajo: 155, email: "luna@mail.com" },
    { nombre: "Milo Torres", legajo: 156, email: "milo@mail.com" },
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        🎨 Catálogo de Componentes — Botones, Tablas y Diálogos
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Esta página sirve como guía visual y de referencia para los distintos
        estilos de componentes definidos en el proyecto.
      </Typography>

      <Grid container spacing={3}>
        {/* Sección de botones */}
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
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

        {/* Sección de tabla */}
        <Grid item xs={12}>
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
                Tabla de Ejemplo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Ejemplo visual del componente de tabla reutilizable con
                acciones.
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <CustomTable
                columns={tableColumns}
                rows={tableRows}
                onEdit={(row) => console.log("Editar", row)}
                onDelete={(row) => console.log("Eliminar", row)}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Modales / Diálogos */}
        <Grid item xs={12} md={6}>
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
                Modales / Diálogos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Ventanas emergentes para confirmaciones, alertas o formularios.
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Botón y ModalDialog */}
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#7FC6BA",
                  "&:hover": { bgcolor: "#6FB0A6" },
                  borderRadius: 2,
                  mr: 2,
                  mb: 2,
                }}
                onClick={() => setOpenModal(true)}
              >
                Abrir Modal
              </Button>
              <ModalDialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                title="Confirmar acción"
                content="¿Estás segura de que querés continuar con esta operación?"
                actions={[
                  {
                    label: "Cancelar",
                    variant: "outlined",
                    onClick: () => setOpenModal(false),
                  },
                  {
                    label: "Confirmar",
                    variant: "contained",
                    onClick: () => {
                      alert("Acción confirmada");
                      setOpenModal(false);
                    },
                  },
                ]}
              />

              {/* Botón y ModalCard */}
              <PrimaryButton
                onClick={() => setOpenModalCard(true)}
                sx={{ mb: 2 }}
              >
                Abrir Modal Card
              </PrimaryButton>
              <ModalCard
                open={openModalCard}
                onClose={() => setOpenModalCard(false)}
                title="Agregar Empleado"
                actions={[
                  {
                    label: "Cancelar",
                    variant: "outlined",
                    onClick: () => setOpenModalCard(false),
                  },
                  {
                    label: "Guardar",
                    variant: "contained",
                    onClick: () => alert("Empleado agregado!"),
                  },
                ]}
                width={500}
              >
                {/* Contenido interno: formulario de ejemplo */}
                <Stack spacing={2}>
                  <PrimaryButton>Input o formulario aquí</PrimaryButton>
                  <SecondaryButton>Otro campo o botón</SecondaryButton>
                </Stack>
              </ModalCard>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
