
-- 4. INSERCIONES DE DATOS (DML)
-- DEPARTAMENTOS
INSERT INTO DEPARTAMENTO (codigo, nombre) VALUES ('01', 'Guatemala');
INSERT INTO DEPARTAMENTO (codigo, nombre) VALUES ('03', 'Sacatepéquez');
INSERT INTO DEPARTAMENTO (codigo, nombre) VALUES ('05', 'Escuintla');


SELECT * FROM DEPARTAMENTO;


-- MUNICIPIOS
INSERT INTO MUNICIPIO (codigo, nombre, id_departamento) VALUES ('01', 'Guatemala', (SELECT id_departamento FROM DEPARTAMENTO WHERE codigo='01'));
INSERT INTO MUNICIPIO (codigo, nombre, id_departamento) VALUES ('02', 'Mixco', (SELECT id_departamento FROM DEPARTAMENTO WHERE codigo='01'));
INSERT INTO MUNICIPIO (codigo, nombre, id_departamento) VALUES ('03', 'Villa Nueva', (SELECT id_departamento FROM DEPARTAMENTO WHERE codigo='01'));
INSERT INTO MUNICIPIO (codigo, nombre, id_departamento) VALUES ('01', 'Escuintla', (SELECT id_departamento FROM DEPARTAMENTO WHERE codigo='05'));
INSERT INTO MUNICIPIO (codigo, nombre, id_departamento) VALUES ('01', 'Antigua Guatemala', (SELECT id_departamento FROM DEPARTAMENTO WHERE codigo='03'));

-- CENTROS


INSERT INTO CENTRO (nombre, direccion) VALUES ('Centro de Evaluación ','Zona 12');
INSERT INTO CENTRO (nombre, direccion) VALUES ('Centro de Evaluación' , 'Antigua Guatemala');
INSERT INTO CENTRO (nombre, direccion) VALUES ('Centro de Evaluación' , 'Escuintla');

-- ESCUELAS
INSERT INTO ESCUELA (nombre, direccion, acuerdo) VALUES ('Escuela de Manejo AutoMaster', 'Avenida Reforma 15-45, Zona 10', 'ESC-AM-001');
INSERT INTO ESCUELA (nombre, direccion, acuerdo) VALUES ('Academia Vial GuateDrive', 'Boulevard Los Próceres 18-20, Zona 10', 'ESC-GD-002');
INSERT INTO ESCUELA (nombre, direccion, acuerdo) VALUES ('Instituto de Conducción Segura', 'Calzada Roosevelt 25-30, Zona 11', 'ESC-ICS-003');

-- TIPOS DE LICENCIA
INSERT INTO TIPO_LICENCIA (codigo, descripcion) VALUES ('A', 'Profesional');
INSERT INTO TIPO_LICENCIA (codigo, descripcion) VALUES ('B', 'Liviana');

-- TIPO TRÁMITE
INSERT INTO TIPO_TRAMITE (nombre) VALUES ('Licencia de Conducir');

-- USUARIO POR DEFECTO
INSERT INTO USUARIO (identificacion, nombre_completo, rol) VALUES ('SISTEMA', 'Sistema Automático', 'Administrador');

-- INSTRUCTOR (vacío, no hay datos en JSON)



-- UBICACIONES (según JSON + la necesaria para Pedro)
DELETE FROM UBICACION;
SELECT * FROM UBICACION;
INSERT INTO UBICACION (id_escuela, id_centro) VALUES (1,1);
INSERT INTO UBICACION (id_escuela, id_centro) VALUES (1,2);
INSERT INTO UBICACION (id_escuela, id_centro) VALUES (2,1);
INSERT INTO UBICACION (id_escuela, id_centro) VALUES (2,2);  -- necesaria para Pedro
INSERT INTO UBICACION (id_escuela, id_centro) VALUES (3,2);
INSERT INTO UBICACION (id_escuela, id_centro) VALUES (3,3);


