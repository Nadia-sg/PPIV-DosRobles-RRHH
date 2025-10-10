import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

/**
 * FormCard
 * Contenedor estilizado para agrupar campos de formulario.
 * 
 * Props:
 * - title: string → título del formulario
 * - children: JSX → contenido interno (inputs, selects, etc.)
 */

export default function FormCard({ title, children }) {
  return (
    <Box sx={{ p: 4 }}>
      {title && (
        <Typography
          variant="h5"
          fontWeight={600}
          color="#585858"
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
      )}
      <Card
        sx={{
          border: "2px solid #7FC6BA",
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent>{children}</CardContent>
      </Card>
    </Box>
  );
}
