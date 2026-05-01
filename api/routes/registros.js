const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

// GET todos los registros (con joins para mostrar nombres)
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`
            SELECT r.*, 
                   p.nombre_completo as persona_nombre,
                   e.nombre as escuela_nombre,
                   c.nombre as centro_nombre,
                   tl.descripcion as tipo_licencia_desc,
                   tt.nombre as tipo_tramite_nombre
            FROM REGISTRO r
            JOIN PERSONA p ON r.id_persona = p.id_persona
            JOIN UBICACION u ON r.id_ubicacion = u.id_ubicacion
            JOIN ESCUELA e ON u.id_escuela = e.id_escuela
            JOIN CENTRO c ON u.id_centro = c.id_centro
            JOIN TIPO_LICENCIA tl ON r.id_tipo_licencia = tl.id_tipo_licencia
            JOIN TIPO_TRAMITE tt ON r.id_tipo_tramite = tt.id_tipo_tramite
            ORDER BY r.id_registro
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
            SELECT r.*, 
                   p.nombre_completo as persona_nombre,
                   e.nombre as escuela_nombre,
                   c.nombre as centro_nombre
            FROM REGISTRO r
            JOIN PERSONA p ON r.id_persona = p.id_persona
            JOIN UBICACION u ON r.id_ubicacion = u.id_ubicacion
            JOIN ESCUELA e ON u.id_escuela = e.id_escuela
            JOIN CENTRO c ON u.id_centro = c.id_centro
            WHERE r.id_registro = :id
        `, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// POST crear registro (inscripción)
router.post('/', async (req, res) => {
    let conn;
    try {
        const { 
            fecha_registro, id_persona, id_ubicacion, 
            id_tipo_tramite, id_tipo_licencia, id_usuario_atendio 
        } = req.body;
        
        if (!fecha_registro || !id_persona || !id_ubicacion || !id_tipo_tramite || !id_tipo_licencia || !id_usuario_atendio) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO REGISTRO 
             (fecha_registro, id_persona, id_ubicacion, id_tipo_tramite, id_tipo_licencia, id_usuario_atendio) 
             VALUES (TO_DATE(:fecha_registro, 'YYYY-MM-DD'), :id_persona, :id_ubicacion, :id_tipo_tramite, :id_tipo_licencia, :id_usuario_atendio) 
             RETURNING id_registro INTO :id`,
            {
                fecha_registro,
                id_persona,
                id_ubicacion,
                id_tipo_tramite,
                id_tipo_licencia,
                id_usuario_atendio,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_registro: result.outBinds.id[0], ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// PUT actualizar registro
router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { 
            fecha_registro, id_persona, id_ubicacion, 
            id_tipo_tramite, id_tipo_licencia, id_usuario_atendio 
        } = req.body;
        
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE REGISTRO SET 
                fecha_registro = TO_DATE(:fecha_registro, 'YYYY-MM-DD'),
                id_persona = :id_persona,
                id_ubicacion = :id_ubicacion,
                id_tipo_tramite = :id_tipo_tramite,
                id_tipo_licencia = :id_tipo_licencia,
                id_usuario_atendio = :id_usuario_atendio
             WHERE id_registro = :id`,
            {
                fecha_registro,
                id_persona,
                id_ubicacion,
                id_tipo_tramite,
                id_tipo_licencia,
                id_usuario_atendio,
                id: req.params.id
            },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Registro no encontrado' });
        res.json({ message: 'Registro actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// DELETE eliminar registro
router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(
            `DELETE FROM REGISTRO WHERE id_registro = :id`,
            [req.params.id],
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Registro no encontrado' });
        res.json({ message: 'Registro eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

module.exports = router;