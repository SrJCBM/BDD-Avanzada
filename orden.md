# Examen BDD Redis - TecnoMega API

La empresa TecnoMega requiere un prototipo de API para compra/venta de productos tecnológicos, usando Redis como base NoSQL clave–valor para almacenar catálogos y transacciones.

## Objetivo General

Construir una API REST en Node.js + Express que:

- Use middleware para parsear JSON (`express.json()`)
- Use middleware `response-time` para medir tiempo de respuesta
- Implemente endpoints SET y GET contra Redis
- Cargue 10 registros por cada "tabla" desde un archivo JSON (clave–valor) y los almacene en Redis

## Modelo de Datos (tablas en Redis)

Se simulan 4 "tablas" (colecciones):

- `clientes`
- `productos`
- `pedidos`
- `detalle_pedido`

> **Nota:** Si el estudiante quiere agregar más colecciones lo puede realizar

## Reglas Mínimas

- **productos:** deben incluir código, nombre, categoría, precio, stock
- **clientes:** deben incluir cedula o dni, nombres, email, teléfono, edad, genero
- **pedidos:** deben incluir Código, clienteId, fecha, subtotal, iva, total, estado
- **detalle_pedido:** debe incluir Código, productoId, cantidad, detalle, precioUnit

## Requerimientos de Redis (clave–valor)

Cada registro se guarda como JSON string en una key con prefijo.

Además, cada colección debe tener un índice con Set.

## Endpoints Obligatorios (SET/GET)

### 1) Carga masiva desde JSON (SET)

**POST** `/seed`
- Lee `data/tecnomega.json`
- Inserta en Redis todos los registros
- Responde cantidad insertada y tiempo

### 2) Guardar 1 registro (SET)

### 3) Obtener 1 registro (GET)

### 4) Listar todos los registros de una tabla

## Entregables

### Repositorio con:

- `index.js` (API)
- `data/tecnomega.json` (10 registros por tabla mínimo)

### Evidencia:

- Capturas de Postman/Thunder Client
- Salida del tiempo de respuesta (Response-Time)

## Rúbrica (20 pts)

| Criterio | Puntos |
|----------|--------|
| Middleware JSON + response-time funcionando | 3 |
| Redis conexión + manejo de errores | 3 |
| Endpoints SET/GET correctos | 3 |
| Seed desde JSON correcto | 3 |
| Modelo de datos completo (10 registros por tabla) | 3 |
| README + evidencias | 5 |

---

