import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CustomTable = ({
  columns = [],
  rows = [],
  columnMapping = {}, // Mapeo de nombres de columna a propiedades del objeto
  headerColor = "#817A6F",
  headerTextColor = "#FFFFFF",
  rowBgColor = "#FAFAFA",
  textColor = "#585858",
  hoverColor = "#F0EFEF",
  onEdit,
  onDelete,
}) => {
  const showActions = onEdit || onDelete;

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <Table sx={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
        {/* Cabecera */}
        <TableHead>
          <TableRow sx={{ backgroundColor: headerColor }}>
            {columns.map((col, i) => (
              <TableCell
                key={i}
                sx={{
                  color: headerTextColor,
                  fontWeight: "medium",
                  borderBottom: "none",
                  fontSize: "0.95rem",
                }}
              >
                {col}
              </TableCell>
            ))}
            {showActions && (
              <TableCell
                sx={{
                  color: headerTextColor,
                  fontWeight: "medium",
                  borderBottom: "none",
                }}
              >
                Acciones
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        {/* Filas */}
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{
                backgroundColor: rowBgColor,
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                cursor: "default",
                "&:hover": {
                  backgroundColor: hoverColor,
                  transform: "scale(1.01)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                },
              }}
            >
              {columns.map((col, i) => {
                // Usar columnMapping si está disponible, sino intentar matching automático
                let cellValue = null;

                if (columnMapping[col]) {
                  // Si hay un mapeo explícito, usarlo
                  cellValue = row[columnMapping[col]];
                } else {
                  // Intentar matching automático case-insensitive
                  for (const key of Object.keys(row)) {
                    if (key.toLowerCase() === col.toLowerCase().replace(/\s+/g, "").replace(/\./g, "")) {
                      cellValue = row[key];
                      break;
                    }
                  }

                  // Si no encontró, usar el índice como fallback
                  if (cellValue === null && i < Object.keys(row).length) {
                    const rowKeys = Object.keys(row);
                    cellValue = row[rowKeys[i]];
                  }
                }

                return (
                  <TableCell
                    key={i}
                    sx={{
                      color: textColor,
                      borderBottom: "none",
                      fontSize: "0.95rem",
                    }}
                  >
                    {/* Soporta texto o JSX */}
                    {React.isValidElement(cellValue)
                      ? cellValue
                      : cellValue ?? "-"}
                  </TableCell>
                );
              })}

              {showActions && (
                <TableCell sx={{ borderBottom: "none" }}>
                  {onEdit && (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(row)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(row)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
