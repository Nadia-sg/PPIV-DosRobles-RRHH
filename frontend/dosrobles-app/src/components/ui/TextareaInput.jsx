import React from "react";
import { Box, Typography, TextField } from "@mui/material";

export default function TextareaInput({
  label,
  placeholder,
  value,
  onChange,
  helperText,
  error,
  maxLength = 200,
}) {
  const remaining = maxLength - (value?.length || 0);

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
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E1E1",
          borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          px: 1.5,
          py: 0.5,
        }}
      >
        <TextField
          variant="standard"
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) onChange(e);
          }}
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: error ? "#FF6B6B" : "#999",
          }}
        >
          {helperText}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: remaining <= 10 ? "#FF6B6B" : "#999",
          }}
        >
          {remaining}/{maxLength}
        </Typography>
      </Box>
    </Box>
  );
}
