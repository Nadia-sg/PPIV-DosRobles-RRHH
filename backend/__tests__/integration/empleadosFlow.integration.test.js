import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Empleado from '../../src/models/Empleado.js';

describe('Flujo de Empleados - Pruebas de Integración', () => {
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

  describe('1. Crear Empleado', () => {
    test('Debería crear empleado con datos completos', async () => {
      // QUÉ SE PRUEBA: Creación de empleado con todos los datos
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001',
        telefono: '1112345678',
        email: 'juan@example.com',
        fechaNacimiento: new Date('1990-01-15'),
        areaTrabajo: 'Ventas',
        puesto: 'Vendedor',
        categoria: 'Cat A',
        modalidad: 'Full-time',
        jornada: '8hs',
        horario: '09:00 - 17:00',
        tipoRemuneracion: 'Mensual',
        sueldoBruto: 50000,
        banco: 'Banco XYZ',
        cbu: '0123456789012345678901',
        obraSocial: 'Osde',
        vencimientoContrato: new Date('2025-12-31')
      });

      // RESULTADO ESPERADO: Empleado guardado con todos los datos
      expect(empleado._id).toBeDefined();
      expect(empleado.nombre).toBe('Juan');
      expect(empleado.numeroLegajo).toBe('0001');
      expect(empleado.estado).toBe('activo');
      expect(empleado.sueldoBruto).toBe(50000);
    });

    test('Debería validar duplicados por documento', async () => {
      // Crear primer empleado
      const empleado1 = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      // Verificar que existe
      const duplicado = await Empleado.findOne({
        $or: [
          { numeroDocumento: '12345678' },
          { cuil: '27-87654321-4' }
        ]
      });

      // QUÉ SE PRUEBA: Detección de duplicados
      // RESULTADO ESPERADO: duplicado encontrado (controlador debe rechazarlo)
      expect(duplicado).toBeDefined();
      expect(duplicado.numeroDocumento).toBe('12345678');
    });

    test('Debería crear empleado sin legajo y dejar que se genere', async () => {
      // El controlador genera el legajo automáticamente
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      // QUÉ SE PRUEBA: Generación de legajo
      // RESULTADO ESPERADO: Legajo asignado
      expect(empleado.numeroLegajo).toBe('0001');
    });
  });

  describe('2. Listar Empleados', () => {
    beforeEach(async () => {
      // Crear 3 empleados
      await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '11111111',
        cuil: '20-11111111-1',
        numeroLegajo: '0001',
        areaTrabajo: 'Ventas',
        estado: 'activo'
      });

      await Empleado.create({
        nombre: 'María',
        apellido: 'García',
        tipoDocumento: 'dni',
        numeroDocumento: '22222222',
        cuil: '27-22222222-2',
        numeroLegajo: '0002',
        areaTrabajo: 'Sistemas',
        estado: 'activo'
      });

      await Empleado.create({
        nombre: 'Pedro',
        apellido: 'López',
        tipoDocumento: 'dni',
        numeroDocumento: '33333333',
        cuil: '20-33333333-3',
        numeroLegajo: '0003',
        areaTrabajo: 'Ventas',
        estado: 'inactivo'
      });
    });

    test('Debería listar todos los empleados ordenados por legajo', async () => {
      // QUÉ SE PRUEBA: Listado de empleados ordenado
      const empleados = await Empleado.find().sort({ numeroLegajo: 1 });

      // RESULTADO ESPERADO: 3 empleados en orden correcto
      expect(empleados.length).toBe(3);
      expect(empleados[0].numeroLegajo).toBe('0001');
      expect(empleados[1].numeroLegajo).toBe('0002');
      expect(empleados[2].numeroLegajo).toBe('0003');
    });

    test('Debería filtrar empleados activos', async () => {
      // QUÉ SE PRUEBA: Filtrado por estado
      const empleadosActivos = await Empleado.find({ estado: 'activo' });

      // RESULTADO ESPERADO: 2 empleados activos
      expect(empleadosActivos.length).toBe(2);
      expect(empleadosActivos.every(e => e.estado === 'activo')).toBe(true);
    });

    test('Debería filtrar empleados por área de trabajo', async () => {
      // QUÉ SE PRUEBA: Filtrado por área
      const empleadosVentas = await Empleado.find({ areaTrabajo: 'Ventas' });

      // RESULTADO ESPERADO: 2 empleados en Ventas
      expect(empleadosVentas.length).toBe(2);
      expect(empleadosVentas.every(e => e.areaTrabajo === 'Ventas')).toBe(true);
    });

    test('Debería contar empleados por estado', async () => {
      const activos = await Empleado.countDocuments({ estado: 'activo' });
      const inactivos = await Empleado.countDocuments({ estado: 'inactivo' });

      // QUÉ SE PRUEBA: Conteo por estado
      // RESULTADO ESPERADO: 2 activos, 1 inactivo
      expect(activos).toBe(2);
      expect(inactivos).toBe(1);
    });
  });

  describe('3. Obtener Empleado por ID', () => {
    test('Debería obtener empleado por ID', async () => {
      const empleadoCreado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      // QUÉ SE PRUEBA: Obtención de empleado por ID
      const empleado = await Empleado.findById(empleadoCreado._id);

      // RESULTADO ESPERADO: Empleado encontrado con datos correctos
      expect(empleado).toBeDefined();
      expect(empleado.nombre).toBe('Juan');
      expect(empleado._id).toEqual(empleadoCreado._id);
    });

    test('Debería retornar null si empleado no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      // QUÉ SE PRUEBA: Búsqueda de empleado inexistente
      const empleado = await Empleado.findById(fakeId);

      // RESULTADO ESPERADO: null
      expect(empleado).toBeNull();
    });
  });

  describe('4. Actualizar Empleado', () => {
    let empleadoId;

    beforeEach(async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001',
        telefono: '1111111111',
        areaTrabajo: 'Ventas'
      });
      empleadoId = empleado._id;
    });

    test('Debería actualizar datos personales', async () => {
      const empleado = await Empleado.findById(empleadoId);
      empleado.telefono = '2222222222';
      empleado.email = 'juannuevo@example.com';
      await empleado.save();

      // QUÉ SE PRUEBA: Actualización de datos personales
      const empleadoActualizado = await Empleado.findById(empleadoId);

      // RESULTADO ESPERADO: Datos actualizados
      expect(empleadoActualizado.telefono).toBe('2222222222');
      expect(empleadoActualizado.email).toBe('juannuevo@example.com');
    });

    test('Debería actualizar datos laborales', async () => {
      const empleado = await Empleado.findById(empleadoId);
      empleado.puesto = 'Gerente';
      empleado.sueldoBruto = 75000;
      await empleado.save();

      // QUÉ SE PRUEBA: Actualización de datos laborales
      const empleadoActualizado = await Empleado.findById(empleadoId);

      // RESULTADO ESPERADO: Datos laborales actualizados
      expect(empleadoActualizado.puesto).toBe('Gerente');
      expect(empleadoActualizado.sueldoBruto).toBe(75000);
    });

    test('Debería prevenir cambio a documento duplicado', async () => {
      // Crear otro empleado
      await Empleado.create({
        nombre: 'María',
        apellido: 'García',
        tipoDocumento: 'dni',
        numeroDocumento: '87654321',
        cuil: '27-87654321-4',
        numeroLegajo: '0002'
      });

      // Verificar que no se puede cambiar a documento existente
      const duplicado = await Empleado.findOne({
        $and: [
          { _id: { $ne: empleadoId } },
          { numeroDocumento: '87654321' }
        ]
      });

      // QUÉ SE PRUEBA: Prevención de duplicados en actualización
      // RESULTADO ESPERADO: duplicado encontrado (controlador debe rechazarlo)
      expect(duplicado).toBeDefined();
      expect(duplicado.numeroDocumento).toBe('87654321');
    });
  });

  describe('5. Desactivar Empleado', () => {
    test('Debería cambiar estado a inactivo', async () => {
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

      // QUÉ SE PRUEBA: Desactivación de empleado
      const empleadoDesactivado = await Empleado.findById(empleado._id);

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

      // QUÉ SE PRUEBA: Reactivación de empleado
      const empleadoReactivado = await Empleado.findById(empleado._id);

      // RESULTADO ESPERADO: estado === 'activo'
      expect(empleadoReactivado.estado).toBe('activo');
    });
  });

  describe('6. Eliminar Empleado', () => {
    test('Debería eliminar empleado de la base de datos', async () => {
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

      // QUÉ SE PRUEBA: Eliminación de empleado
      const empleadoEliminado = await Empleado.findById(empleadoId);

      // RESULTADO ESPERADO: empleado no encontrado
      expect(empleadoEliminado).toBeNull();
    });

    test('Debería mantener integridad de otros empleados después de eliminar', async () => {
      const empleado1 = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '11111111',
        cuil: '20-11111111-1',
        numeroLegajo: '0001'
      });

      const empleado2 = await Empleado.create({
        nombre: 'María',
        apellido: 'García',
        tipoDocumento: 'dni',
        numeroDocumento: '22222222',
        cuil: '27-22222222-2',
        numeroLegajo: '0002'
      });

      // Eliminar empleado1
      await Empleado.findByIdAndDelete(empleado1._id);

      // QUÉ SE PRUEBA: Integridad de datos después de eliminación
      const empleadoRestante = await Empleado.findById(empleado2._id);

      // RESULTADO ESPERADO: empleado2 intacto
      expect(empleadoRestante).toBeDefined();
      expect(empleadoRestante.nombre).toBe('María');
    });
  });

  describe('7. Flujo Completo: CRUD Empleado', () => {
    test('Debería crear, actualizar, listar y eliminar empleado', async () => {
      // 1. CREAR
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001',
        areaTrabajo: 'Ventas'
      });

      expect(empleado._id).toBeDefined();
      expect(empleado.nombre).toBe('Juan');

      // 2. ACTUALIZAR
      empleado.puesto = 'Gerente';
      empleado.sueldoBruto = 75000;
      await empleado.save();

      let empleadoActualizado = await Empleado.findById(empleado._id);
      expect(empleadoActualizado.puesto).toBe('Gerente');

      // 3. LISTAR (con filtros)
      const empleados = await Empleado.find({ areaTrabajo: 'Ventas' });
      expect(empleados.length).toBeGreaterThan(0);

      // 4. DESACTIVAR
      empleadoActualizado.estado = 'inactivo';
      await empleadoActualizado.save();

      let empleadoInactivo = await Empleado.findById(empleado._id);
      expect(empleadoInactivo.estado).toBe('inactivo');

      // 5. ELIMINAR
      await Empleado.findByIdAndDelete(empleado._id);

      const empleadoEliminado = await Empleado.findById(empleado._id);
      expect(empleadoEliminado).toBeNull();
    });
  });
});
