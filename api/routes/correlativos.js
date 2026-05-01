const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM CORRELATIVO ORDER BY id_correlativo`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.get('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM CORRELATIVO WHERE id_correlativo = :id`, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Correlativo no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.post('/', async (req, res) => {
    let conn;
    try {
        const { fecha, no_examen } = req.body;
        if (!fecha || no_examen === undefined) {
            return res.status(400).json({ error: 'Faltan campos: fecha, no_examen' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO CORRELATIVO (fecha, no_examen) 
             VALUES (TO_DATE(:fecha, 'YYYY-MM-DD'), :no_examen) 
             RETURNING id_correlativo INTO :id`,
            {
                fecha, no_examen,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_correlativo: result.outBinds.id[0], fecha, no_examen });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { fecha, no_examen } = req.body;
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE CORRELATIVO SET fecha = TO_DATE(:fecha, 'YYYY-MM-DD'), no_examen = :no_examen WHERE id_correlativo = :id`,
            { fecha, no_examen, id: req.params.id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Correlativo no encontrado' });
        res.json({ message: 'Correlativo actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM CORRELATIVO WHERE id_correlativo = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Correlativo no encontrado' });
        res.json({ message: 'Correlativo eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

module.exports = router;