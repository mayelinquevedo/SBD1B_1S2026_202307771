const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

// GET todos los exámenes (con datos completos)
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`
            SELECT e.*, p.nombre_completo as persona_nombre, c.no_examen as correlativo_numero, c.fecha
            FROM EXAMEN e
            JOIN REGISTRO r ON e.id_registro = r.id_registro
            JOIN PERSONA p ON r.id_persona = p.id_persona
            JOIN CORRELATIVO c ON e.id_correlativo = c.id_correlativo
            ORDER BY e.id_examen
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
            SELECT e.*, p.nombre_completo as persona_nombre
            FROM EXAMEN e
            JOIN REGISTRO r ON e.id_registro = r.id_registro
            JOIN PERSONA p ON r.id_persona = p.id_persona
            WHERE e.id_examen = :id
        `, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Examen no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

// POST crear examen (requiere id_registro, id_correlativo, id_instructor opcional)
router.post('/', async (req, res) => {
    let conn;
    try {
        const { id_registro, id_correlativo, id_instructor, resultado_teorico, resultado_practico } = req.body;
        if (!id_registro || !id_correlativo) {
            return res.status(400).json({ error: 'Faltan campos: id_registro, id_correlativo' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO EXAMEN (id_registro, id_correlativo, id_instructor, resultado_teorico, resultado_practico) 
             VALUES (:id_registro, :id_correlativo, :id_instructor, :resultado_teorico, :resultado_practico) 
             RETURNING id_examen INTO :id`,
            {
                id_registro, id_correlativo, id_instructor, resultado_teorico, resultado_practico,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_examen: result.outBinds.id[0], id_registro, id_correlativo, id_instructor, resultado_teorico, resultado_practico });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

// PUT actualizar examen
router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { resultado_teorico, resultado_practico, id_instructor } = req.body;
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE EXAMEN SET resultado_teorico = :resultado_teorico, resultado_practico = :resultado_practico, id_instructor = :id_instructor 
             WHERE id_examen = :id`,
            { resultado_teorico, resultado_practico, id_instructor, id: req.params.id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Examen no encontrado' });
        res.json({ message: 'Examen actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM EXAMEN WHERE id_examen = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Examen no encontrado' });
        res.json({ message: 'Examen eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

module.exports = router;