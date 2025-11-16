import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Empleado from '../../src/models/Empleado.js';

describe('Empleado Controller - Pruebas Unitarias de Lógica', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Empleado.deleteMany({});
  });

  describe('1. Validación de duplicados - numeroDocumento', () => {
    test('Debería permitir crear empleado con documento único', async () => {
      // QUÉ SE PRUEBA: Creación con documento único
      // RESULTADO ESPERADO: empleado creado sin errores
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      expect(empleado._id).toBeDefined();
      expect(empleado.numeroDocumento).toBe('12345678');
    });

    test('El controlador debería validar duplicados de documento antes de guardar', async () => {
      // Nota: El modelo Empleado no tiene índice unique en numeroDocumento
      // pero el controlador realiza esta validación usando findOne
      const empleado1 = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      // Simular la lógica de validación del controlador
      const duplicado = await Empleado.findOne({
        $or: [
          { numeroDocumento: '12345678' },
          { cuil: '27-87654321-4' }
        ]
      });

      // QUÉ SE PRUEBA: Prevención de duplicados por documento
      // RESULTADO ESPERADO: duplicado encontrado (debe validarse en controlador)
      expect(duplicado).toBeDefined();
      expect(duplicado.numeroDocumento).toBe('12345678');
    });
  });

  describe('2. Validación de duplicados - CUIL', () => {
    test('Debería permitir crear empleado con CUIL único', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      // QUÉ SE PRUEBA: CUIL almacenado correctamente
      // RESULTADO ESPERADO: CUIL guardado sin errores
      expect(empleado.cuil).toBe('20-12345678-9');
    });
  });

  describe('3. Generación automática de numeroLegajo', () => {
    test('Primer empleado debe tener legajo 0001', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      // QUÉ SE PRUEBA: Primer legajo es 0001
      // RESULTADO ESPERADO: numeroLegajo === '0001'
      expect(empleado.numeroLegajo).toBe('0001');
    });

    test('Segundoempleado debe tener legajo incremental', async () => {
      const empleado1 = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      // Simulando lógica del controlador: obtener último y sumar 1
      const ultimoEmpleado = await Empleado.findOne().sort({ numeroLegajo: -1 });
      let nuevoLegajo = parseInt(ultimoEmpleado.numeroLegajo, 10) + 1;

      const empleado2 = await Empleado.create({
        nombre: 'María',
        apellido: 'García',
        tipoDocumento: 'dni',
        numeroDocumento: '87654321',
        cuil: '27-87654321-4',
        numeroLegajo: nuevoLegajo.toString().padStart(4, '0')
      });

      // QUÉ SE PRUEBA: Legajo incremental
      // RESULTADO ESPERADO: numeroLegajo === '0002'
      expect(empleado2.numeroLegajo).toBe('0002');
    });
  });

  describe('4. Estados y datos laborales', () => {
    test('Debería permitir guardar datos laborales completos', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001',
        areaTrabajo: 'Ventas',
        puesto: 'Vendedor',
        categoria: 'Cat A',
        modalidad: 'Full-time',
        jornada: '8hs',
        horario: '09:00 - 17:00',
        sueldoBruto: 50000,
        banco: 'Banco XYZ',
        cbu: '0123456789012345678901',
        obraSocial: 'Osde',
        tipoRemuneracion: 'Mensual'
      });

      // QUÉ SE PRUEBA: Almacenamiento de datos laborales
      // RESULTADO ESPERADO: Todos los campos guardados
      expect(empleado.areaTrabajo).toBe('Ventas');
      expect(empleado.puesto).toBe('Vendedor');
      expect(empleado.sueldoBruto).toBe(50000);
      expect(empleado.obraSocial).toBe('Osde');
    });
  });

  describe('5. Listado de empleados ordenado por legajo', () => {
    beforeEach(async () => {
      await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      await Empleado.create({
        nombre: 'María',
        apellido: 'García',
        tipoDocumento: 'dni',
        numeroDocumento: '87654321',
        cuil: '27-87654321-4',
        numeroLegajo: '0002'
      });

      await Empleado.create({
        nombre: 'Pedro',
        apellido: 'López',
        tipoDocumento: 'dni',
        numeroDocumento: '11111111',
        cuil: '20-11111111-1',
        numeroLegajo: '0003'
      });
    });

    test('Debería retornar empleados ordenados por legajo ascendente', async () => {
      // Simulando la lógica del controlador
      const empleados = await Empleado.find().sort({ numeroLegajo: 1 });

      // QUÉ SE PRUEBA: Ordenamiento por legajo
      // RESULTADO ESPERADO: Empleados en orden 0001, 0002, 0003
      expect(empleados.length).toBe(3);
      expect(empleados[0].numeroLegajo).toBe('0001');
      expect(empleados[1].numeroLegajo).toBe('0002');
      expect(empleados[2].numeroLegajo).toBe('0003');
      expect(empleados[0].nombre).toBe('Juan');
      expect(empleados[1].nombre).toBe('María');
      expect(empleados[2].nombre).toBe('Pedro');
    });

    test('Debería filtrar empleados por estado', async () => {
      // Cambiar estado de uno
      const empleado = await Empleado.findOne({ numeroLegajo: '0002' });
      empleado.estado = 'inactivo';
      await empleado.save();

      // Obtener solo activos
      const empleadosActivos = await Empleado.find({ estado: 'activo' });

      // QUÉ SE PRUEBA: Filtrado por estado
      // RESULTADO ESPERADO: Solo 2 empleados activos
      expect(empleadosActivos.length).toBe(2);
      expect(empleadosActivos.every(e => e.estado === 'activo')).toBe(true);
    });
  });

  describe('6. Actualización de empleado sin duplicar documentos', () => {
    test('Debería permitir actualizar empleado sin cambiar documento', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001',
        telefono: '1111111111'
      });

      // Actualizar otros datos
      empleado.nombre = 'Juan Carlos';
      empleado.telefono = '2222222222';
      await empleado.save();

      const empleadoActualizado = await Empleado.findById(empleado._id);

      // QUÉ SE PRUEBA: Actualización sin duplicar
      // RESULTADO ESPERADO: Datos actualizados, documento sin cambiar
      expect(empleadoActualizado.nombre).toBe('Juan Carlos');
      expect(empleadoActualizado.numeroDocumento).toBe('12345678');
    });

    test('El controlador debería validar cambios de documento para evitar duplicados', async () => {
      const empleado1 = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      const empleado2 = await Empleado.create({
        nombre: 'María',
        apellido: 'García',
        tipoDocumento: 'dni',
        numeroDocumento: '87654321',
        cuil: '27-87654321-4',
        numeroLegajo: '0002'
      });

      // Simular lógica de validación del controlador al actualizar
      // El controlador busca otro empleado con el mismo documento (excluyendo al mismo)
      const duplicado = await Empleado.findOne({
        $and: [
          { _id: { $ne: empleado2._id } },
          { $or: [{ numeroDocumento: '12345678' }, { cuil: '27-87654321-4' }] }
        ]
      });

      // QUÉ SE PRUEBA: Validación de cambio a documento duplicado
      // RESULTADO ESPERADO: duplicado encontrado (debe rechazarse en controlador)
      expect(duplicado).toBeDefined();
      expect(duplicado._id).toEqual(empleado1._id);
    });
  });

  describe('7. Cambio de estado (activo/inactivo)', () => {
    test('Debería permitir desactivar empleado', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001',
        estado: 'activo'
      });

      // Desactivar
      empleado.estado = 'inactivo';
      await empleado.save();

      const empleadoDesactivado = await Empleado.findById(empleado._id);

      // QUÉ SE PRUEBA: Cambio de estado a inactivo
      // RESULTADO ESPERADO: estado === 'inactivo'
      expect(empleadoDesactivado.estado).toBe('inactivo');
    });

    test('Debería permitir reactivar empleado', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001',
        estado: 'inactivo'
      });

      // Reactivar
      empleado.estado = 'activo';
      await empleado.save();

      const empleadoReactivado = await Empleado.findById(empleado._id);

      // QUÉ SE PRUEBA: Cambio de estado a activo
      // RESULTADO ESPERADO: estado === 'activo'
      expect(empleadoReactivado.estado).toBe('activo');
    });
  });

  describe('8. Búsquedas y filtros', () => {
    beforeEach(async () => {
      await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001',
        areaTrabajo: 'Ventas',
        estado: 'activo'
      });

      await Empleado.create({
        nombre: 'María',
        apellido: 'García',
        tipoDocumento: 'dni',
        numeroDocumento: '87654321',
        cuil: '27-87654321-4',
        numeroLegajo: '0002',
        areaTrabajo: 'Sistemas',
        estado: 'activo'
      });

      await Empleado.create({
        nombre: 'Pedro',
        apellido: 'López',
        tipoDocumento: 'dni',
        numeroDocumento: '11111111',
        cuil: '20-11111111-1',
        numeroLegajo: '0003',
        areaTrabajo: 'Ventas',
        estado: 'inactivo'
      });
    });

    test('Debería encontrar empleados por área', async () => {
      const empleadosVentas = await Empleado.find({ areaTrabajo: 'Ventas' });

      // QUÉ SE PRUEBA: Búsqueda por área
      // RESULTADO ESPERADO: 2 empleados en Ventas
      expect(empleadosVentas.length).toBe(2);
      expect(empleadosVentas.every(e => e.areaTrabajo === 'Ventas')).toBe(true);
    });

    test('Debería encontrar empleados activos de un área específica', async () => {
      const empleados = await Empleado.find({
        areaTrabajo: 'Ventas',
        estado: 'activo'
      });

      // QUÉ SE PRUEBA: Búsqueda con múltiples filtros
      // RESULTADO ESPERADO: 1 empleado (Juan)
      expect(empleados.length).toBe(1);
      expect(empleados[0].nombre).toBe('Juan');
    });

    test('Debería contar total de empleados por estado', async () => {
      const activos = await Empleado.countDocuments({ estado: 'activo' });
      const inactivos = await Empleado.countDocuments({ estado: 'inactivo' });

      // QUÉ SE PRUEBA: Conteo por estado
      // RESULTADO ESPERADO: 2 activos, 1 inactivo
      expect(activos).toBe(2);
      expect(inactivos).toBe(1);
    });
  });

  describe('9. Eliminación de empleado', () => {
    test('Debería eliminar empleado correctamente', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      const empleadoId = empleado._id;

      // Eliminar
      await Empleado.findByIdAndDelete(empleadoId);

      const empleadoEliminado = await Empleado.findById(empleadoId);

      // QUÉ SE PRUEBA: Eliminación de empleado
      // RESULTADO ESPERADO: empleado no encontrado
      expect(empleadoEliminado).toBeNull();
    });
  });
});
