import React, { useState, useRef } from "react";
import { Box, Typography, useMediaQuery, Alert } from "@mui/material";
import TextInput from "../components/ui/TextInput";
import { LoginButton } from "../components/ui/Buttons";
import loginImage from "../assets/login.jpg";
import logoImage from "../assets/Logo4.png";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService"; // Importar el servicio

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isMobile = useMediaQuery("(max-width:900px)");
  const navigate = useNavigate();

  const userInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleLogin = async () => {
    try {
      setError(""); // limpiar errores previos
      const data = await loginUser(user, password); // llamada al backend

      // Guardar token y usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Login exitoso:", data);

      // Redirigir al home
      navigate("/home");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={loginImage}
            alt="login background"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          />
          <Box
            component="img"
            src={logoImage}
            alt="Logo empresa"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "40%",
              maxWidth: 300,
              zIndex: 1,
              objectFit: "contain",
              filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.3))",
            }}
          />
        </Box>
      )}

      {/* Panel izquierdo (formulario) */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: isMobile ? "100%" : "50%",
          height: "100%",
          bgcolor: "#817A6F",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFFFFF",
          textAlign: "center",
          p: isMobile ? 3 : 4,
        }}
      >
        {isMobile && (
          <Box
            component="img"
            src={logoImage}
            alt="Logo empresa"
            sx={{
              width: "120px",
              height: "auto",
              mb: 3,
              objectFit: "contain",
              alignSelf: "center",
              filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.3))",
            }}
          />
        )}

        <Typography
          variant={isMobile ? "h4" : "h3"}
          sx={{ mb: 1, color: "#FCFCFC" }}
        >
          Bienvenidos
        </Typography>

        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{ mb: 4, color: "#E0E0E0" }}
        >
          Sistema de Gestión de RRHH
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault(); // evita recarga
            handleLogin(); // ejecuta login
          }}
          style={{ width: isMobile ? "85%" : "60%", minWidth: 280 }}
        >
          <TextInput
            placeholder="Usuario"
            value={user}
            inputRef={userInputRef}
            onChange={(e) => setUser(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                passwordInputRef.current?.focus();
              }
            }}
          />

          <TextInput
            placeholder="Contraseña"
            type="password"
            value={password}
            inputRef={passwordInputRef}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleLogin();
              }
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <LoginButton
            type="submit"
            sx={{
              mt: 2,
              width: "100%",
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            Ingresar
          </LoginButton>

          <Typography sx={{ mt: 2, fontSize: "0.85rem", color: "#DADADA" }}>
            ¿Olvidaste tu contraseña?
          </Typography>
        </form>
      </Box>
    </Box>
  );
}
