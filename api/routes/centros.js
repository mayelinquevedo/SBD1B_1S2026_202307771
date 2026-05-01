const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM CENTRO ORDER BY id_centro`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.get('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM CENTRO WHERE id_centro = :id`, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Centro no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.post('/', async (req, res) => {
    let conn;
    try {
        const { nombre, direccion } = req.body;
        if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO CENTRO (nombre, direccion) VALUES (:nombre, :direccion) RETURNING id_centro INTO :id`,
            {
                nombre, direccion,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_centro: result.outBinds.id[0], nombre, direccion });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { nombre, direccion } = req.body;
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE CENTRO SET nombre = :nombre, direccion = :direccion WHERE id_centro = :id`,
            { nombre, direccion, id: req.params.id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Centro no encontrado' });
        res.json({ message: 'Centro actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM CENTRO WHERE id_centro = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Centro no encontrado' });
        res.json({ message: 'Centro eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

module.exports = router;