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
  headerColor = "#817A6F",
  headerTextColor = "#FFFFFF",
  rowBgColor = "#FAFAFA",
  textColor = "#585858",
  hoverColor = "#F0EFEF",
  onEdit,
  onDelete,
  maxHeight,
}) => {
  const showActions = onEdit || onDelete;

  

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    overflowY: "auto",
    maxHeight: maxHeight || "420px",    
      }}
    >
      <Table
        stickyHeader                   
        sx={{
          borderCollapse: "separate",
          borderSpacing: "0 8px",
          minWidth: "100%",
        }}
      >
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
                  position: "sticky",    
                  top: 0,
                  zIndex: 1,
                  backgroundColor: headerColor, 
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
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: headerColor,
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
                const key = Object.keys(row)[i];
                const cellValue = row[key];
                return (
                  <TableCell
                    key={i}
                    sx={{
                      color: textColor,
                      borderBottom: "none",
                      fontSize: "0.95rem",
                    }}
                  >
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
