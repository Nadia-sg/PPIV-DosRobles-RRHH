/* src/components/Sidebar.jsx */
import styles from "../styles/Sidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, forwardRef, useEffect } from "react";

// MUI Icons
import HomeIcon from "@mui/icons-material/Home";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import MenuIcon from "@mui/icons-material/Menu";

const Sidebar = forwardRef(({ className, onItemClick }, ref) => {
  const userName = "Mariana";
  const [openMenu, setOpenMenu] = useState(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const [active, setActive] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Mapear nombres de menú a rutas
  const routes = {
    Inicio: "/home",
    Bandeja: "/bandeja-entrada",
    "Mi Perfil": "/personal/perfil",
    Ausencias: "/licencias",
    "Mi Fichaje": "/fichaje/historial",
    "Mis Documentos": "/nomina/recibos",
    Empleados: "/empleados",
    "Control Horario": "/fichaje/historial",
    Nómina: "/nomina/calculo",
  };

  // Mantener activo según la URL actual
  useEffect(() => {
    const currentName = Object.keys(routes).find(
      (key) => routes[key] === location.pathname
    );
    if (currentName) setActive(currentName);
  }, [location.pathname]);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleSelect = (name) => {
    setActive(name);
    if (routes[name]) navigate(routes[name]);
    if (onItemClick) onItemClick(name);
  };

  return (
    <aside ref={ref} className={`${styles.sidebar} ${className}`}>
      <button
        className={styles.menuToggle}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menú"
      >
        <MenuIcon />
      </button>

      {menuOpen && (
        <>
          <div className={styles.profile}>
            
            <div className={styles.avatar}>MC</div>
            <p className={styles.greeting}>¡Buenos días, {userName}!</p>
          </div>

          <ul className={styles.menuList}>
            <li
              className={`${styles.menuItem} ${
                active === "Inicio" ? styles.active : ""
              }`}
              onClick={() => handleSelect("Inicio")}
            >
              <HomeIcon className={styles.icon} /> Inicio
            </li>

            <li
              className={`${styles.menuItem} ${
                active === "Bandeja" ? styles.active : ""
              }`}
              onClick={() => handleSelect("Bandeja")}
            >
              <MailOutlineIcon className={styles.icon} /> Bandeja de Entrada
            </li>

            <li className={styles.dropdown}>
              <div
                className={styles.dropdownHeader}
                onClick={() => toggleMenu("personal")}
              >
                <PersonOutlineIcon className={styles.icon} /> <span>Personal</span>
                {openMenu === "personal" ? (
                  <ArrowDropUpIcon className={styles.arrowIcon} />
                ) : (
                  <ArrowDropDownIcon className={styles.arrowIcon} />
                )}
              </div>

              {openMenu === "personal" && (
                <ul className={styles.submenu}>
                  {["Mi Perfil", "Ausencias", "Mi Fichaje", "Mis Documentos"].map(
                    (item) => (
                      <li
                        key={item}
                        className={active === item ? styles.activeSub : ""}
                        onClick={() => handleSelect(item)}
                      >
                        {item}
                      </li>
                    )
                  )}
                </ul>
              )}
            </li>

            <li className={styles.dropdown}>
              <div
                className={styles.dropdownHeader}
                onClick={() => toggleMenu("organizacion")}
              >
                <PeopleOutlineIcon className={styles.icon} /> <span>Organización</span>
                {openMenu === "organizacion" ? (
                  <ArrowDropUpIcon className={styles.arrowIcon} />
                ) : (
                  <ArrowDropDownIcon className={styles.arrowIcon} />
                )}
              </div>

              {openMenu === "organizacion" && (
                <ul className={styles.submenu}>
                  {["Empleados", "Control Horario", "Nómina"].map((item) => (
                    <li
                      key={item}
                      className={active === item ? styles.activeSub : ""}
                      onClick={() => handleSelect(item)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </>
      )}
    </aside>
  );
});

export default Sidebar;
