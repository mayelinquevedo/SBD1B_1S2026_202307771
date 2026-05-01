const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM PREGUNTA_PRACTICA ORDER BY id_pregunta_practica`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.get('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM PREGUNTA_PRACTICA WHERE id_pregunta_practica = :id`, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Pregunta no encontrada' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.post('/', async (req, res) => {
    let conn;
    try {
        const { texto, punteo_maximo } = req.body;
        if (!texto || punteo_maximo === undefined) {
            return res.status(400).json({ error: 'Faltan campos: texto, punteo_maximo' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO PREGUNTA_PRACTICA (texto, punteo_maximo) VALUES (:texto, :punteo_maximo) RETURNING id_pregunta_practica INTO :id`,
            {
                texto, punteo_maximo,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_pregunta_practica: result.outBinds.id[0], texto, punteo_maximo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { texto, punteo_maximo } = req.body;
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE PREGUNTA_PRACTICA SET texto = :texto, punteo_maximo = :punteo_maximo WHERE id_pregunta_practica = :id`,
            { texto, punteo_maximo, id: req.params.id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Pregunta no encontrada' });
        res.json({ message: 'Pregunta actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM PREGUNTA_PRACTICA WHERE id_pregunta_practica = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Pregunta no encontrada' });
        res.json({ message: 'Pregunta eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

module.exports = router;