/* src/components/home/BandejaEntradaCard.jsx*/

import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {
  PrimaryButton,
  SecondaryButton,
  IconNextButton,
} from "../../components/ui/Buttons";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


export default function BandejaEntradaCard() {
  const isMobile = useMediaQuery("(max-width:900px)");
   const navigate = useNavigate();


  return (
    <>
      {/* ===========================
          CUADRANTE 3 BANDEJA ENTRADA
          ============================== */}
  <Card
          sx={{
            flex: isMobile ? "0 0 100%" : "0 0 50%",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            p: 2,
            height: isMobile ? "auto" : "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="#808080">
              Bandeja de entrada
            </Typography>
            <IconNextButton onClick={() => navigate("/bandeja-entrada")}>
              <ArrowForwardIosIcon />
            </IconNextButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              flex: 1,
              overflowY: "auto",
            }}
          >
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { xs: "flex-start", md: "space-between" },
                  alignItems: { xs: "flex-start", md: "center" },
                  backgroundColor: "#E9E9E9",
                  borderRadius: 1,
                  p: 1.5,
                  mb: 1,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#dcdcdc" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "space-between", md: "flex-start" },
                    width: "100%",
                    mb: { xs: 0.5, md: 0 },
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Fecha {i + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Remitente {i + 1}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ width: "100%" }}
                >
                  Asunto del mail {i + 1}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>

    </>
  );
}
