const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

// GET todas las preguntas teóricas
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM PREGUNTA_TEORICA ORDER BY id_pregunta_teorica`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

// GET por ID
router.get('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM PREGUNTA_TEORICA WHERE id_pregunta_teorica = :id`, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Pregunta no encontrada' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

// POST crear pregunta teórica
router.post('/', async (req, res) => {
    let conn;
    try {
        const { texto, imagen, respuesta_a, respuesta_b, respuesta_c, respuesta_d, opcion_correcta } = req.body;
        if (!texto || !respuesta_a || !respuesta_b || !respuesta_c || !respuesta_d || !opcion_correcta) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO PREGUNTA_TEORICA (texto, imagen, respuesta_a, respuesta_b, respuesta_c, respuesta_d, opcion_correcta) 
             VALUES (:texto, :imagen, :respuesta_a, :respuesta_b, :respuesta_c, :respuesta_d, :opcion_correcta) 
             RETURNING id_pregunta_teorica INTO :id`,
            {
                texto, imagen, respuesta_a, respuesta_b, respuesta_c, respuesta_d, opcion_correcta,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_pregunta_teorica: result.outBinds.id[0], texto, imagen, respuesta_a, respuesta_b, respuesta_c, respuesta_d, opcion_correcta });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

// PUT
router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { texto, imagen, respuesta_a, respuesta_b, respuesta_c, respuesta_d, opcion_correcta } = req.body;
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE PREGUNTA_TEORICA SET 
                texto = :texto, imagen = :imagen, respuesta_a = :respuesta_a, respuesta_b = :respuesta_b, 
                respuesta_c = :respuesta_c, respuesta_d = :respuesta_d, opcion_correcta = :opcion_correcta 
             WHERE id_pregunta_teorica = :id`,
            { texto, imagen, respuesta_a, respuesta_b, respuesta_c, respuesta_d, opcion_correcta, id: req.params.id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Pregunta no encontrada' });
        res.json({ message: 'Pregunta actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM PREGUNTA_TEORICA WHERE id_pregunta_teorica = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Pregunta no encontrada' });
        res.json({ message: 'Pregunta eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

module.exports = router;