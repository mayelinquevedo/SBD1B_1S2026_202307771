const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rutas
const departamentosRoutes = require('./routes/departamentos');
const municipiosRoutes = require('./routes/municipios');
const centrosRoutes = require('./routes/centros');
const escuelasRoutes = require('./routes/escuelas');
const ubicacionesRoutes = require('./routes/ubicacion');
const usuariosRoutes = require('./routes/usuarios');
const instructoresRoutes = require('./routes/instructores');
const personasRoutes = require('./routes/personas');
const registrosRoutes = require('./routes/registros');
const examenRoutes = require('./routes/examenes');
const correlativosRoutes = require('./routes/correlativos');
const tiposLicenciaRoutes = require('./routes/tipolicencias');
const tiposTramiteRoutes = require('./routes/tipotramite');
const preguntasTeoricasRoutes = require('./routes/preguntasTeoricas');
const preguntasPracticasRoutes = require('./routes/preguntasPracticas');
const respuestasTeoricasRoutes = require('./routes/respuestasteoricas');
const respuestasPracticasRoutes = require('./routes/respuestaspracticas');
const estadisticasRoutes = require('./routes/estadisticas');

// endpoints
app.use('/api/departamentos', departamentosRoutes);
app.use('/api/municipios', municipiosRoutes);
app.use('/api/centros', centrosRoutes);
app.use('/api/escuelas', escuelasRoutes);
app.use('/api/ubicaciones', ubicacionesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/instructores', instructoresRoutes);
app.use('/api/personas', personasRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/examen', examenRoutes);
app.use('/api/correlativos', correlativosRoutes);
app.use('/api/tiposlicencia', tiposLicenciaRoutes);
app.use('/api/tipostramite', tiposTramiteRoutes);
app.use('/api/preguntasteoricas', preguntasTeoricasRoutes);
app.use('/api/preguntaspracticas', preguntasPracticasRoutes);
app.use('/api/respuestasteoricas', respuestasTeoricasRoutes);
app.use('/api/respuestaspracticas', respuestasPracticasRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API de Centros de Evaluación de Manejo funcionando' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});