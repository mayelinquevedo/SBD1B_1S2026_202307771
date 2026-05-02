const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb'); 

// GET /api/departamentos
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`SELECT * FROM DEPARTAMENTO ORDER BY id_departamento`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// GET /api/departamentos/:id
router.get('/:id', async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT * FROM DEPARTAMENTO WHERE id_departamento = :id`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Departamento no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// POST /api/departamentos
router.post('/', async (req, res) => {
    let connection;
    try {
        const { codigo, nombre } = req.body;
        if (!codigo || !nombre) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        connection = await getConnection();
        const result = await connection.execute(
            `INSERT INTO DEPARTAMENTO (codigo, nombre) VALUES (:codigo, :nombre) RETURNING id_departamento INTO :id`,
            {
                codigo,
                nombre,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        const nuevoId = result.outBinds.id[0];
        res.status(201).json({ id_departamento: nuevoId, codigo, nombre });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// PUT /api/departamentos/:id
router.put('/:id', async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { codigo, nombre } = req.body;
        connection = await getConnection();
        const result = await connection.execute(
            `UPDATE DEPARTAMENTO SET codigo = :codigo, nombre = :nombre WHERE id_departamento = :id`,
            { codigo, nombre, id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Departamento no encontrado' });
        }
        res.json({ message: 'Departamento actualizado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// DELETE /api/departamentos/:id
router.delete('/:id', async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await getConnection();
        const result = await connection.execute(
            `DELETE FROM DEPARTAMENTO WHERE id_departamento = :id`,
            [id],
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Departamento no encontrado' });
        }
        res.json({ message: 'Departamento eliminado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

module.exports = router;