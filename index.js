const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_2024';

// Middlewares
app.use(cors());
app.use(express.json());

// Base de datos simulada
let hamburguesas = [
  { id: 1, nombre: 'Clásica', precio: 8.99, descripcion: 'Hamburguesa clásica con queso' },
  { id: 2, nombre: 'Doble Carne', precio: 12.99, descripcion: 'Dos carnes con queso y tocino' },
  { id: 3, nombre: 'Vegana', precio: 10.99, descripcion: 'Hamburguesa 100% vegetal' }
];

// Usuario admin (en producción esto iría en base de datos)
let usuarios = [
  {
    id: 1,
    email: 'admin@brisamar.com',
    password: bcrypt.hashSync('contraseña123', 10) // Hasheada
  }
];

// ============ MIDDLEWARE DE AUTENTICACIÓN ============
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  // Remover "Bearer " del token
  const tokenLimpio = token.replace('Bearer ', '');

  jwt.verify(tokenLimpio, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.usuario = decoded;
    next();
  });
};

// ============ RUTAS DE AUTENTICACIÓN ============

// POST - Login (obtener token)
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password requerido')
], async (req, res) => {
  // Validar errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { email, password } = req.body;

  // Buscar usuario
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Verificar contraseña
  const passwordValida = bcrypt.compareSync(password, usuario.password);
  if (!passwordValida) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Generar token JWT (válido por 24 horas)
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    mensaje: '✅ Login exitoso',
    token,
    usuario: { id: usuario.id, email: usuario.email }
  });
});

// ============ RUTAS DE HAMBURGUESAS ============

// GET - Obtener todas las hamburguesas (sin autenticación)
app.get('/api/hamburguesas', (req, res) => {
  res.json(hamburguesas);
});

// GET - Obtener una hamburguesa por ID (sin autenticación)
app.get('/api/hamburguesas/:id', (req, res) => {
  const hamburguesa = hamburguesas.find(h => h.id === parseInt(req.params.id));
  if (!hamburguesa) {
    return res.status(404).json({ error: 'Hamburguesa no encontrada' });
  }
  res.json(hamburguesa);
});

// POST - Crear nueva hamburguesa (REQUIERE AUTENTICACIÓN)
app.post('/api/hamburguesas', verificarToken, [
  body('nombre').notEmpty().withMessage('Nombre requerido').trim(),
  body('precio').isFloat({ min: 0 }).withMessage('Precio debe ser un número positivo'),
  body('descripcion').notEmpty().withMessage('Descripción requerida').trim()
], (req, res) => {
  // Validar errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { nombre, precio, descripcion } = req.body;

  const nuevaHamburguesa = {
    id: hamburguesas.length > 0 ? Math.max(...hamburguesas.map(h => h.id)) + 1 : 1,
    nombre,
    precio: parseFloat(precio),
    descripcion
  };

  hamburguesas.push(nuevaHamburguesa);
  res.status(201).json({
    mensaje: '✅ Hamburguesa creada',
    hamburguesa: nuevaHamburguesa
  });
});

// PUT - Actualizar hamburguesa (REQUIERE AUTENTICACIÓN)
app.put('/api/hamburguesas/:id', verificarToken, [
  body('nombre').optional().trim(),
  body('precio').optional().isFloat({ min: 0 }),
  body('descripcion').optional().trim()
], (req, res) => {
  // Validar errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const hamburguesa = hamburguesas.find(h => h.id === parseInt(req.params.id));
  if (!hamburguesa) {
    return res.status(404).json({ error: 'Hamburguesa no encontrada' });
  }

  const { nombre, precio, descripcion } = req.body;
  if (nombre) hamburguesa.nombre = nombre;
  if (precio) hamburguesa.precio = parseFloat(precio);
  if (descripcion) hamburguesa.descripcion = descripcion;

  res.json({
    mensaje: '✅ Hamburguesa actualizada',
    hamburguesa
  });
});

// DELETE - Eliminar hamburguesa (REQUIERE AUTENTICACIÓN)
app.delete('/api/hamburguesas/:id', verificarToken, (req, res) => {
  const index = hamburguesas.findIndex(h => h.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Hamburguesa no encontrada' });
  }

  const hamburguesa = hamburguesas[index];
  hamburguesas.splice(index, 1);
  res.json({
    mensaje: '✅ Hamburguesa eliminada',
    hamburguesa
  });
});

// ============ RUTA RAÍZ ============
app.get('/', (req, res) => {
  res.json({
    mensaje: '🍔 ¡Bienvenido a Hamburguesas Brisamar!',
    version: '2.0.0',
    rutas: {
      login: 'POST /api/auth/login',
      hamburguesas: 'GET /api/hamburguesas',
      crear: 'POST /api/hamburguesas (requiere token)',
      actualizar: 'PUT /api/hamburguesas/:id (requiere token)',
      eliminar: 'DELETE /api/hamburguesas/:id (requiere token)'
    }
  });
});

// ============ MANEJO DE ERRORES ============
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ============ INICIAR SERVIDOR ============
app.listen(PORT, () => {
  console.log(`🍔 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
  console.log(`🔐 Login: POST /api/auth/login`);
  console.log(`\n📧 Email: admin@brisamar.com`);
  console.log(`🔑 Password: contraseña123`);
});