-- PERSONAS
INSERT INTO PERSONA (identificacion, nombre_completo, genero, id_departamento, id_municipio, fecha_nacimiento)
VALUES ('PERS001', 'Juan Carlos López García', 'M', (SELECT id_departamento FROM DEPARTAMENTO WHERE codigo='01'), (SELECT id_municipio FROM MUNICIPIO WHERE nombre='Guatemala'), TO_DATE('1990-01-01','YYYY-MM-DD'));
INSERT INTO PERSONA (identificacion, nombre_completo, genero, id_departamento, id_municipio, fecha_nacimiento)
VALUES ('PERS002', 'María Elena Rodríguez Morales', 'F', (SELECT id_departamento FROM DEPARTAMENTO WHERE codigo='01'), (SELECT id_municipio FROM MUNICIPIO WHERE nombre='Mixco'), TO_DATE('1985-01-01','YYYY-MM-DD'));
INSERT INTO PERSONA (identificacion, nombre_completo, genero, id_departamento, id_municipio, fecha_nacimiento)
VALUES ('PERS003', 'Carlos Alberto Méndez Castillo', 'M', (SELECT id_departamento FROM DEPARTAMENTO WHERE codigo='01'), (SELECT id_municipio FROM MUNICIPIO WHERE nombre='Villa Nueva'), TO_DATE('1992-01-01','YYYY-MM-DD'));
INSERT INTO PERSONA (identificacion, nombre_completo, genero, id_departamento, id_municipio, fecha_nacimiento)
VALUES ('PERS004', 'Ana Sofía Guerrero Díaz', 'F', (SELECT id_departamento FROM DEPARTAMENTO WHERE codigo='05'), (SELECT id_municipio FROM MUNICIPIO WHERE nombre='Escuintla'), TO_DATE('1988-01-01','YYYY-MM-DD'));
INSERT INTO PERSONA (identificacion, nombre_completo, genero, id_departamento, id_municipio, fecha_nacimiento)
VALUES ('PERS005', 'Pedro José Hernández Ruiz', 'M', (SELECT id_departamento FROM DEPARTAMENTO WHERE codigo='03'), (SELECT id_municipio FROM MUNICIPIO WHERE nombre='Antigua Guatemala'), TO_DATE('1995-01-01','YYYY-MM-DD'));

-- REGISTROS (5 según el JSON)
INSERT INTO REGISTRO (fecha_registro, id_persona, id_ubicacion, id_tipo_tramite, id_tipo_licencia, id_usuario_atendio)
SELECT TO_DATE('2025-01-15','YYYY-MM-DD'), 
       (SELECT id_persona FROM PERSONA WHERE nombre_completo='Juan Carlos López García'),
       (SELECT id_ubicacion FROM UBICACION WHERE id_escuela=1 AND id_centro=1),
       (SELECT id_tipo_tramite FROM TIPO_TRAMITE WHERE nombre='Licencia de Conducir'),
       (SELECT id_tipo_licencia FROM TIPO_LICENCIA WHERE codigo='A'),
       (SELECT id_usuario FROM USUARIO WHERE identificacion='SISTEMA')
FROM DUAL;

INSERT INTO REGISTRO (fecha_registro, id_persona, id_ubicacion, id_tipo_tramite, id_tipo_licencia, id_usuario_atendio)
SELECT TO_DATE('2025-01-15','YYYY-MM-DD'), 
       (SELECT id_persona FROM PERSONA WHERE nombre_completo='María Elena Rodríguez Morales'),
       (SELECT id_ubicacion FROM UBICACION WHERE id_escuela=1 AND id_centro=2),
       (SELECT id_tipo_tramite FROM TIPO_TRAMITE WHERE nombre='Licencia de Conducir'),
       (SELECT id_tipo_licencia FROM TIPO_LICENCIA WHERE codigo='B'),
       (SELECT id_usuario FROM USUARIO WHERE identificacion='SISTEMA')
FROM DUAL;

INSERT INTO REGISTRO (fecha_registro, id_persona, id_ubicacion, id_tipo_tramite, id_tipo_licencia, id_usuario_atendio)
SELECT TO_DATE('2025-01-16','YYYY-MM-DD'), 
       (SELECT id_persona FROM PERSONA WHERE nombre_completo='Carlos Alberto Méndez Castillo'),
       (SELECT id_ubicacion FROM UBICACION WHERE id_escuela=2 AND id_centro=1),
       (SELECT id_tipo_tramite FROM TIPO_TRAMITE WHERE nombre='Licencia de Conducir'),
       (SELECT id_tipo_licencia FROM TIPO_LICENCIA WHERE codigo='A'),
       (SELECT id_usuario FROM USUARIO WHERE identificacion='SISTEMA')
FROM DUAL;

