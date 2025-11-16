import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Usuario from '../../src/models/Usuario.js';

describe('Usuario Model - Pruebas Unitarias', () => {
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
    await Usuario.deleteMany({});
  });

  describe('1. Validación de campos requeridos', () => {
    test('Debería fallar si no se proporciona username', async () => {
      const usuario = new Usuario({
        password: 'contraseña123'
      });

      try {
        await usuario.save();
        throw new Error('Debería haber lanzado error de validación');
      } catch (error) {
        expect(error.message).toContain('username');
      }
    });

    test('Debería fallar si no se proporciona password', async () => {
      const usuario = new Usuario({
        username: 'testuser'
      });

      try {
        await usuario.save();
        throw new Error('Debería haber lanzado error de validación');
      } catch (error) {
        expect(error.message).toContain('password');
      }
    });
  });

  describe('2. Hashing de contraseña', () => {
    test('Debería hashear la contraseña antes de guardar', async () => {
      const passwordOriginal = 'contraseña123';
      const usuario = new Usuario({
        username: 'testuser',
        password: passwordOriginal
      });

      await usuario.save();

      // QUÉ SE PRUEBA: Que la contraseña guardada sea diferente a la original
      // RESULTADO ESPERADO: password guardado !== password original
      expect(usuario.password).not.toBe(passwordOriginal);

      // QUÉ SE PRUEBA: Que la contraseña esté hasheada (contiene caracteres bcrypt)
      // RESULTADO ESPERADO: Comienza con $2 (prefijo bcrypt)
      expect(usuario.password).toMatch(/^\$2[aby]\$/);
    });

    test('No debería re-hashear si la contraseña no cambió', async () => {
      const usuario = await Usuario.create({
        username: 'testuser',
        password: 'contraseña123'
      });

      const passwordHasheada = usuario.password;

      // Modificar otro campo sin tocar password
      usuario.role = 'admin';
      await usuario.save();

      // QUÉ SE PRUEBA: Que el hash permanece igual si no se modifica password
      // RESULTADO ESPERADO: password hash igual después de save
      expect(usuario.password).toBe(passwordHasheada);
    });
  });

  describe('3. Unicidad de username', () => {
    test('Debería fallar si username está duplicado', async () => {
      await Usuario.create({
        username: 'usuario_unico',
        password: 'contraseña123'
      });

      const usuario2 = new Usuario({
        username: 'usuario_unico',
        password: 'otra_contraseña'
      });

      try {
        await usuario2.save();
        throw new Error('Debería haber falado por username duplicado');
      } catch (error) {
        // QUÉ SE PRUEBA: Validación de unicidad de username
        // RESULTADO ESPERADO: Error con "duplicate key"
        expect(error.code).toBe(11000);
        expect(error.keyPattern).toHaveProperty('username');
      }
    });
  });

  describe('4. Valores por defecto', () => {
    test('Debería asignar role "empleado" por defecto', async () => {
      const usuario = await Usuario.create({
        username: 'testuser',
        password: 'contraseña123'
      });

      // QUÉ SE PRUEBA: Valor por defecto de role
      // RESULTADO ESPERADO: role === "empleado"
      expect(usuario.role).toBe('empleado');
    });

    test('Debería permitir asignar role "admin"', async () => {
      const usuario = await Usuario.create({
        username: 'testuser',
        password: 'contraseña123',
        role: 'admin'
      });

      // QUÉ SE PRUEBA: Asignación de rol admin
      // RESULTADO ESPERADO: role === "admin"
      expect(usuario.role).toBe('admin');
    });
  });

  describe('5. Validación de enum para role', () => {
    test('Debería fallar si role no es "admin" ni "empleado"', async () => {
      const usuario = new Usuario({
        username: 'testuser',
        password: 'contraseña123',
        role: 'superadmin' // valor inválido
      });

      try {
        await usuario.save();
        throw new Error('Debería haber fallado por role inválido');
      } catch (error) {
        // QUÉ SE PRUEBA: Validación de enum para role
        // RESULTADO ESPERADO: Error de validación
        expect(error.message).toContain('role');
      }
    });
  });

  describe('6. Método comparePassword', () => {
    test('Debería retornar true con contraseña correcta', async () => {
      const passwordOriginal = 'contraseña123';
      const usuario = await Usuario.create({
        username: 'testuser',
        password: passwordOriginal
      });

      // QUÉ SE PRUEBA: Método comparePassword con contraseña correcta
      // RESULTADO ESPERADO: true
      const esValida = await usuario.comparePassword(passwordOriginal);
      expect(esValida).toBe(true);
    });

    test('Debería retornar false con contraseña incorrecta', async () => {
      const usuario = await Usuario.create({
        username: 'testuser',
        password: 'contraseña123'
      });

      // QUÉ SE PRUEBA: Método comparePassword con contraseña incorrecta
      // RESULTADO ESPERADO: false
      const esValida = await usuario.comparePassword('contraseña_incorrecta');
      expect(esValida).toBe(false);
    });

    test('Debería retornar false con contraseña vacía', async () => {
      const usuario = await Usuario.create({
        username: 'testuser',
        password: 'contraseña123'
      });

      // QUÉ SE PRUEBA: comparePassword con string vacío
      // RESULTADO ESPERADO: false
      const esValida = await usuario.comparePassword('');
      expect(esValida).toBe(false);
    });
  });

  describe('7. Trim de username', () => {
    test('Debería eliminar espacios al inicio y final del username', async () => {
      const usuario = await Usuario.create({
        username: '  testuser  ',
        password: 'contraseña123'
      });

      // QUÉ SE PRUEBA: Trim automático de username
      // RESULTADO ESPERADO: username sin espacios
      expect(usuario.username).toBe('testuser');
    });
  });

  describe('8. Referencia a Empleado', () => {
    test('Debería permitir referenciar un empleado', async () => {
      // Crear un ObjectId de prueba
      const empleadoId = new mongoose.Types.ObjectId();

      const usuario = await Usuario.create({
        username: 'testuser',
        password: 'contraseña123',
        empleado: empleadoId
      });

      // QUÉ SE PRUEBA: Campo de referencia a Empleado
      // RESULTADO ESPERADO: empleado se asigna correctamente
      expect(usuario.empleado).toEqual(empleadoId);
    });

    test('Debería permitir que empleado sea null', async () => {
      const usuario = await Usuario.create({
        username: 'testuser',
        password: 'contraseña123'
      });

      // QUÉ SE PRUEBA: Empleado puede ser null (optional)
      // RESULTADO ESPERADO: empleado === undefined o null
      expect(usuario.empleado).toBeUndefined();
    });
  });

  describe('9. Encontrar usuario por ID', () => {
    test('Debería recuperar usuario creado desde la BD', async () => {
      const usuarioCreado = await Usuario.create({
        username: 'testuser',
        password: 'contraseña123'
      });

      const usuarioRecuperado = await Usuario.findById(usuarioCreado._id);

      // QUÉ SE PRUEBA: Recuperación de usuario desde BD
      // RESULTADO ESPERADO: usuario encontrado con mismos datos
      expect(usuarioRecuperado.username).toBe('testuser');
      expect(usuarioRecuperado._id).toEqual(usuarioCreado._id);
    });
  });

  describe('10. Actualización de usuario', () => {
    test('Debería permitir actualizar el rol', async () => {
      const usuario = await Usuario.create({
        username: 'testuser',
        password: 'contraseña123',
        role: 'empleado'
      });

      usuario.role = 'admin';
      await usuario.save();

      const usuarioActualizado = await Usuario.findById(usuario._id);

      // QUÉ SE PRUEBA: Actualización de rol
      // RESULTADO ESPERADO: role actualizado a admin
      expect(usuarioActualizado.role).toBe('admin');
    });

    test('Debería permitir actualizar la contraseña', async () => {
      const usuario = await Usuario.create({
        username: 'testuser',
        password: 'contraseña123'
      });

      const passwordAntigua = usuario.password;

      usuario.password = 'nueva_contraseña';
      await usuario.save();

      // QUÉ SE PRUEBA: Actualización y re-hashing de contraseña
      // RESULTADO ESPERADO: password hash diferente
      expect(usuario.password).not.toBe(passwordAntigua);
      const esValida = await usuario.comparePassword('nueva_contraseña');
      expect(esValida).toBe(true);
    });
  });
});
