/*src/components/ui/TextInput.jsx*/ 

import React from "react";
import { Box, Typography, TextField } from "@mui/material";

export default function TextInput({
  label,
  placeholder,
  value,
  onChange,
  helperText,
  error,
  icon,
  type = "text",
  inputRef,       
  onKeyDown,      
}) {
  return (
    <Box sx={{ mb: 3 }}>
      {label && (
        <Typography
          sx={{
            mb: 0.5,
            color: "#585858",
            fontWeight: 500,
            fontSize: "0.95rem",
          }}
        >
          {label}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E1E1",
          borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          px: 1.5,
          py: 0.5,
        }}
      >
        {icon && <Box sx={{ mr: 1, color: "#7FC6BA" }}>{icon}</Box>}
        <TextField
          variant="standard"
          fullWidth
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          inputRef={inputRef}       
          onKeyDown={onKeyDown}     
          InputProps={{
            disableUnderline: true,
            sx: {
              color: "#585858",
              fontSize: "0.95rem",
            },
          }}
          error={error}
        />
      </Box>
      {helperText && (
        <Typography
          sx={{
            mt: 0.5,
            fontSize: "0.8rem",
            color: error ? "#FF6B6B" : "#999",
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
