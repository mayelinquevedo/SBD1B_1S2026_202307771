const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

// Catálogo, generalmente solo lectura, pero incluimos CRUD completo
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM TIPO_LICENCIA ORDER BY id_tipo_licencia`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.get('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM TIPO_LICENCIA WHERE id_tipo_licencia = :id`, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Tipo de licencia no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.post('/', async (req, res) => {
    let conn;
    try {
        const { codigo, descripcion } = req.body;
        if (!codigo || !descripcion) {
            return res.status(400).json({ error: 'Faltan campos: codigo, descripcion' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO TIPO_LICENCIA (codigo, descripcion) VALUES (:codigo, :descripcion) RETURNING id_tipo_licencia INTO :id`,
            {
                codigo, descripcion,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_tipo_licencia: result.outBinds.id[0], codigo, descripcion });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { codigo, descripcion } = req.body;
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE TIPO_LICENCIA SET codigo = :codigo, descripcion = :descripcion WHERE id_tipo_licencia = :id`,
            { codigo, descripcion, id: req.params.id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Tipo de licencia no encontrado' });
        res.json({ message: 'Tipo de licencia actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM TIPO_LICENCIA WHERE id_tipo_licencia = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Tipo de licencia no encontrado' });
        res.json({ message: 'Tipo de licencia eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

module.exports = router;