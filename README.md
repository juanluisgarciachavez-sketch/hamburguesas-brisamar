# 🍔 Hamburguesas Brisamar - API REST

API Node.js profesional para gestionar hamburguesas con **autenticación JWT** y **datos seguros**.

---

## 🎯 Features

✅ Autenticación con JWT  
✅ Encriptación de contraseñas (bcrypt)  
✅ Validación de datos  
✅ CORS habilitado  
✅ Manejo de errores  
✅ Variables de entorno secretas  

---

## 🚀 Instalación

### Requisitos
- Node.js 14+ 
- npm o yarn

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/hamburguesas-brisamar.git
cd hamburguesas-brisamar

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env (ver ejemplo abajo)
cp .env.example .env

# 4. Iniciar servidor
npm start

🔐 Autenticación
Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@brisamar.com",
    "password": "contraseña123"
  }'

Respuesta:

{
  "mensaje": "✅ Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "email": "admin@brisamar.com"
  }
}

Usar Token
Agregar en headers de tus requests:

Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

📡 Rutas API
🔓 SIN Autenticación
GET /api/hamburguesas

Obtener todas las hamburguesas

curl http://localhost:3000/api/hamburguesas

GET /api/hamburguesas/:id

Obtener una hamburguesa

curl http://localhost:3000/api/hamburguesas/1

🔐 CON Autenticación (Requiere Token)
POST /api/hamburguesas

Crear nueva hamburguesa

curl -X POST http://localhost:3000/api/hamburguesas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_token_aqui" \
  -d '{
    "nombre": "Hamburguesa BBQ",
    "precio": 11.99,
    "descripcion": "Con salsa BBQ y cebolla caramelizada"
  }'

PUT /api/hamburguesas/:id

Actualizar hamburguesa

curl -X PUT http://localhost:3000/api/hamburguesas/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_token_aqui" \
  -d '{
    "precio": 9.99
  }'

DELETE /api/hamburguesas/:id

Eliminar hamburguesa

curl -X DELETE http://localhost:3000/api/hamburguesas/1 \
  -H "Authorization: Bearer tu_token_aqui"

🔑 Credenciales de Prueba
Email:    admin@brisamar.com
Password: contraseña123

⚠️ CAMBIAR en producción

📝 Variables de Entorno (.env)
PORT=3000
NODE_ENV=development
JWT_SECRET=tu_clave_secreta_super_segura_brisamar_2024_no_compartas

🛡️ Seguridad
✅ Contraseñas hasheadas con bcrypt
✅ Tokens JWT con expiración (24 horas)
✅ Validación de datos con express-validator
✅ CORS configurado
✅ Variables secretas en .env (no en GitHub)

⚠️ Para Producción
[ ] Cambiar JWT_SECRET a algo más complejo
[ ] Cambiar contraseña del admin
[ ] Usar base de datos real (MongoDB/PostgreSQL)
[ ] Implementar HTTPS
[ ] Usar servicio de hosting seguro
🧪 Pruebas con Postman
Descargar https://www.postman.com/downloads/
Importar colección o crear requests manualmente
Login primero → Copiar token
Agregar token en Authorization → Bearer Token
📦 Dependencias
{
  "express": "^4.18.2",
  "dotenv": "^16.0.3",
  "cors": "^2.8.5",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "express-validator": "^7.0.0"
}

🚀 Despliegue
Railway
# 1. Conectar GitHub
# 2. Seleccionar este repo
# 3. Agregar variables de entorno
# 4. Deploy automático

Heroku
heroku create tu-app
git push heroku main

Render
Similar a Railway, muy fácil 🎉

📚 Próximos Pasos
[ ] Agregar MongoDB
[ ] Crear tabla de pedidos
[ ] Implementar pagos (Stripe)
[ ] Panel de admin
[ ] Notificaciones por email
👨‍💻 Autor
Tu Nombre - https://github.com/tu-usuario

📄 Licencia
MIT License - Usa libremente

💬 Soporte
¿Problemas? Abre un issue en GitHub 🎯


---