INSERT INTO REGISTRO (fecha_registro, id_persona, id_ubicacion, id_tipo_tramite, id_tipo_licencia, id_usuario_atendio)
SELECT TO_DATE('2025-01-17','YYYY-MM-DD'), 
       (SELECT id_persona FROM PERSONA WHERE nombre_completo='Ana Sofía Guerrero Díaz'),
       (SELECT id_ubicacion FROM UBICACION WHERE id_escuela=3 AND id_centro=3),
       (SELECT id_tipo_tramite FROM TIPO_TRAMITE WHERE nombre='Licencia de Conducir'),
       (SELECT id_tipo_licencia FROM TIPO_LICENCIA WHERE codigo='A'),
       (SELECT id_usuario FROM USUARIO WHERE identificacion='SISTEMA')
FROM DUAL;

INSERT INTO REGISTRO (fecha_registro, id_persona, id_ubicacion, id_tipo_tramite, id_tipo_licencia, id_usuario_atendio)
SELECT TO_DATE('2025-01-18','YYYY-MM-DD'), 
       (SELECT id_persona FROM PERSONA WHERE nombre_completo='Pedro José Hernández Ruiz'),
       (SELECT id_ubicacion FROM UBICACION WHERE id_escuela=2 AND id_centro=2),
       (SELECT id_tipo_tramite FROM TIPO_TRAMITE WHERE nombre='Licencia de Conducir'),
       (SELECT id_tipo_licencia FROM TIPO_LICENCIA WHERE codigo='B'),
       (SELECT id_usuario FROM USUARIO WHERE identificacion='SISTEMA')
FROM DUAL;

COMMIT;

-- CORRELATIVOS
INSERT INTO CORRELATIVO (fecha, no_examen) VALUES (TO_DATE('2025-01-15','YYYY-MM-DD'), 1);
INSERT INTO CORRELATIVO (fecha, no_examen) VALUES (TO_DATE('2025-01-15','YYYY-MM-DD'), 2);
INSERT INTO CORRELATIVO (fecha, no_examen) VALUES (TO_DATE('2025-01-16','YYYY-MM-DD'), 3);
INSERT INTO CORRELATIVO (fecha, no_examen) VALUES (TO_DATE('2025-01-17','YYYY-MM-DD'), 4);
INSERT INTO CORRELATIVO (fecha, no_examen) VALUES (TO_DATE('2025-01-18','YYYY-MM-DD'), 5);

-- EXÁMENES
INSERT INTO EXAMEN (id_registro, id_correlativo, fecha_hora)
SELECT r.id_registro, c.id_correlativo, TIMESTAMP '2025-01-15 09:30:00'
FROM REGISTRO r, CORRELATIVO c
WHERE r.id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='Juan Carlos López García')
  AND c.fecha = TO_DATE('2025-01-15','YYYY-MM-DD') AND c.no_examen = 1;

INSERT INTO EXAMEN (id_registro, id_correlativo, fecha_hora)
SELECT r.id_registro, c.id_correlativo, TIMESTAMP '2025-01-15 10:45:00'
FROM REGISTRO r, CORRELATIVO c
WHERE r.id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='María Elena Rodríguez Morales')
  AND c.fecha = TO_DATE('2025-01-15','YYYY-MM-DD') AND c.no_examen = 2;

INSERT INTO EXAMEN (id_registro, id_correlativo, fecha_hora)
SELECT r.id_registro, c.id_correlativo, TIMESTAMP '2025-01-16 11:00:00'
FROM REGISTRO r, CORRELATIVO c
WHERE r.id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='Carlos Alberto Méndez Castillo')
  AND c.fecha = TO_DATE('2025-01-16','YYYY-MM-DD') AND c.no_examen = 3;

INSERT INTO EXAMEN (id_registro, id_correlativo, fecha_hora)
SELECT r.id_registro, c.id_correlativo, TIMESTAMP '2025-01-17 09:00:00'
FROM REGISTRO r, CORRELATIVO c
WHERE r.id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='Ana Sofía Guerrero Díaz')
  AND c.fecha = TO_DATE('2025-01-17','YYYY-MM-DD') AND c.no_examen = 4;

