const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM USUARIO ORDER BY id_usuario`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.get('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM USUARIO WHERE id_usuario = :id`, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.post('/', async (req, res) => {
    let conn;
    try {
        const { identificacion, nombre_completo, rol } = req.body;
        if (!identificacion || !nombre_completo) {
            return res.status(400).json({ error: 'Faltan campos: identificacion, nombre_completo' });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `INSERT INTO USUARIO (identificacion, nombre_completo, rol) 
             VALUES (:identificacion, :nombre_completo, :rol) 
             RETURNING id_usuario INTO :id`,
            {
                identificacion, nombre_completo, rol,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );
        res.status(201).json({ id_usuario: result.outBinds.id[0], identificacion, nombre_completo, rol });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { identificacion, nombre_completo, rol } = req.body;
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE USUARIO SET identificacion = :identificacion, nombre_completo = :nombre_completo, rol = :rol 
             WHERE id_usuario = :id`,
            { identificacion, nombre_completo, rol, id: req.params.id },
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM USUARIO WHERE id_usuario = :id`, [req.params.id], { autoCommit: true });
        if (result.rowsAffected === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally { if (conn) await conn.close(); }
});

module.exports = router;