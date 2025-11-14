// src/controllers/empleadoController.js
import Empleado from "../models/Empleado.js";

/* =========================================================
   CREAR NUEVO EMPLEADO (verifica duplicados + guarda imagen)
   ========================================================= */
export const crearEmpleado = async (req, res) => {
  try {
    const { numeroDocumento, cuil } = req.body;

    // Verificar duplicados por número de documento o CUIL
    const duplicado = await Empleado.findOne({
      $or: [{ numeroDocumento }, { cuil }],
    });

    if (duplicado) {
      let mensaje = "Ya existe un empleado con ";
      if (duplicado.numeroDocumento === numeroDocumento && duplicado.cuil === cuil) {
        mensaje += "ese número de documento y CUIL.";
      } else if (duplicado.numeroDocumento === numeroDocumento) {
        mensaje += "ese número de documento.";
      } else {
        mensaje += "ese CUIL.";
      }
      return res.status(400).json({ error: mensaje });
    }

    // Buscar último legajo (orden lexicográfico numérico)
    const ultimoEmpleado = await Empleado.findOne().sort({ numeroLegajo: -1 });

    let nuevoLegajo = 1;
    if (ultimoEmpleado && ultimoEmpleado.numeroLegajo) {
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

    // No enviamos el buffer en la respuesta
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
   ========================================================= */
export const obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.find().sort({ numeroLegajo: 1 }).lean();

    const safeEmpleados = empleados.map((e) => {
      const copy = { ...e };
      if (copy.imagenPerfil) {
        delete copy.imagenPerfil.data;
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
   OBTENER EMPLEADO POR ID
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
   ACTUALIZAR EMPLEADO
   ========================================================= */
export const actualizarEmpleado = async (req, res) => {
  try {
    const { numeroDocumento, cuil } = req.body;

    // Evitar duplicados en actualización (excepto el propio empleado)
    const duplicado = await Empleado.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        { $or: [{ numeroDocumento }, { cuil }] },
      ],
    });

    if (duplicado) {
      let mensaje = "Ya existe otro empleado con ";
      if (duplicado.numeroDocumento === numeroDocumento && duplicado.cuil === cuil) {
        mensaje += "ese número de documento y CUIL.";
      } else if (duplicado.numeroDocumento === numeroDocumento) {
        mensaje += "ese número de documento.";
      } else {
        mensaje += "ese CUIL.";
      }
      return res.status(400).json({ error: mensaje });
    }

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
   DESACTIVAR EMPLEADO
   ========================================================= */
export const desactivarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;

    const empleado = await Empleado.findByIdAndUpdate(
      id,
      { estado: "inactivo" },
      { new: true }
    );

    if (!empleado) {
      return res.status(404).json({
        error: "Empleado no encontrado",
      });
    }

    res.json({
      message: "Empleado desactivado",
      empleado,
    });
  } catch (error) {
    console.error("Error al desactivar empleado:", error);
    res.status(500).json({
      error: "Error al desactivar empleado",
    });
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
