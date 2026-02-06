const express = require('express');
const responseTime = require('response-time');
const redis = require('redis');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const client = redis.createClient({
  url: 'redis://localhost:6379'
});

client.on('error', (err) => {
  console.error('Error de conexión a Redis:', err);
});

client.connect()
  .then(() => console.log('Conectado a Redis correctamente'))
  .catch(err => console.error('Error al conectar a Redis:', err));

app.use(express.json());
app.use(responseTime((req, res, time) => {
  console.log(`${req.method} ${req.url} - ${time.toFixed(2)}ms`);
}));

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API TecnoMega - Redis',
    version: '1.0.0',
    endpoints: {
      seed: 'POST /seed - Carga masiva desde JSON',
      guardar: 'POST /:tabla - Guardar un registro',
      obtener: 'GET /:tabla/:id - Obtener un registro',
      listar: 'GET /:tabla - Listar todos los registros'
    }
  });
});

app.post('/seed', async (req, res) => {
  try {
    const startTime = Date.now();
    const dataPath = path.join(__dirname, 'data', 'tecnomega.json');
    const jsonData = await fs.readFile(dataPath, 'utf8');
    const data = JSON.parse(jsonData);
    
    let totalInsertados = 0;
    
    for (const [tabla, registros] of Object.entries(data)) {
      const keys = await client.keys(`${tabla}:*`);
      if (keys.length > 0) {
        await client.del(keys);
      }
      await client.del(`${tabla}:index`);
      
      for (const registro of registros) {
        const key = `${tabla}:${registro.id}`;
        await client.set(key, JSON.stringify(registro));
        await client.sAdd(`${tabla}:index`, registro.id);
        totalInsertados++;
      }
    }
    
    const tiempoTotal = Date.now() - startTime;
    
    res.json({
      exito: true,
      mensaje: 'Datos cargados exitosamente',
      tablas: Object.keys(data),
      totalRegistros: totalInsertados,
      tiempoMs: tiempoTotal
    });
    
  } catch (error) {
    console.error('Error en /seed:', error);
    res.status(500).json({
      exito: false,
      error: 'Error al cargar los datos',
      detalle: error.message
    });
  }
});

app.post('/:tabla', async (req, res) => {
  try {
    const { tabla } = req.params;
    const registro = req.body;
    
    if (!registro.id) {
      return res.status(400).json({
        exito: false,
        error: 'El registro debe tener un campo "id"'
      });
    }
    
    const key = `${tabla}:${registro.id}`;
    await client.set(key, JSON.stringify(registro));
    await client.sAdd(`${tabla}:index`, registro.id);
    
    res.status(201).json({
      exito: true,
      mensaje: 'Registro guardado exitosamente',
      tabla: tabla,
      id: registro.id,
      dato: registro
    });
    
  } catch (error) {
    console.error(`Error en POST /${req.params.tabla}:`, error);
    res.status(500).json({
      exito: false,
      error: 'Error al guardar el registro',
      detalle: error.message
    });
  }
});

app.get('/:tabla/:id', async (req, res) => {
  try {
    const { tabla, id } = req.params;
    const key = `${tabla}:${id}`;
    const data = await client.get(key);
    
    if (!data) {
      return res.status(404).json({
        exito: false,
        error: 'Registro no encontrado',
        tabla: tabla,
        id: id
      });
    }
    
    const registro = JSON.parse(data);
    
    res.json({
      exito: true,
      tabla: tabla,
      id: id,
      dato: registro
    });
    
  } catch (error) {
    console.error(`Error en GET /${req.params.tabla}/${req.params.id}:`, error);
    res.status(500).json({
      exito: false,
      error: 'Error al obtener el registro',
      detalle: error.message
    });
  }
});

app.get('/:tabla', async (req, res) => {
  try {
    const { tabla } = req.params;
    const ids = await client.sMembers(`${tabla}:index`);
    
    if (ids.length === 0) {
      return res.json({
        exito: true,
        tabla: tabla,
        cantidad: 0,
        datos: []
      });
    }
    
    const registros = [];
    for (const id of ids) {
      const key = `${tabla}:${id}`;
      const data = await client.get(key);
      if (data) {
        registros.push(JSON.parse(data));
      }
    }
    
    res.json({
      exito: true,
      tabla: tabla,
      cantidad: registros.length,
      datos: registros
    });
    
  } catch (error) {
    console.error(`Error en GET /${req.params.tabla}:`, error);
    res.status(500).json({
      exito: false,
      error: 'Error al listar los registros',
      detalle: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`\nServidor corriendo en http://localhost:${PORT}`);
  console.log(`Tablas disponibles: clientes, productos, pedidos, detalle_pedido`);
  console.log(`\nEndpoints disponibles:`);
  console.log(`  POST /seed - Carga masiva desde JSON`);
  console.log(`  POST /:tabla - Guardar un registro`);
  console.log(`  GET /:tabla/:id - Obtener un registro`);
  console.log(`  GET /:tabla - Listar todos los registros\n`);
});

process.on('SIGINT', async () => {
  console.log('\nCerrando conexiones...');
  await client.quit();
  process.exit(0);
});
