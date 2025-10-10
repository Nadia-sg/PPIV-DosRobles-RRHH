/* src/pages/Home.jsx */

import React from "react";
import { Box, Card, Typography, useMediaQuery } from "@mui/material";

export default function Home() {
  const isMobile = useMediaQuery("(max-width:900px)");

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
        padding: 2, 
      }}
    >
      {/* FILA SUPERIOR (30%) */}
      <Box
        sx={{
          display: "flex",
          flex: "0 0 30%", 
          gap: 2,
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        <Card
          sx={{
            flex: isMobile ? "0 0 100%" : "0 0 50%",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            height: "90%", 
          }}
        >
          <Typography variant="h6">Cuadrante 1</Typography>
        </Card>

        <Card
          sx={{
            flex: isMobile ? "0 0 100%" : "0 0 50%",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            height: "90%",
          }}
        >
          <Typography variant="h6">Cuadrante 2</Typography>
        </Card>
      </Box>

      {/* FILA INFERIOR (70%) */}
      <Box
        sx={{
          display: "flex",
          flex: "0 0 40%", 
          gap: 2,
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
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
