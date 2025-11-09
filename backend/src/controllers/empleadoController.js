// src/controllers/empleadoController.js
import Empleado from "../models/Empleado.js";

/* =========================================================
   CREAR NUEVO EMPLEADO (almacena imagen en MongoDB como Buffer)
   ========================================================= */
export const crearEmpleado = async (req, res) => {
  try {
    // Buscar último legajo (orden lexicográfico numérico)
    const ultimoEmpleado = await Empleado.findOne().sort({ numeroLegajo: -1 });

    let nuevoLegajo = 1;
    if (ultimoEmpleado && ultimoEmpleado.numeroLegajo) {
      // parseInt por si guardaste como "0001"
      nuevoLegajo = parseInt(ultimoEmpleado.numeroLegajo, 10) + 1;
    }

    // Construir objeto para guardar
    const empleadoData = {
      ...req.body,
      numeroLegajo: nuevoLegajo.toString().padStart(4, "0"),
    };

    // Si multer guardó archivo en memoria => req.file.buffer disponible
    if (req.file) {
      empleadoData.imagenPerfil = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const nuevoEmpleado = new Empleado(empleadoData);
    await nuevoEmpleado.save();

    // No enviamos el buffer en la respuesta (para ahorrar payload)
    const empleadoResp = nuevoEmpleado.toObject();
    if (empleadoResp.imagenPerfil) {
      delete empleadoResp.imagenPerfil.data;
    }

    res.status(201).json({
      message: "Empleado registrado con éxito",
      empleado: empleadoResp,
    });
  } catch (error) {
    console.error("❌ Error al crear empleado:", error);
    res.status(500).json({
      error: "Error al registrar el empleado",
      detalle: error.message,
    });
  }
};

/* =========================================================
   OBTENER TODOS LOS EMPLEADOS
   - Devuelve lista sin el buffer de imagen (solo metadata)
   ========================================================= */
export const obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.find().sort({ numeroLegajo: 1 }).lean();

    // Para cada empleado, no incluimos data binaria en el JSON
    const safeEmpleados = empleados.map((e) => {
      const copy = { ...e };
      if (copy.imagenPerfil) {
        delete copy.imagenPerfil.data;
        // Podés opcionalmente devolver un flag para indicar que tiene imagen:
        copy.tieneImagen = true;
      } else {
        copy.tieneImagen = false;
      }
      return copy;
    });

    res.status(200).json(safeEmpleados);
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    res.status(500).json({ error: "Error al obtener empleados" });
  }
};

/* =========================================================
   OBTENER EMPLEADO POR ID (sin buffer)
   ========================================================= */
export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id).lean();
    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }
    if (empleado.imagenPerfil) delete empleado.imagenPerfil.data;
    res.status(200).json(empleado);
  } catch (error) {
    console.error("Error al obtener empleado por id:", error);
    res.status(500).json({ error: "Error al obtener empleado" });
  }
};

/* =========================================================
   SERVIR IMAGEN DE PERFIL
   GET /api/empleados/:id/imagen
   ========================================================= */
export const obtenerImagenPerfil = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id).select("imagenPerfil");
    if (!empleado || !empleado.imagenPerfil || !empleado.imagenPerfil.data) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    res.set("Content-Type", empleado.imagenPerfil.contentType);
    res.send(empleado.imagenPerfil.data);
  } catch (error) {
    console.error("Error al servir imagen:", error);
    res.status(500).json({ error: "Error al obtener imagen" });
  }
};

/* =========================================================
   ACTUALIZAR EMPLEADO (puede incluir nueva imagen)
   ========================================================= */
export const actualizarEmpleado = async (req, res) => {
  try {
    const dataActualizada = { ...req.body };

    if (req.file) {
      dataActualizada.imagenPerfil = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const empleado = await Empleado.findByIdAndUpdate(req.params.id, dataActualizada, { new: true }).lean();
    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    if (empleado.imagenPerfil) delete empleado.imagenPerfil.data;
    res.status(200).json({ message: "Empleado actualizado", empleado });
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ error: "Error al actualizar empleado" });
  }
};

/* =========================================================
   ELIMINAR EMPLEADO
   ========================================================= */
export const eliminarEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByIdAndDelete(req.params.id);
    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }
    res.status(200).json({ message: "Empleado eliminado" });
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).json({ error: "Error al eliminar empleado" });
  }
};

/* =========================================================
   OBTENER PRÓXIMO NÚMERO DE LEGAJO
   ========================================================= */
export const obtenerProximoLegajo = async (req, res) => {
  try {
    const ultimoEmpleado = await Empleado.findOne().sort({ numeroLegajo: -1 });
    let nuevoLegajo = 1;
    if (ultimoEmpleado && ultimoEmpleado.numeroLegajo) {
      nuevoLegajo = parseInt(ultimoEmpleado.numeroLegajo, 10) + 1;
    }
    res.status(200).json({ proximoLegajo: nuevoLegajo.toString().padStart(4, "0") });
  } catch (error) {
    console.error("Error al obtener próximo legajo:", error);
    res.status(500).json({ error: "Error al obtener el próximo número de legajo" });
  }
};