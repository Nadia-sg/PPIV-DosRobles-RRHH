import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import request from 'supertest';
import Usuario from '../../src/models/Usuario.js';
import Empleado from '../../src/models/Empleado.js';
import {
  loginUser,
  registrarUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  logout,
  verificarToken
} from '../../src/controllers/authController.js';

let mongoServer;
let app;

beforeAll(async () => {
  // Conectar a MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Crear aplicación Express para pruebas
  app = express();
  app.use(express.json());

  // Definir rutas
  app.post('/api/auth/login', loginUser);
  app.post('/api/auth/register', registrarUsuario);
  app.get('/api/auth', obtenerUsuarios);
  app.put('/api/auth/:id', actualizarUsuario);
  app.delete('/api/auth/:id', eliminarUsuario);
  app.post('/api/auth/logout', logout);
  app.get('/api/auth/verificar', verificarToken);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Usuario.deleteMany({});
  await Empleado.deleteMany({});
});

describe('Flujo de Usuarios - Pruebas de Integración', () => {
  describe('1. Registro de Usuario', () => {
    test('Debería registrar un nuevo usuario correctamente', async () => {
      // PASO 1: Crear empleado
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      // PASO 2: Registrar usuario para ese empleado
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          legajo: '0001',
          username: 'juanperez',
          password: 'password123',
          role: 'empleado'
        });

      // QUÉ SE PRUEBA: Registro exitoso de usuario
      // RESULTADO ESPERADO: status 201, usuario creado
      expect(response.status).toBe(201);
      expect(response.body.username).toBe('juanperez');
      expect(response.body.role).toBe('empleado');

      // Verificar que el usuario se vinculó al empleado
      const usuarioGuardado = await Usuario.findById(response.body._id);
      const empleadoActualizado = await Empleado.findById(empleado._id);
      expect(empleadoActualizado.usuario).toEqual(usuarioGuardado._id);
    });

    test('Debería fallar si empleado no existe', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          legajo: '9999',
          username: 'newuser',
          password: 'pass123'
        });

      // QUÉ SE PRUEBA: Validación de empleado inexistente
      // RESULTADO ESPERADO: status 404
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Empleado no encontrado');
    });

    test('Debería fallar si empleado ya tiene usuario', async () => {
      // Crear empleado con usuario
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      const usuario = await Usuario.create({
        username: 'juanperez',
        password: 'password123',
        empleado: empleado._id
      });

      empleado.usuario = usuario._id;
      await empleado.save();

      // Intentar registrar otro usuario para el mismo empleado
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          legajo: '0001',
          username: 'otro_usuario',
          password: 'pass123'
        });

      // QUÉ SE PRUEBA: Validación de empleado con usuario existente
      // RESULTADO ESPERADO: status 400
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('ya tiene un usuario');
    });
  });

  describe('2. Login de Usuario', () => {
    beforeEach(async () => {
      // Crear empleado y usuario para tests de login
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001',
        email: 'juan@example.com'
      });

      const usuario = await Usuario.create({
        username: 'juanperez',
        password: 'password123',
        role: 'empleado',
        empleado: empleado._id
      });

      empleado.usuario = usuario._id;
      await empleado.save();
    });

    test('Debería hacer login exitoso con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'juanperez',
          password: 'password123'
        });

      // QUÉ SE PRUEBA: Login exitoso
      // RESULTADO ESPERADO: status 200, token incluido
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login exitoso');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe('juanperez');
      expect(response.body.user.nombre).toBe('Juan');
      expect(response.body.user.email).toBe('juan@example.com');
    });

    test('Debería fallar con usuario inexistente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'inexistente',
          password: 'password123'
        });

      // QUÉ SE PRUEBA: Login con usuario inexistente
      // RESULTADO ESPERADO: status 400
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Usuario no encontrado');
    });

    test('Debería fallar con contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'juanperez',
          password: 'incorrecta'
        });

      // QUÉ SE PRUEBA: Login con contraseña incorrecta
      // RESULTADO ESPERADO: status 400
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Contraseña incorrecta');
    });
  });

  describe('3. Obtener Usuarios', () => {
    test('Debería retornar lista vacía si no hay usuarios', async () => {
      const response = await request(app).get('/api/auth');

      // QUÉ SE PRUEBA: Obtención de lista vacía de usuarios
      // RESULTADO ESPERADO: status 200, array vacío
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test('Debería retornar lista de usuarios creados', async () => {
      // Crear empleados y usuarios
      const empleado1 = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      const usuario1 = await Usuario.create({
        username: 'juanperez',
        password: 'password123',
        role: 'empleado',
        empleado: empleado1._id
      });

      const empleado2 = await Empleado.create({
        nombre: 'María',
        apellido: 'García',
        tipoDocumento: 'dni',
        numeroDocumento: '87654321',
        cuil: '27-87654321-4',
        numeroLegajo: '0002'
      });

      const usuario2 = await Usuario.create({
        username: 'mariagarcia',
        password: 'password123',
        role: 'admin',
        empleado: empleado2._id
      });

      const response = await request(app).get('/api/auth');

      // QUÉ SE PRUEBA: Obtención de lista de usuarios
      // RESULTADO ESPERADO: status 200, 2 usuarios
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].username).toBe('juanperez');
      expect(response.body[1].username).toBe('mariagarcia');
    });
  });

  describe('4. Actualizar Usuario', () => {
    let usuarioId;

    beforeEach(async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      const usuario = await Usuario.create({
        username: 'juanperez',
        password: 'password123',
        role: 'empleado',
        empleado: empleado._id
      });

      usuarioId = usuario._id;
    });

    test('Debería actualizar rol del usuario', async () => {
      const response = await request(app)
        .put(`/api/auth/${usuarioId}`)
        .send({ role: 'admin' });

      // QUÉ SE PRUEBA: Actualización de rol
      // RESULTADO ESPERADO: status 200, rol actualizado
      expect(response.status).toBe(200);

      const usuarioActualizado = await Usuario.findById(usuarioId);
      expect(usuarioActualizado.role).toBe('admin');
    });

    test('Debería actualizar username del usuario', async () => {
      const response = await request(app)
        .put(`/api/auth/${usuarioId}`)
        .send({ username: 'juannuevo' });

      // QUÉ SE PRUEBA: Actualización de username
      // RESULTADO ESPERADO: status 200, username actualizado
      expect(response.status).toBe(200);

      const usuarioActualizado = await Usuario.findById(usuarioId);
      expect(usuarioActualizado.username).toBe('juannuevo');
    });

    test('Debería fallar si usuario no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/auth/${fakeId}`)
        .send({ role: 'admin' });

      // QUÉ SE PRUEBA: Actualización de usuario inexistente
      // RESULTADO ESPERADO: status 404
      expect(response.status).toBe(404);
    });
  });

  describe('5. Eliminar Usuario', () => {
    test('Debería eliminar usuario correctamente', async () => {
      const empleado = await Empleado.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        cuil: '20-12345678-9',
        numeroLegajo: '0001'
      });

      const usuario = await Usuario.create({
        username: 'juanperez',
        password: 'password123',
        empleado: empleado._id
      });

      empleado.usuario = usuario._id;
      await empleado.save();

      // QUÉ SE PRUEBA: Eliminación de usuario
      const response = await request(app).delete(`/api/auth/${usuario._id}`);

      // RESULTADO ESPERADO: status 200, usuario eliminado
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('eliminado');

      const usuarioElim = await Usuario.findById(usuario._id);
      expect(usuarioElim).toBeNull();

      // Verificar que se desvinculó del empleado
      const empleadoActualizado = await Empleado.findById(empleado._id);
      expect(empleadoActualizado.usuario).toBeUndefined();
    });

    test('Debería fallar si usuario no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/api/auth/${fakeId}`);

      // QUÉ SE PRUEBA: Eliminación de usuario inexistente
      // RESULTADO ESPERADO: status 404
      expect(response.status).toBe(404);
    });
  });

  describe('6. Logout', () => {
    test('Debería retornar logout exitoso con token válido', async () => {
      // Crear empleado
      const empleado = await Empleado.create({
        numeroLegajo: '0010',
        nombre: 'Carlos',
        apellido: 'Logout',
        email: 'carlos@example.com',
        numeroDocumento: '10000000',
        tipoDocumento: 'dni',
        cuil: '20100000001',
        estado: 'activo',
      });

      // Registrar usuario
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          legajo: '0010',
          username: 'carlos_logout',
          password: 'password123',
          role: 'empleado',
        });

      expect(registerResponse.status).toBe(201);

      // Hacer login para obtener token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'carlos_logout',
          password: 'password123',
        });

      expect(loginResponse.status).toBe(200);
      const token = loginResponse.body.token;
      expect(token).toBeDefined();

      // Llamar a logout con token válido
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      // QUÉ SE PRUEBA: Logout con token válido
      // RESULTADO ESPERADO: status 200, success true, datos del usuario
      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body.success).toBe(true);
      expect(logoutResponse.body.message).toBe('Logout exitoso');
      expect(logoutResponse.body.data).toBeDefined();
      expect(logoutResponse.body.data.username).toBe('carlos_logout');
      expect(logoutResponse.body.data.nombre).toBe('Carlos');
    });

    test('Debería rechazar logout sin token', async () => {
      // Llamar a logout sin token
      const response = await request(app).post('/api/auth/logout');

      // QUÉ SE PRUEBA: Logout sin token
      // RESULTADO ESPERADO: status 401, error
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No hay token');
    });

    test('Debería rechazar logout con token inválido', async () => {
      // Llamar a logout con token inválido
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid_token_12345');

      // QUÉ SE PRUEBA: Logout con token inválido
      // RESULTADO ESPERADO: status 401, error
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token inválido');
    });
  });
});
