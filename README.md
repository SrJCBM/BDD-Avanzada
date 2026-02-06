# API TecnoMega - Redis

API REST para compra/venta de productos tecnológicos usando Redis como base de datos NoSQL clave-valor.

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- Redis instalado y corriendo en `localhost:6379`
- NPM o Yarn

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone <url-repositorio>
cd BDD-Aavanzada
```

2. Instalar dependencias:
```bash
npm install
```

3. Asegurarse de que Redis esté corriendo:
```bash
# En Windows con Redis instalado
redis-server

# O verificar que el servicio esté activo
```

## 🎯 Uso

### Iniciar el servidor

Modo desarrollo (con nodemon):
```bash
npm run dev
```

Modo producción:
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📊 Modelo de Datos

### Tablas (Colecciones)

1. **clientes**: cedula/dni, nombres, email, teléfono, edad, genero
2. **productos**: código, nombre, categoría, precio, stock
3. **pedidos**: código, clienteId, fecha, subtotal, iva, total, estado
4. **detalle_pedido**: código, pedidoId, productoId, cantidad, detalle, precioUnit

Cada tabla tiene 10 registros de ejemplo en `data/tecnomega.json`.

## 🔌 Endpoints

### 1. Endpoint Principal
```http
GET /
```
Devuelve información sobre la API y sus endpoints disponibles.

### 2. Carga Masiva (Seed)
```http
POST /seed
```
Carga todos los datos desde `data/tecnomega.json` a Redis.

**Respuesta exitosa:**
```json
{
  "exito": true,
  "mensaje": "Datos cargados exitosamente",
  "tablas": ["clientes", "productos", "pedidos", "detalle_pedido"],
  "totalRegistros": 40,
  "tiempoMs": 125
}
```

### 3. Guardar un Registro
```http
POST /:tabla
Content-Type: application/json

{
  "id": "nuevo_id",
  "campo1": "valor1",
  ...
}
```

**Ejemplo:**
```bash
POST /productos
{
  "id": "P011",
  "codigo": "LAP-003",
  "nombre": "MacBook Pro 14",
  "categoria": "Laptops",
  "precio": 1999.99,
  "stock": 10
}
```

### 4. Obtener un Registro
```http
GET /:tabla/:id
```

**Ejemplo:**
```bash
GET /clientes/1
```

**Respuesta:**
```json
{
  "exito": true,
  "tabla": "clientes",
  "id": "1",
  "dato": {
    "id": "1",
    "cedula": "1234567890",
    "nombres": "Juan Pérez",
    "email": "juan.perez@email.com",
    "telefono": "0987654321",
    "edad": 28,
    "genero": "Masculino"
  }
}
```

### 5. Listar Todos los Registros
```http
GET /:tabla
```

**Ejemplo:**
```bash
GET /productos
```

**Respuesta:**
```json
{
  "exito": true,
  "tabla": "productos",
  "cantidad": 10,
  "datos": [...]
}
```

## 🧪 Pruebas con Postman/Thunder Client

### Secuencia de Pruebas

1. **Iniciar servidor**: `npm run dev`

2. **Cargar datos iniciales**:
   - POST `http://localhost:3000/seed`
   - Verificar respuesta con tiempo de carga

3. **Obtener un cliente**:
   - GET `http://localhost:3000/clientes/1`

4. **Listar todos los productos**:
   - GET `http://localhost:3000/productos`

5. **Crear un nuevo producto**:
   - POST `http://localhost:3000/productos`
   - Body: JSON con datos del producto

6. **Obtener un pedido**:
   - GET `http://localhost:3000/pedidos/PED001`

7. **Listar detalles de pedidos**:
   - GET `http://localhost:3000/detalle_pedido`

## ⏱️ Response Time

El middleware `response-time` está configurado y muestra en la consola el tiempo de respuesta de cada petición:

```
POST /seed - 156.23ms
GET /productos - 12.45ms
GET /clientes/1 - 8.32ms
```

## 🗂️ Estructura de Redis

### Claves
- Registros individuales: `tabla:id` (ej: `clientes:1`)
- Índices: `tabla:index` (Set con todos los IDs)

### Comandos Redis útiles para verificar

```bash
# Ver todas las claves
KEYS *

# Ver un registro específico
GET clientes:1

# Ver todos los IDs de una tabla
SMEMBERS productos:index

# Contar registros
SCARD clientes:index
```

## 📁 Estructura del Proyecto

```
BDD-Aavanzada/
├── data/
│   └── tecnomega.json      # Datos de 10 registros por tabla
├── index.js                # API principal
├── package.json            # Dependencias y scripts
├── README.md              # Esta documentación
└── orden_formatted.md     # Requisitos del proyecto
```

## 🛠️ Tecnologías

- **Node.js**: Entorno de ejecución
- **Express**: Framework web
- **Redis**: Base de datos NoSQL clave-valor
- **response-time**: Middleware para medir tiempos de respuesta

## ✅ Checklist de Evaluación (20 pts)

- [x] Middleware JSON + response-time funcionando (3 pts)
- [x] Redis conexión + manejo de errores (3 pts)
- [x] Endpoints SET/GET correctos (3 pts)
- [x] Seed desde JSON correcto (3 pts)
- [x] Modelo de datos completo con 10 registros por tabla (3 pts)
- [x] README + evidencias (5 pts)

## 📸 Evidencias

Para cumplir con los requisitos del examen, capturar pantallas de:

1. Respuesta del endpoint `/seed` mostrando tiempo de carga
2. GET de un registro individual
3. POST creando un nuevo registro
4. GET listando todos los registros de una tabla
5. Consola mostrando los tiempos de response-time
6. Redis CLI mostrando las claves almacenadas

## 🐛 Solución de Problemas

### Redis no conecta
- Verificar que Redis esté corriendo: `redis-cli ping` (debe responder `PONG`)
- Verificar el puerto: por defecto es 6379
- Revisar la URL de conexión en `index.js`

### Error al cargar datos
- Verificar que existe la carpeta `data/` y el archivo `tecnomega.json`
- Revisar permisos de lectura del archivo

### Puerto en uso
- Cambiar el puerto en la variable `PORT` o usar variable de entorno:
  ```bash
  PORT=4000 npm start
  ```

## 👨‍💻 Autor

Desarrollado para el Examen de BDD Redis - TecnoMega

## 📄 Licencia

Proyecto educativo - Libre uso para fines académicos
