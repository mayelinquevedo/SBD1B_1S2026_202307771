const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM TIPO_TRAMITE ORDER BY id_tipo_tramite`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.get('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM TIPO_TRAMITE WHERE id_tipo_tramite = :id`, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Tipo de trámite no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.post('/', async (req, res) => {
    let conn;
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'Falta campo: nombre' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO TIPO_TRAMITE (nombre) VALUES (:nombre) RETURNING id_tipo_tramite INTO :id`,
            {
                nombre,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_tipo_tramite: result.outBinds.id[0], nombre });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { nombre } = req.body;
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE TIPO_TRAMITE SET nombre = :nombre WHERE id_tipo_tramite = :id`,
            { nombre, id: req.params.id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Tipo de trámite no encontrado' });
        res.json({ message: 'Tipo de trámite actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM TIPO_TRAMITE WHERE id_tipo_tramite = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Tipo de trámite no encontrado' });
        res.json({ message: 'Tipo de trámite eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

module.exports = router;