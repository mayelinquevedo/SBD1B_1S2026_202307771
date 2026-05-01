const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

// GET todas las ubicaciones (con nombres de escuela y centro)
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`
            SELECT u.*, e.nombre as escuela_nombre, c.nombre as centro_nombre
            FROM UBICACION u
            JOIN ESCUELA e ON u.id_escuela = e.id_escuela
            JOIN CENTRO c ON u.id_centro = c.id_centro
            ORDER BY u.id_ubicacion
        `);
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
        const result = await conn.execute(`
            SELECT u.*, e.nombre as escuela_nombre, c.nombre as centro_nombre
            FROM UBICACION u
            JOIN ESCUELA e ON u.id_escuela = e.id_escuela
            JOIN CENTRO c ON u.id_centro = c.id_centro
            WHERE u.id_ubicacion = :id
        `, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Ubicación no encontrada' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

// POST crear ubicación (relación escuela-centro)
router.post('/', async (req, res) => {
    let conn;
    try {
        const { id_escuela, id_centro } = req.body;
        if (!id_escuela || !id_centro) {
            return res.status(400).json({ error: 'Faltan campos: id_escuela, id_centro' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO UBICACION (id_escuela, id_centro) 
             VALUES (:id_escuela, :id_centro) 
             RETURNING id_ubicacion INTO :id`,
            {
                id_escuela, id_centro,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_ubicacion: result.outBinds.id[0], id_escuela, id_centro });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

// PUT actualizar ubicación (cambiar escuela o centro)
router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { id_escuela, id_centro } = req.body;
        if (!id_escuela || !id_centro) {
            return res.status(400).json({ error: 'Faltan campos: id_escuela, id_centro' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE UBICACION SET id_escuela = :id_escuela, id_centro = :id_centro 
             WHERE id_ubicacion = :id`,
            { id_escuela, id_centro, id: req.params.id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Ubicación no encontrada' });
        res.json({ message: 'Ubicación actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM UBICACION WHERE id_ubicacion = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Ubicación no encontrada' });
        res.json({ message: 'Ubicación eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

module.exports = router;