const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

// GET todos los municipios
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`
            SELECT m.*, d.nombre as departamento_nombre
            FROM MUNICIPIO m
            JOIN DEPARTAMENTO d ON m.id_departamento = d.id_departamento
            ORDER BY m.id_municipio
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
            SELECT m.*, d.nombre as departamento_nombre
            FROM MUNICIPIO m
            JOIN DEPARTAMENTO d ON m.id_departamento = d.id_departamento
            WHERE m.id_municipio = :id
        `, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Municipio no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

// POST
router.post('/', async (req, res) => {
    let conn;
    try {
        const { codigo, nombre, id_departamento } = req.body;
        if (!codigo || !nombre || !id_departamento) {
            return res.status(400).json({ error: 'Faltan campos: codigo, nombre, id_departamento' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO MUNICIPIO (codigo, nombre, id_departamento) 
             VALUES (:codigo, :nombre, :id_departamento) 
             RETURNING id_municipio INTO :id`,
            {
                codigo, nombre, id_departamento,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_municipio: result.outBinds.id[0], codigo, nombre, id_departamento });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

// PUT
router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { codigo, nombre, id_departamento } = req.body;
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE MUNICIPIO SET codigo = :codigo, nombre = :nombre, id_departamento = :id_departamento 
             WHERE id_municipio = :id`,
            { codigo, nombre, id_departamento, id: req.params.id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Municipio no encontrado' });
        res.json({ message: 'Municipio actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM MUNICIPIO WHERE id_municipio = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Municipio no encontrado' });
        res.json({ message: 'Municipio eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

module.exports = router;