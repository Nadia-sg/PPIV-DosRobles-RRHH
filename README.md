# Sistema de Gestión de RR.HH. — Dos Robles

**Proyecto:** Sistema integral para la gestión de recursos humanos de la empresa *Dos Robles*.  
**Autor:** Pink Code.
**Materia:** PPIV - Técnicatura Superior en Desarrollo de Software.

Desarrollo de un sistema de gestión de recursos humanos para la empresa Dos Robles, 
que permita administrar la información de empleados, 
controlar la asistencia tanto en planta como en obras externas, 
y generar reportes automáticos relacionados con ausencias, horas extra y licencias.

---

## Funcionalidades principales

- Gestión de empleados y legajos digitales (registro, actualización y documentación).
- Fichaje presencial y remoto (registro de entradas/salidas).
- Solicitud y aprobación de licencias (flujo de aprobación y notificaciones).
- Cálculo básico de nómina y emisión/descarga de recibos en PDF.
- Roles y permisos (Admin, Empleado).

---

## Tecnologías

- **Frontend:** React (Vite), React Router, Axios, Material-UI (MUI), Context API  
- **Backend:** Node.js, Express.js, Mongoose (MongoDB), Multer 
- **BD:** MongoDB (Atlas)  
- **Autenticación:** JWT (JSON Web Tokens)  
- **Cifrado:** bcrypt  
- **Testing:** Jest, Supertest, MongoDB Memory Server
- **Control de versiones:** Git / GitHub 

---

## Estructura del proyecto
```
PPIV_DosRobles_RRHH/
├── backend/ → API REST (Node.js + Express + MongoDB Atlas)
│ ├── _test_
│ │ ├── controllers
│ │ ├── integration
│ │ ├── models
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ └── server.js
│ ├── uploads
│ │ ├──documentos
│ ├──.env
│ ├──jest.config.js
│ ├── package-lock.json
│ └── package.json
├── frontend/ → Aplicación web (React + Vite + MUI)
│ ├──dosrobles-app
│ │ ├── public
│ │ ├── src
│ │ │  ├── api
│ │ │  ├── assets
│ │ │  ├── components
│ │ │  ├── context
│ │ │  ├── hooks
│ │ │  ├── layouts
│ │ │  ├── pages
│ │ │  ├── services
│ │ │  ├── styles
│ │ │  ├── theme
│ │ │  ├── App.css
│ │ │  ├── App.jsx
│ │ │  ├── index.css
│ │ │  ├── main.jsx
│ │ ├── .gitignore
│ │ ├── eslint.config.js
│ │ ├── index.html
│ │ ├── package-lock.json
│ │ ├── package.json
│ │ ├── README.md
│ │ ├── vite.config.js
│ ├── package-lock.json
├── .gitignore
├── package-lock.json
├── package.json
└── README.md

```

---

## Requisitos previos

- **Node.js:** v16 o superior
- **npm:** v8 o superior (incluido con Node.js)
- **MongoDB:** v6 o superior (local o Atlas)
- **Git:** Para control de versiones
- **Navegador moderno**

---

## Instalación y ejecución

Seguir los pasos del Manual Técnico

---
