const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');

// 1. Promedios de punteos por centro o por escuela
router.get('/promedios', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        // Promedio de nota teórica y práctica por centro
        const sql = `
            SELECT 
                c.id_centro,
                c.nombre AS centro_nombre,
                AVG(e.resultado_teorico) AS promedio_teorico,
                AVG(e.resultado_practico) AS promedio_practico
            FROM EXAMEN e
            JOIN REGISTRO r ON e.id_registro = r.id_registro
            JOIN UBICACION u ON r.id_ubicacion = u.id_ubicacion
            JOIN CENTRO c ON u.id_centro = c.id_centro
            GROUP BY c.id_centro, c.nombre
            ORDER BY c.nombre
        `;
        const result = await connection.execute(sql);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// 2. Ranking de evaluados (por puntaje total teórico+práctico)
router.get('/ranking', async (req, res) => {
    let connection;
    try {
        const sql = `
            SELECT 
                p.id_persona,
                p.nombre_completo,
                NVL(e.resultado_teorico, 0) + NVL(e.resultado_practico, 0) AS puntaje_total,
                e.resultado_teorico,
                e.resultado_practico
            FROM PERSONA p
            JOIN REGISTRO r ON p.id_persona = r.id_persona
            JOIN EXAMEN e ON r.id_registro = e.id_registro
            ORDER BY puntaje_total DESC
        `;
        const result = await connection.execute(sql);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// 3. Análisis de dificultad de preguntas (porcentaje de aciertos por pregunta teórica)
router.get('/dificultad-preguntas', async (req, res) => {
    let connection;
    try {
        const sql = `
            SELECT 
                pt.id_pregunta_teorica,
                pt.texto,
                COUNT(rt.id_respuesta_teorica) AS total_respuestas,
                SUM(CASE WHEN rt.es_correcta = 1 THEN 1 ELSE 0 END) AS aciertos,
                ROUND( (SUM(CASE WHEN rt.es_correcta = 1 THEN 1 ELSE 0 END) / COUNT(rt.id_respuesta_teorica)) * 100, 2) AS porcentaje_aciertos
            FROM PREGUNTA_TEORICA pt
            LEFT JOIN RESPUESTA_TEORICA rt ON pt.id_pregunta_teorica = rt.id_pregunta_teorica
            GROUP BY pt.id_pregunta_teorica, pt.texto
            ORDER BY porcentaje_aciertos ASC
        `;
        const result = await connection.execute(sql);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

module.exports = router;