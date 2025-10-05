// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

export const colors = {
  primary: '#7FC6BA',       // color principal
  secondary: '#817A6F',     // color secundario
  neutral1: '#FFFFFF',       // blanco
  neutral2: '#B9B9B9',      // color del bg gradiente
  neutral3: '#585858',      // gris 5
  neutral4: '#808080',      // gris oscuro
  neutral5: '#E9E9E9',      // gris 3
  neutral6: '#FAFAFA',      //gris claro
  error: '#FF7779'           // color error
};

export const typography = {
  fontFamily: "'Roboto', sans-serif",
  h1: { fontSize: '24px', fontWeight: 700 },
  body1: { fontSize: '16px' }
};

// Theme MUI
export const muiTheme = createTheme({
  palette: {
    primary: { main: colors.primary },
    secondary: { main: colors.secondary },
    background: { default: colors.neutral1 },
    error: { main: colors.error },
    text: {
      primary: colors.neutral3,
      secondary: colors.neutral4
    }
  },
  typography
});
