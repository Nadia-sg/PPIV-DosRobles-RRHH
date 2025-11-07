import PDFDocument from "pdfkit";
import Nomina from "../models/Nomina.js";
import CalculoDetalle from "../models/CalculoDetalle.js";
import Empleado from "../models/Empleado.js";

// Generar PDF de recibo de sueldo
export const generarReciboPDF = async (req, res) => {
  try {
    const { nominaId } = req.params;

    // Obtener nómina
    const nomina = await Nomina.findById(nominaId).populate(
      "empleadoId",
      "nombre apellido legajo cuil categoria puesto fechaIngreso"
    );

    if (!nomina) {
      return res.status(404).json({
        success: false,
        message: "Nómina no encontrada",
      });
    }

    // Obtener detalles
    const detalles = await CalculoDetalle.find({ nominaId }).sort({ orden: 1 });

    // Crear documento PDF
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    // Headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=recibo_${nomina.empleadoId.legajo}_${nomina.periodo}.pdf`
    );

    doc.pipe(res);

    // Encabezado
    doc.fontSize(16).font("Helvetica-Bold").text("DOS ROBLES S.A.", {
      align: "center",
    });
    doc.fontSize(10).font("Helvetica").text("Recibo de Sueldo", { align: "center" });
    doc
      .fontSize(9)
      .text(`Período: ${nomina.periodo}`, { align: "center" })
      .moveDown(0.5);

    // Línea separadora
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    // Información del empleado
    doc.fontSize(10).font("Helvetica-Bold").text("DATOS DEL EMPLEADO");
    doc.fontSize(9).font("Helvetica");
    doc.text(`Nombre: ${nomina.empleadoId.nombre} ${nomina.empleadoId.apellido}`);
    doc.text(`Legajo: ${nomina.empleadoId.legajo}`);
    doc.text(`CUIL: ${nomina.empleadoId.cuil}`);
    doc.text(`Puesto: ${nomina.empleadoId.puesto}`);
    doc.text(`Categoría: ${nomina.empleadoId.categoria}`);
    doc.moveDown(0.5);

    // Información del período
    doc.fontSize(10).font("Helvetica-Bold").text("INFORMACIÓN DEL PERÍODO");
    doc.fontSize(9).font("Helvetica");
    doc.text(`Días Trabajados: ${nomina.diasTrabajados}`);
    doc.text(`Días de Ausencia: ${nomina.diasAusencia}`);
    doc.text(`Horas Trabajadas: ${nomina.horasTrabajadas}`);
    doc.text(`Horas Extras: ${nomina.horasExtras}`);
    doc.moveDown(0.5);

    // Línea separadora
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    // Tabla de conceptos
    const detallesRemunerativos = detalles.filter(
      (d) => d.tipoConcepto === "remunerativo"
    );
    const detallesNoRemunerativos = detalles.filter(
      (d) => d.tipoConcepto === "no_remunerativo"
    );
    const detallesDeducciones = detalles.filter(
      (d) => d.tipoConcepto === "deduccion"
    );

    // Función auxiliar para escribir concepto y monto en la misma fila
    const escribirFila = (concepto, monto, isBold = false) => {
      const montoStr = `$ ${monto.toLocaleString("es-AR")}`;
      const posY = doc.y;
      const posXConcepto = 50;
      const posXMonto = 400;

      if (isBold) {
        doc.fontSize(9).font("Helvetica-Bold");
      } else {
        doc.fontSize(9).font("Helvetica");
      }

      // Escribir concepto y monto en la misma posición Y
      doc.text(concepto, posXConcepto, posY, { width: 330 });
      doc.fontSize(isBold ? 9 : 9).font(isBold ? "Helvetica-Bold" : "Helvetica")
        .text(montoStr, posXMonto, posY, { width: 110, align: "right" });

      doc.moveDown(0.5);
    };

    // Haberes
    if (detallesRemunerativos.length > 0) {
      doc.fontSize(10).font("Helvetica-Bold").text("HABERES");
      doc.moveDown(0.3);

      detallesRemunerativos.forEach((detalle) => {
        escribirFila(detalle.concepto, detalle.totalConcepto, false);
      });

      // Total Haberes
      doc.moveDown(0.1);
      escribirFila("Total Haberes", nomina.haberes.totalHaberes, true);
      doc.moveDown(0.2);
    }

    // No remunerativos
    if (detallesNoRemunerativos.length > 0) {
      doc.fontSize(10).font("Helvetica-Bold").text("NO REMUNERATIVO");
      doc.moveDown(0.3);

      detallesNoRemunerativos.forEach((detalle) => {
        escribirFila(detalle.concepto, detalle.totalConcepto, false);
      });
      doc.moveDown(0.2);
    }

    // Línea separadora
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.4);

    // Deducciones
    if (detallesDeducciones.length > 0) {
      doc.fontSize(10).font("Helvetica-Bold").text("DEDUCCIONES");
      doc.moveDown(0.3);

      detallesDeducciones.forEach((detalle) => {
        escribirFila(detalle.concepto, detalle.totalConcepto, false);
      });

      // Total Deducciones
      doc.moveDown(0.1);
      escribirFila("Total Deducciones", nomina.deducciones.totalDeducciones, true);
      doc.moveDown(0.2);
    }

    // Línea separadora
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.4);

    // Neto a cobrar - Destacado
    doc.fontSize(12).font("Helvetica-Bold");
    const netoPosY = doc.y;
    doc.text("NETO A COBRAR", 50, netoPosY, { width: 330 });
    doc.fontSize(12).font("Helvetica-Bold")
      .text(`$ ${nomina.totalNeto.toLocaleString("es-AR")}`, 400, netoPosY, { width: 110, align: "right" });
    doc.moveDown(0.8);

    // Pie de página
    doc.fontSize(8).font("Helvetica").text("Este recibo es un comprobante de pago.", {
      align: "center",
    });
    doc.text(`Generado el: ${new Date().toLocaleDateString("es-AR")}`, {
      align: "center",
    });
    doc.text(`Estado: ${nomina.estado.toUpperCase()}`, { align: "center" });

    if (nomina.aprobadoPor) {
      doc.text(`Aprobado por: Sistema RRHH Dos Robles`, { align: "center" });
    }

    // Finalizar documento
    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar PDF",
      error: error.message,
    });
  }
};

// Generar PDFs masivos para un período
export const generarRecibosMultiples = async (req, res) => {
  try {
    const { periodo } = req.body;

    if (!periodo) {
      return res.status(400).json({
        success: false,
        message: "Período requerido",
      });
    }

    // Obtener todas las nóminas del período aprobadas
    const nominas = await Nomina.find({
      periodo,
      estado: "aprobado",
    }).populate("empleadoId", "legajo");

    if (nominas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No hay nóminas aprobadas para este período",
      });
    }

    res.json({
      success: true,
      message: `${nominas.length} recibos disponibles para descargar`,
      data: nominas.map((n) => ({
        nominaId: n._id,
        empleado: n.empleadoId.legajo,
        periodo: n.periodo,
        neto: n.totalNeto,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener nóminas",
      error: error.message,
    });
  }
};
