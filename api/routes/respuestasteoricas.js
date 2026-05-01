const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`
            SELECT rt.*, pt.texto as pregunta_texto, e.id_examen
            FROM RESPUESTA_TEORICA rt
            JOIN PREGUNTA_TEORICA pt ON rt.id_pregunta_teorica = pt.id_pregunta_teorica
            JOIN EXAMEN e ON rt.id_examen = e.id_examen
            ORDER BY rt.id_respuesta_teorica
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.get('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM RESPUESTA_TEORICA WHERE id_respuesta_teorica = :id`, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Respuesta no encontrada' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.post('/', async (req, res) => {
    let conn;
    try {
        const { id_examen, id_pregunta_teorica, respuesta_seleccionada, es_correcta, puntos_obtenidos } = req.body;
        if (!id_examen || !id_pregunta_teorica || !respuesta_seleccionada) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO RESPUESTA_TEORICA (id_examen, id_pregunta_teorica, respuesta_seleccionada, es_correcta, puntos_obtenidos) 
             VALUES (:id_examen, :id_pregunta_teorica, :respuesta_seleccionada, :es_correcta, :puntos_obtenidos) 
             RETURNING id_respuesta_teorica INTO :id`,
            {
                id_examen, id_pregunta_teorica, respuesta_seleccionada, es_correcta, puntos_obtenidos,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_respuesta_teorica: result.outBinds.id[0], id_examen, id_pregunta_teorica, respuesta_seleccionada, es_correcta, puntos_obtenidos });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { respuesta_seleccionada, es_correcta, puntos_obtenidos } = req.body;
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE RESPUESTA_TEORICA SET respuesta_seleccionada = :respuesta_seleccionada, es_correcta = :es_correcta, puntos_obtenidos = :puntos_obtenidos 
             WHERE id_respuesta_teorica = :id`,
            { respuesta_seleccionada, es_correcta, puntos_obtenidos, id: req.params.id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Respuesta no encontrada' });
        res.json({ message: 'Respuesta actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM RESPUESTA_TEORICA WHERE id_respuesta_teorica = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Respuesta no encontrada' });
        res.json({ message: 'Respuesta eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

module.exports = router;