const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM INSTRUCTOR ORDER BY id_instructor`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.get('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM INSTRUCTOR WHERE id_instructor = :id`, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Instructor no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.post('/', async (req, res) => {
    let conn;
    try {
        const { identificacion, nombre_completo, especialidad } = req.body;
        if (!identificacion || !nombre_completo) {
            return res.status(400).json({ error: 'Faltan campos: identificacion, nombre_completo' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO INSTRUCTOR (identificacion, nombre_completo, especialidad) 
             VALUES (:identificacion, :nombre_completo, :especialidad) 
             RETURNING id_instructor INTO :id`,
            {
                identificacion, nombre_completo, especialidad,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_instructor: result.outBinds.id[0], identificacion, nombre_completo, especialidad });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { identificacion, nombre_completo, especialidad } = req.body;
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE INSTRUCTOR SET identificacion = :identificacion, nombre_completo = :nombre_completo, especialidad = :especialidad 
             WHERE id_instructor = :id`,
            { identificacion, nombre_completo, especialidad, id: req.params.id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Instructor no encontrado' });
        res.json({ message: 'Instructor actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM INSTRUCTOR WHERE id_instructor = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Instructor no encontrado' });
        res.json({ message: 'Instructor eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

module.exports = router;