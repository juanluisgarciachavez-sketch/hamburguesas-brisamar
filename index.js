const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Base de datos simulada
let hamburguesas = [
  { id: 1, nombre: 'Clásica', precio: 8.99, descripcion: 'Hamburguesa clásica con queso' },
  { id: 2, nombre: 'Doble Carne', precio: 12.99, descripcion: 'Dos carnes con queso y tocino' },
  { id: 3, nombre: 'Vegana', precio: 10.99, descripcion: 'Hamburguesa 100% vegetal' }
];

// RUTAS

// GET - Obtener todas las hamburguesas
app.get('/api/hamburguesas', (req, res) => {
  res.json(hamburguesas);
});

// GET - Obtener una hamburguesa por ID
app.get('/api/hamburguesas/:id', (req, res) => {
  const hamburguesa = hamburguesas.find(h => h.id === parseInt(req.params.id));
  if (!hamburguesa) {
    return res.status(404).json({ mensaje: 'Hamburguesa no encontrada' });
  }
  res.json(hamburguesa);
});

// POST - Crear nueva hamburguesa
app.post('/api/hamburguesas', (req, res) => {
  const { nombre, precio, descripcion } = req.body;

  if (!nombre || !precio || !descripcion) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
  }

  const nuevaHamburguesa = {
    id: hamburguesas.length > 0 ? Math.max(...hamburguesas.map(h => h.id)) + 1 : 1,
    nombre,
    precio,
    descripcion
  };

  hamburguesas.push(nuevaHamburguesa);
  res.status(201).json(nuevaHamburguesa);
});

// PUT - Actualizar una hamburguesa
app.put('/api/hamburguesas/:id', (req, res) => {
  const hamburguesa = hamburguesas.find(h => h.id === parseInt(req.params.id));
  if (!hamburguesa) {
    return res.status(404).json({ mensaje: 'Hamburguesa no encontrada' });
  }

  const { nombre, precio, descripcion } = req.body;
  if (nombre) hamburguesa.nombre = nombre;
  if (precio) hamburguesa.precio = precio;
  if (descripcion) hamburguesa.descripcion = descripcion;

  res.json(hamburguesa);
});

// DELETE - Eliminar una hamburguesa
app.delete('/api/hamburguesas/:id', (req, res) => {
  const index = hamburguesas.findIndex(h => h.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ mensaje: 'Hamburguesa no encontrada' });
  }

  const hamburguesa = hamburguesas[index];
  hamburguesas.splice(index, 1);
  res.json({ mensaje: 'Hamburguesa eliminada', hamburguesa });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '¡Bienvenido a Hamburguesas Brisamar!',
    version: '1.0.0',
    rutas: '/api/hamburguesas'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🍔 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api/hamburguesas`);
});
