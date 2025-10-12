/*src/components/ui/Buttons.jsx*/ 


import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment"; 

// Botón base — todos heredan de este
export const BaseButton = styled(Button)(
  ({  bgcolor, color, hoverBg, hoverColor, radius, shadow, width, height, fontWeight }) => ({
    backgroundColor: bgcolor || "#ffffff",
    color: color || "#000000",
    borderRadius: radius || 12,
    textTransform: "none",
    fontWeight: fontWeight || 500,
    boxShadow: shadow ? "0 2px 6px rgba(0,0,0,0.2)" : "none",
    width: width || "auto",
    height: height || "auto",
    padding: "0.5rem 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    border: "none",
    transition: "all 0.25s ease",
    "&:hover": {
      backgroundColor: hoverBg || bgcolor,
      color: hoverColor || color,
      transform: "scale(1.03)",
    },
    "&:active": {
      transform: "scale(0.98)",
      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
    },
  })
);

// Botón Primario
export const PrimaryButton = styled(BaseButton)({
  backgroundColor: "var(--primary, #7FC6BA)",
  color: "#FCFCFC",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  "&:hover": {
    backgroundColor: "#808080",
    transform: "scale(1.05)",
  },
  "&:active": {
    backgroundColor: "#56A99B",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
  },
});

// Botón Secundario
export const SecondaryButton = styled(BaseButton)({
  backgroundColor: "#FFFFFF",
  color: "#808080",
  border: "2px solid var(--primary, #7FC6BA)",
  "&:hover": {
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    color: "var(--primary, #7FC6BA)",
  },
});

// Botón Siguiente
export const NextButton = styled(BaseButton)({
  width: 103,
  height: 24,
  backgroundColor: "#FFFFFF",
  color: "#808080",
  borderRadius: 8,
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  "&:hover": {
    backgroundColor: "#D9D9D9",
  },
});

// Botón Anterior
export const PrevButton = styled(NextButton)({});

// Botón Ingresar
export const LoginButton = styled(BaseButton)({
  width: 524,
  height: 48,
  backgroundColor: "var(--primary, #7FC6BA)",
  color: "#555555",
  borderRadius: 12,
  fontWeight: "bold",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  "&:hover": {
    backgroundColor: "#000000",
    color: "#FFFFFF",
  },
});

// Botón Rechazar
export const RejectButton = styled(PrimaryButton)({
  backgroundColor: "#FF7779",
  "&:hover": { backgroundColor: "#E06668" },
  "&:active": { backgroundColor: "#CC5C60" },
});

// Botón de Cerrar
export const CloseButton = styled(BaseButton)({
  width: 30,
  height: 30,
  borderRadius: 8,
  padding: 0,
  minWidth: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  color: "#808080",
  "&:hover": {
    backgroundColor: "#808080",
    color: "#FFFFFF",
  },
});

// Botón "Next" solo con ícono
export const IconNextButton = styled(NextButton)(({ theme }) => ({
  width: 36,
  height: 36,
  minWidth: "auto",
  padding: 0,
  borderRadius: "20%",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  "& .MuiSvgIcon-root": {
    fontSize: 18, 
    [theme.breakpoints.down("sm")]: {
       width: 16,
       height: 16, 
    },
  },
  "&:hover": {
    backgroundColor: "#D9D9D9",
    transform: "scale(1.05)",
  },
}));

// 🔹 Botón Ver Ficha
export const FichaButton = styled(BaseButton)(({ theme }) => ({
  width: 60,
  height: 60,
  flexDirection: "column",
  borderRadius: 10,
  backgroundColor: "var(--primary, #7FC6BA)",
  color: "#FFFFFF",
  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
  textTransform: "none",
  fontWeight: "500",
  fontSize: 10,
  justifyContent: "center",
  alignItems: "center",
  padding: 4,
  gap: 2,
  transition: "transform 0.2s ease, background-color 0.2s ease",

  "& .MuiSvgIcon-root": {
    fontSize: 22,
    margin: 0,
  },
  "&:hover": {
    backgroundColor: "#56A99B",
    transform: "scale(1.05)",
  },
  "&:active": {
    backgroundColor: "#4C9187",
    transform: "scale(0.97)",
  },

  // RESPONSIVE: versión mobile
  "@media (max-width: 600px)": {
    width: 50,
    height: 50,
    gap: 0,

    "& > *:not(.MuiSvgIcon-root)": {
      display: "none",
    },

    "& .MuiSvgIcon-root": {
      fontSize: 24,
    },
  },
}));

// 🔹 Wrapper para usar icon + label fácilmente
export const FichaButtonWithIcon = ({ icon: Icon, label, ...props }) => (
  <FichaButton {...props}>
    {Icon && <Icon />}
    {label && label}
  </FichaButton>
);
