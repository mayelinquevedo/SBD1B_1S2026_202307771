const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const departamentosRoutes = require('./routes/departamentos');
const municipiosRoutes = require('./routes/municipios');
const centrosRoutes = require('./routes/centros');
const escuelasRoutes = require('./routes/escuelas');
const personasRoutes = require('./routes/personas');
const registrosRoutes = require('./routes/registros');
const examenesRoutes = require('./routes/examenes');
const preguntasTeoricasRoutes = require('./routes/preguntasTeoricas');
const preguntasPracticasRoutes = require('./routes/preguntasPracticas');
const estadisticasRoutes = require('./routes/estadisticas');

// Endpoints
app.use('/api/departamentos', departamentosRoutes);
app.use('/api/municipios', municipiosRoutes);
app.use('/api/centros', centrosRoutes);
app.use('/api/escuelas', escuelasRoutes);
app.use('/api/personas', personasRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/examenes', examenesRoutes);
app.use('/api/preguntas-teoricas', preguntasTeoricasRoutes);
app.use('/api/preguntas-practicas', preguntasPracticasRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API de Centros de Evaluación de Manejo funcionando' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});