INSERT INTO EXAMEN (id_registro, id_correlativo, fecha_hora)
SELECT r.id_registro, c.id_correlativo, TIMESTAMP '2025-01-18 08:30:00'
FROM REGISTRO r, CORRELATIVO c
WHERE r.id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='Pedro José Hernández Ruiz')
  AND c.fecha = TO_DATE('2025-01-18','YYYY-MM-DD') AND c.no_examen = 5;

COMMIT;


SELECT * FROM PREGUNTA_TEORICA;
DELETE  FROM PREGUNTA_TEORICA ;
-- PREGUNTAS TEÓRICAS
INSERT INTO PREGUNTA_TEORICA (texto, respuesta_a, respuesta_b, respuesta_c, respuesta_d, opcion_correcta) VALUES
('¿Cuál es la distancia mínima que debe mantener entre vehículos en carretera?', '2 metros', '3 segundos de distancia', '5 metros', '1 segundo de distancia', 'B');
INSERT INTO PREGUNTA_TEORICA (texto, respuesta_a, respuesta_b, respuesta_c, respuesta_d, opcion_correcta) VALUES
('¿Qué significa una señal de alto?', 'Reducir velocidad', 'Detenerse completamente', 'Ceder el paso', 'Continuar con precaución', 'B');
INSERT INTO PREGUNTA_TEORICA (texto, respuesta_a, respuesta_b, respuesta_c, respuesta_d, opcion_correcta) VALUES
('¿Cuál es el límite de velocidad en zona escolar?', '20 km/h', '30 km/h', '40 km/h', '50 km/h', 'A');
INSERT INTO PREGUNTA_TEORICA (texto, respuesta_a, respuesta_b, respuesta_c, respuesta_d, opcion_correcta) VALUES
('¿Qué debe hacer al ver una ambulancia con sirena activada?', 'Mantener velocidad', 'Acelerar para salir del camino', 'Orillarse y detenerse', 'Ignorar la sirena', 'C');

-- PREGUNTAS PRÁCTICAS
DELETE  FROM PREGUNTA_PRACTICA  ;
INSERT INTO PREGUNTA_PRACTICA (texto, punteo_maximo) VALUES ('Realizar estacionamiento en paralelo en un espacio de 6 metros', 20);
INSERT INTO PREGUNTA_PRACTICA (texto, punteo_maximo) VALUES ('Conducir en reversa por 50 metros manteniendo trayectoria recta', 15);
INSERT INTO PREGUNTA_PRACTICA (texto, punteo_maximo) VALUES ('Maniobra de tres puntos en espacio reducido', 25);
INSERT INTO PREGUNTA_PRACTICA (texto, punteo_maximo) VALUES ('Conducción en zona urbana respetando señales de tránsito', 30);

-- RESPUESTAS TEÓRICAS (según JSON)
-- Examen 1 - pregunta 1
INSERT INTO RESPUESTA_TEORICA (id_examen, id_pregunta_teorica, respuesta_seleccionada, es_correcta, puntos_obtenidos)
SELECT e.id_examen, p.id_pregunta_teorica, 'B', 1, 4
FROM EXAMEN e, PREGUNTA_TEORICA p
WHERE e.id_registro = (SELECT id_registro FROM REGISTRO WHERE id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='Juan Carlos López García'))
  AND p.texto LIKE '¿Cuál es la distancia mínima%';

-- Examen 1 - pregunta 2
INSERT INTO RESPUESTA_TEORICA (id_examen, id_pregunta_teorica, respuesta_seleccionada, es_correcta, puntos_obtenidos)
SELECT e.id_examen, p.id_pregunta_teorica, 'B', 1, 4
FROM EXAMEN e, PREGUNTA_TEORICA p
WHERE e.id_registro = (SELECT id_registro FROM REGISTRO WHERE id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='Juan Carlos López García'))
  AND p.texto LIKE '¿Qué significa una señal de alto%';

-- Examen 2 - pregunta 3
INSERT INTO RESPUESTA_TEORICA (id_examen, id_pregunta_teorica, respuesta_seleccionada, es_correcta, puntos_obtenidos)
SELECT e.id_examen, p.id_pregunta_teorica, 'A', 1, 4
FROM EXAMEN e, PREGUNTA_TEORICA p
WHERE e.id_registro = (SELECT id_registro FROM REGISTRO WHERE id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='María Elena Rodríguez Morales'))
  AND p.texto = '¿Cuál es el límite de velocidad en zona escolar?';

