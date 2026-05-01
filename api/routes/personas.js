const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

// GET todas las personas
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`
            SELECT p.*, d.nombre as departamento_nombre, m.nombre as municipio_nombre
            FROM PERSONA p
            JOIN DEPARTAMENTO d ON p.id_departamento = d.id_departamento
            JOIN MUNICIPIO m ON p.id_municipio = m.id_municipio
            ORDER BY p.id_persona
        `);
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
        const result = await conn.execute(`
            SELECT p.*, d.nombre as departamento_nombre, m.nombre as municipio_nombre
            FROM PERSONA p
            JOIN DEPARTAMENTO d ON p.id_departamento = d.id_departamento
            JOIN MUNICIPIO m ON p.id_municipio = m.id_municipio
            WHERE p.id_persona = :id
        `, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Persona no encontrada' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// POST crear persona
router.post('/', async (req, res) => {
    let conn;
    try {
        const { 
            identificacion, nombre_completo, direccion, telefono, 
            genero, fecha_nacimiento, id_departamento, id_municipio 
        } = req.body;
        
        if (!identificacion || !nombre_completo || !id_departamento || !id_municipio) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO PERSONA 
             (identificacion, nombre_completo, direccion, telefono, genero, fecha_nacimiento, id_departamento, id_municipio) 
             VALUES (:identificacion, :nombre_completo, :direccion, :telefono, :genero, TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD'), :id_departamento, :id_municipio) 
             RETURNING id_persona INTO :id`,
            {
                identificacion, nombre_completo, direccion, telefono, genero,
                fecha_nacimiento,
                id_departamento, id_municipio,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_persona: result.outBinds.id[0], ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// PUT actualizar persona
router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { 
            identificacion, nombre_completo, direccion, telefono, 
            genero, fecha_nacimiento, id_departamento, id_municipio 
        } = req.body;
        
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE PERSONA SET 
                identificacion = :identificacion,
                nombre_completo = :nombre_completo,
                direccion = :direccion,
                telefono = :telefono,
                genero = :genero,
                fecha_nacimiento = TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD'),
                id_departamento = :id_departamento,
                id_municipio = :id_municipio
             WHERE id_persona = :id`,
            {
                identificacion, nombre_completo, direccion, telefono, genero,
                fecha_nacimiento, id_departamento, id_municipio,
                id: req.params.id
            },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Persona no encontrada' });
        res.json({ message: 'Persona actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// DELETE eliminar persona
router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(
            `DELETE FROM PERSONA WHERE id_persona = :id`,
            [req.params.id],
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Persona no encontrada' });
        res.json({ message: 'Persona eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

module.exports = router;