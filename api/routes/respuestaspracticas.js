const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`
            SELECT rp.*, pp.texto as pregunta_texto, e.id_examen
            FROM RESPUESTA_PRACTICA rp
            JOIN PREGUNTA_PRACTICA pp ON rp.id_pregunta_practica = pp.id_pregunta_practica
            JOIN EXAMEN e ON rp.id_examen = e.id_examen
            ORDER BY rp.id_respuesta_practica
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
        const result = await conn.execute(`SELECT * FROM RESPUESTA_PRACTICA WHERE id_respuesta_practica = :id`, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Respuesta no encontrada' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.post('/', async (req, res) => {
    let conn;
    try {
        const { id_examen, id_pregunta_practica, nota_obtenida, comentario_instructor } = req.body;
        if (!id_examen || !id_pregunta_practica || nota_obtenida === undefined) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO RESPUESTA_PRACTICA (id_examen, id_pregunta_practica, nota_obtenida, comentario_instructor) 
             VALUES (:id_examen, :id_pregunta_practica, :nota_obtenida, :comentario_instructor) 
             RETURNING id_respuesta_practica INTO :id`,
            {
                id_examen, id_pregunta_practica, nota_obtenida, comentario_instructor,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_respuesta_practica: result.outBinds.id[0], id_examen, id_pregunta_practica, nota_obtenida, comentario_instructor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { nota_obtenida, comentario_instructor } = req.body;
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE RESPUESTA_PRACTICA SET nota_obtenida = :nota_obtenida, comentario_instructor = :comentario_instructor 
             WHERE id_respuesta_practica = :id`,
            { nota_obtenida, comentario_instructor, id: req.params.id },
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
        const result = await conn.execute(`DELETE FROM RESPUESTA_PRACTICA WHERE id_respuesta_practica = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Respuesta no encontrada' });
        res.json({ message: 'Respuesta eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

module.exports = router;