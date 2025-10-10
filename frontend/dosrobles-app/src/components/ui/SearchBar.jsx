import { styled } from "@mui/material/styles";
import { InputBase, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
  padding: "0.5rem 1rem",
  color: "#808080",
  width: "100%",
  maxWidth: 400, 
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  color: "#808080",
  flex: 1,
  "& input::placeholder": {
    color: "#808080",
    opacity: 1,
  },
}));

export const SearchBar = ({ placeholder = "Buscar..." }) => {
  return (
    <SearchContainer>
      <StyledInput placeholder={placeholder} />
      <SearchIcon />
    </SearchContainer>
  );
};
