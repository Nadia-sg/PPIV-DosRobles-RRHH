import { useState } from "react";
import { Box, Typography, useMediaQuery, Alert, CircularProgress } from "@mui/material";
import TextInput from "../components/ui/TextInput";
import { LoginButton } from "../components/ui/Buttons";
import loginImage from "../assets/login.jpg";
import logoImage from "../assets/Logo4.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Por favor ingresa usuario y contraseña");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await login(username, password);
      // Si el login es exitoso, redirigir al home
      navigate("/home");
    } catch (err) {
      setError(err.message || "Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  // Manejar Enter en los inputs
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
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
      {/* Imagen de fondo (solo en desktop) */}
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
          borderTopRightRadius: isMobile ? 0 : "24px",
          borderBottomRightRadius: isMobile ? 0 : "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: isMobile ? "none" : "4px 0 12px rgba(0,0,0,0.2)",
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
          sx={{
            fontWeight: 600,
            mb: 1,
            color: "#FCFCFC",
            letterSpacing: "0.5px",
            marginBottom: "0",
          }}
        >
          Bienvenidos
        </Typography>

        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            fontWeight: 500,
            color: "#E0E0E0",
            marginBottom: "2rem",
          }}
        >
          Sistema de Gestión de RRHH
        </Typography>

        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            fontWeight: 400,
            mb: isMobile ? 3 : 4,
            color: "#E0E0E0",
          }}
        >
          Iniciar sesión
        </Typography>

        <Box sx={{ width: isMobile ? "85%" : "60%", minWidth: 280 }}>
          <TextInput
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <TextInput
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />

          {/* Mensaje de error */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <LoginButton
            onClick={handleLogin}
            disabled={loading}
            sx={{
              mt: 2,
              width: "100%",
              fontSize: isMobile ? "0.9rem" : "1rem",
              transition: "all 0.25s ease",
              position: "relative",
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Ingresar"}
          </LoginButton>

          <Typography
            sx={{
              mt: 2,
              fontSize: "0.85rem",
              color: "#DADADA",
              textAlign: "center",
            }}
          >
            ¿Olvidaste tu contraseña?
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}