-- Examen 2 - pregunta 4
INSERT INTO RESPUESTA_TEORICA (id_examen, id_pregunta_teorica, respuesta_seleccionada, es_correcta, puntos_obtenidos)
SELECT e.id_examen, p.id_pregunta_teorica, 'C', 1, 4
FROM EXAMEN e, PREGUNTA_TEORICA p
WHERE e.id_registro = (SELECT id_registro FROM REGISTRO WHERE id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='María Elena Rodríguez Morales'))
  AND p.texto LIKE '¿Qué debe hacer al ver una ambulancia%';

-- Examen 3 - pregunta 1
INSERT INTO RESPUESTA_TEORICA (id_examen, id_pregunta_teorica, respuesta_seleccionada, es_correcta, puntos_obtenidos)
SELECT e.id_examen, p.id_pregunta_teorica, 'B', 1, 4
FROM EXAMEN e, PREGUNTA_TEORICA p
WHERE e.id_registro = (SELECT id_registro FROM REGISTRO WHERE id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='Carlos Alberto Méndez Castillo'))
  AND p.texto LIKE '¿Cuál es la distancia mínima%';

-- Examen 3 - pregunta 2 (incorrecta)
INSERT INTO RESPUESTA_TEORICA (id_examen, id_pregunta_teorica, respuesta_seleccionada, es_correcta, puntos_obtenidos)
SELECT e.id_examen, p.id_pregunta_teorica, 'A', 0, 0
FROM EXAMEN e, PREGUNTA_TEORICA p
WHERE e.id_registro = (SELECT id_registro FROM REGISTRO WHERE id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='Carlos Alberto Méndez Castillo'))
  AND p.texto LIKE '¿Qué significa una señal de alto%';

COMMIT;

-- RESPUESTAS PRÁCTICAS
-- Examen 1 - práctica 1 (paralelo) nota 18
-- Examen 1 - práctica 1
INSERT INTO RESPUESTA_PRACTICA (id_examen, id_pregunta_practica, nota_obtenida)
SELECT e.id_examen, p.id_pregunta_practica, 18
FROM EXAMEN e, PREGUNTA_PRACTICA p
WHERE e.id_registro = (SELECT id_registro FROM REGISTRO WHERE id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='Juan Carlos López García'))
  AND p.texto LIKE 'Realizar estacionamiento%';

-- Examen 1 - práctica 2
INSERT INTO RESPUESTA_PRACTICA (id_examen, id_pregunta_practica, nota_obtenida)
SELECT e.id_examen, p.id_pregunta_practica, 13
FROM EXAMEN e, PREGUNTA_PRACTICA p
WHERE e.id_registro = (SELECT id_registro FROM REGISTRO WHERE id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='Juan Carlos López García'))
  AND p.texto LIKE 'Conducir en reversa%';

-- Examen 2 - práctica 3
INSERT INTO RESPUESTA_PRACTICA (id_examen, id_pregunta_practica, nota_obtenida)
SELECT e.id_examen, p.id_pregunta_practica, 22
FROM EXAMEN e, PREGUNTA_PRACTICA p
WHERE e.id_registro = (SELECT id_registro FROM REGISTRO WHERE id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='María Elena Rodríguez Morales'))
  AND p.texto LIKE 'Maniobra de tres puntos%';

-- Examen 2 - práctica 4
INSERT INTO RESPUESTA_PRACTICA (id_examen, id_pregunta_practica, nota_obtenida)
SELECT e.id_examen, p.id_pregunta_practica, 28
FROM EXAMEN e, PREGUNTA_PRACTICA p
WHERE e.id_registro = (SELECT id_registro FROM REGISTRO WHERE id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='María Elena Rodríguez Morales'))
  AND p.texto LIKE 'Conducción en zona urbana%';

-- Examen 3 - práctica 1
INSERT INTO RESPUESTA_PRACTICA (id_examen, id_pregunta_practica, nota_obtenida)
SELECT e.id_examen, p.id_pregunta_practica, 15
FROM EXAMEN e, PREGUNTA_PRACTICA p
WHERE e.id_registro = (SELECT id_registro FROM REGISTRO WHERE id_persona = (SELECT id_persona FROM PERSONA WHERE nombre_completo='Carlos Alberto Méndez Castillo'))
  AND p.texto LIKE 'Realizar estacionamiento%';

COMMIT;
