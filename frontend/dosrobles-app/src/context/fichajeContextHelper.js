import { useContext } from "react";
import { FichajeContext } from "./FichajeContext";

export const useFichaje = () => {
  const context = useContext(FichajeContext);
  if (!context) {
    throw new Error("useFichaje debe ser usado dentro de un FichajeProvider");
  }
  return context;
};
