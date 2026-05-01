const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

// GET todas las escuelas
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM ESCUELA ORDER BY id_escuela`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// GET por ID
router.get('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM ESCUELA WHERE id_escuela = :id`, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Escuela no encontrada' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// POST crear escuela
router.post('/', async (req, res) => {
    let conn;
    try {
        const { nombre, direccion, acuerdo } = req.body;
        if (!nombre || !acuerdo) {
            return res.status(400).json({ error: 'Faltan campos: nombre, acuerdo' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO ESCUELA (nombre, direccion, acuerdo) 
             VALUES (:nombre, :direccion, :acuerdo) 
             RETURNING id_escuela INTO :id`,
            {
                nombre,
                direccion,
                acuerdo,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_escuela: result.outBinds.id[0], nombre, direccion, acuerdo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// PUT actualizar escuela
router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { nombre, direccion, acuerdo } = req.body;
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE ESCUELA SET nombre = :nombre, direccion = :direccion, acuerdo = :acuerdo 
             WHERE id_escuela = :id`,
            { nombre, direccion, acuerdo, id: req.params.id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Escuela no encontrada' });
        res.json({ message: 'Escuela actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// DELETE eliminar escuela
router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM ESCUELA WHERE id_escuela = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Escuela no encontrada' });
        res.json({ message: 'Escuela eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

module.exports = router;