import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Empleado from '../../src/models/Empleado.js';

describe('Empleado Model - Pruebas Unitarias', () => {
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

  describe('1. Validación de campos requeridos', () => {
    test('Debería fallar si no se proporciona nombre', async () => {
      const empleado = new Empleado({
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      try {
        await empleado.save();
        throw new Error('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('nombre');
      }
    });

    test('Debería fallar si no se proporciona apellido', async () => {
      const empleado = new Empleado({
        nombre: 'Juan',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      try {
        await empleado.save();
        throw new Error('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('apellido');
      }
    });

    test('Debería fallar si no se proporciona tipoDocumento', async () => {
      const empleado = new Empleado({
        nombre: 'Juan',
        apellido: 'Pérez',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      try {
        await empleado.save();
        throw new Error('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('tipoDocumento');
      }
    });

    test('Debería fallar si no se proporciona numeroDocumento', async () => {
      const empleado = new Empleado({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        cuil: '20-12345678-9'
      });

      try {
        await empleado.save();
        throw new Error('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('numeroDocumento');
      }
    });

    test('Debería fallar si no se proporciona cuil', async () => {
      const empleado = new Empleado({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678'
      });

      try {
        await empleado.save();
        throw new Error('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).toContain('cuil');
      }
    });
  });

  describe('2. Validación de enum para tipoDocumento', () => {
    test('Debería permitir tipoDocumento "dni"', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      // QUÉ SE PRUEBA: Validación de tipoDocumento = "dni"
      // RESULTADO ESPERADO: tipoDocumento === "dni"
      expect(empleado.tipoDocumento).toBe('dni');
    });

    test('Debería permitir tipoDocumento "pasaporte"', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'pasaporte',
        numeroDocumento: 'ABC123456',
        cuil: '20-12345678-9'
      });

      // QUÉ SE PRUEBA: Validación de tipoDocumento = "pasaporte"
      // RESULTADO ESPERADO: tipoDocumento === "pasaporte"
      expect(empleado.tipoDocumento).toBe('pasaporte');
    });

    test('Debería fallar si tipoDocumento es inválido', async () => {
      const empleado = new Empleado({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'libreta_civica',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      try {
        await empleado.save();
        throw new Error('Debería haber falado por tipoDocumento inválido');
      } catch (error) {
        expect(error.message).toContain('tipoDocumento');
      }
    });
  });

  describe('3. Valores por defecto', () => {
    test('Debería asignar estado "activo" por defecto', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      // QUÉ SE PRUEBA: Valor por defecto de estado
      // RESULTADO ESPERADO: estado === "activo"
      expect(empleado.estado).toBe('activo');
    });

    test('Debería asignar fechaAlta automáticamente', async () => {
      const ahora = new Date();
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      // QUÉ SE PRUEBA: Asignación automática de fechaAlta
      // RESULTADO ESPERADO: fechaAlta cerca del momento de creación
      expect(empleado.fechaAlta).toBeDefined();
      expect(empleado.fechaAlta.getTime()).toBeGreaterThanOrEqual(ahora.getTime() - 1000);
    });
  });

  describe('4. Validación de enum para estado', () => {
    test('Debería permitir estado "activo"', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        estado: 'activo'
      });

      // QUÉ SE PRUEBA: Asignación de estado "activo"
      // RESULTADO ESPERADO: estado === "activo"
      expect(empleado.estado).toBe('activo');
    });

    test('Debería permitir estado "inactivo"', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        estado: 'inactivo'
      });

      // QUÉ SE PRUEBA: Asignación de estado "inactivo"
      // RESULTADO ESPERADO: estado === "inactivo"
      expect(empleado.estado).toBe('inactivo');
    });

    test('Debería fallar si estado es inválido', async () => {
      const empleado = new Empleado({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        estado: 'suspendido'
      });

      try {
        await empleado.save();
        throw new Error('Debería haber fallado por estado inválido');
      } catch (error) {
        expect(error.message).toContain('estado');
      }
    });
  });

  describe('5. Unicidad de numeroLegajo', () => {
    test('Debería fallar si numeroLegajo está duplicado', async () => {
      await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      const empleado2 = new Empleado({
        nombre: 'María',
        apellido: 'García',
        tipoDocumento: 'dni',
        numeroDocumento: '87654321',
        cuil: '27-87654321-4',
        numeroLegajo: '0001'
      });

      try {
        await empleado2.save();
        throw new Error('Debería haber fallado por numeroLegajo duplicado');
      } catch (error) {
        // QUÉ SE PRUEBA: Validación de unicidad de numeroLegajo
        // RESULTADO ESPERADO: Error con "duplicate key"
        expect(error.code).toBe(11000);
        expect(error.keyPattern).toHaveProperty('numeroLegajo');
      }
    });
  });

  describe('6. Campos opcionales', () => {
    test('Debería permitir crear empleado con solo campos requeridos', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      // QUÉ SE PRUEBA: Creación con solo campos requeridos
      // RESULTADO ESPERADO: empleado guardado sin errores
      expect(empleado._id).toBeDefined();
      expect(empleado.nombre).toBe('Juan');
      expect(empleado.telefono).toBeUndefined();
      expect(empleado.email).toBeUndefined();
    });

    test('Debería permitir añadir campos opcionales', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        telefono: '1112345678',
        email: 'juan@example.com',
        areaTrabajo: 'Ventas',
        puesto: 'Vendedor',
        sueldoBruto: 50000
      });

      // QUÉ SE PRUEBA: Adición de campos opcionales
      // RESULTADO ESPERADO: campos guardados correctamente
      expect(empleado.telefono).toBe('1112345678');
      expect(empleado.email).toBe('juan@example.com');
      expect(empleado.areaTrabajo).toBe('Ventas');
      expect(empleado.sueldoBruto).toBe(50000);
    });
  });

  describe('7. Referencia a Usuario', () => {
    test('Debería permitir referenciar un usuario', async () => {
      const usuarioId = new mongoose.Types.ObjectId();

      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        usuario: usuarioId
      });

      // QUÉ SE PRUEBA: Campo de referencia a Usuario
      // RESULTADO ESPERADO: usuario se asigna correctamente
      expect(empleado.usuario).toEqual(usuarioId);
    });

    test('Debería permitir que usuario sea undefined', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      // QUÉ SE PRUEBA: Usuario puede ser undefined (optional)
      // RESULTADO ESPERADO: usuario === undefined
      expect(empleado.usuario).toBeUndefined();
    });
  });

  describe('8. Timestamps', () => {
    test('Debería crear createdAt y updatedAt automáticamente', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      // QUÉ SE PRUEBA: Timestamps automáticos (createdAt, updatedAt)
      // RESULTADO ESPERADO: Ambos campos definidos
      expect(empleado.createdAt).toBeDefined();
      expect(empleado.updatedAt).toBeDefined();
      expect(empleado.createdAt).toBeInstanceOf(Date);
      expect(empleado.updatedAt).toBeInstanceOf(Date);
    });

    test('Debería actualizar updatedAt al modificar documento', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      const updatedAtOriginal = empleado.updatedAt;

      // Esperar un poco para que el timestamp sea diferente
      await new Promise(resolve => setTimeout(resolve, 100));

      empleado.telefono = '1112345678';
      await empleado.save();

      // QUÉ SE PRUEBA: updatedAt se actualiza al guardar cambios
      // RESULTADO ESPERADO: updatedAt > updatedAtOriginal
      expect(empleado.updatedAt.getTime()).toBeGreaterThan(updatedAtOriginal.getTime());
    });
  });

  describe('9. Encontrar empleado por ID', () => {
    test('Debería recuperar empleado creado desde la BD', async () => {
      const empleadoCreado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      const empleadoRecuperado = await Empleado.findById(empleadoCreado._id);

      // QUÉ SE PRUEBA: Recuperación de empleado desde BD
      // RESULTADO ESPERADO: empleado encontrado con mismos datos
      expect(empleadoRecuperado.nombre).toBe('Juan');
      expect(empleadoRecuperado.apellido).toBe('Pérez');
      expect(empleadoRecuperado._id).toEqual(empleadoCreado._id);
    });
  });

  describe('10. Actualización de empleado', () => {
    test('Debería permitir actualizar el estado', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        estado: 'activo'
      });

      empleado.estado = 'inactivo';
      await empleado.save();

      const empleadoActualizado = await Empleado.findById(empleado._id);

      // QUÉ SE PRUEBA: Actualización de estado
      // RESULTADO ESPERADO: estado actualizado a inactivo
      expect(empleadoActualizado.estado).toBe('inactivo');
    });

    test('Debería permitir actualizar datos personales', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      empleado.telefono = '1112345678';
      empleado.email = 'juan@example.com';
      empleado.areaTrabajo = 'Sistemas';
      await empleado.save();

      const empleadoActualizado = await Empleado.findById(empleado._id);

      // QUÉ SE PRUEBA: Actualización de múltiples campos
      // RESULTADO ESPERADO: Todos los campos actualizados
      expect(empleadoActualizado.telefono).toBe('1112345678');
      expect(empleadoActualizado.email).toBe('juan@example.com');
      expect(empleadoActualizado.areaTrabajo).toBe('Sistemas');
    });
  });

  describe('11. Búsqueda por criterios', () => {
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
        estado: 'inactivo'
      });
    });

    test('Debería encontrar empleados por estado', async () => {
      const empleadosActivos = await Empleado.find({ estado: 'activo' });

      // QUÉ SE PRUEBA: Búsqueda por estado
      // RESULTADO ESPERADO: Solo empleados activos
      expect(empleadosActivos.length).toBe(1);
      expect(empleadosActivos[0].nombre).toBe('Juan');
    });

    test('Debería encontrar empleados por área', async () => {
      const empleadosSistemas = await Empleado.find({ areaTrabajo: 'Sistemas' });

      // QUÉ SE PRUEBA: Búsqueda por área de trabajo
      // RESULTADO ESPERADO: Solo empleados de Sistemas
      expect(empleadosSistemas.length).toBe(1);
      expect(empleadosSistemas[0].nombre).toBe('María');
    });

    test('Debería contar total de empleados', async () => {
      const total = await Empleado.countDocuments();

      // QUÉ SE PRUEBA: Conteo de documentos
      // RESULTADO ESPERADO: Total de 2 empleados
      expect(total).toBe(2);
    });
  });

  describe('12. Eliminar empleado', () => {
    test('Debería eliminar empleado de la BD', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9'
      });

      const empleadoId = empleado._id;

      await Empleado.findByIdAndDelete(empleadoId);

      const empleadoElim = await Empleado.findById(empleadoId);

      // QUÉ SE PRUEBA: Eliminación de empleado
      // RESULTADO ESPERADO: empleado no existe después de eliminar
      expect(empleadoElim).toBeNull();
    });
  });
});
