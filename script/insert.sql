
-- ============================================================
-- 4. INSERCIÓN DE DATOS DE CATÁLOGO (mínimos para pruebas)
-- ============================================================

-- Departamentos
INSERT INTO DEPARTAMENTO (codigo, nombre) VALUES ('01', 'Guatemala');
INSERT INTO DEPARTAMENTO (codigo, nombre) VALUES ('03', 'Sacatepéquez');
INSERT INTO DEPARTAMENTO (codigo, nombre) VALUES ('05', 'Escuintla');

-- Municipios (dependiendo del JSON)
INSERT INTO MUNICIPIO (codigo, nombre, id_departamento) VALUES ('01', 'Guatemala', 1);
INSERT INTO MUNICIPIO (codigo, nombre, id_departamento) VALUES ('02', 'Mixco', 1);
INSERT INTO MUNICIPIO (codigo, nombre, id_departamento) VALUES ('03', 'Villa Nueva', 1);
INSERT INTO MUNICIPIO (codigo, nombre, id_departamento) VALUES ('01', 'Escuintla', 3);
INSERT INTO MUNICIPIO (codigo, nombre, id_departamento) VALUES ('01', 'Antigua Guatemala', 2);

-- Centros
INSERT INTO CENTRO (nombre, direccion) VALUES ('Centro de Evaluación Zona 12', 'Dirección Zona 12');
INSERT INTO CENTRO (nombre, direccion) VALUES ('Centro de Evaluación Antigua Guatemala', 'Calle Real Antigua');
INSERT INTO CENTRO (nombre, direccion) VALUES ('Centro de Evaluación Escuintla', 'Avenida Centroamericana');

-- Escuelas
INSERT INTO ESCUELA (nombre, direccion, acuerdo) VALUES ('Escuela de Manejo AutoMaster', 'Avenida Reforma 15-45, Zona 10', 'ESC-AM-001');
INSERT INTO ESCUELA (nombre, direccion, acuerdo) VALUES ('Academia Vial GuateDrive', 'Boulevard Los Próceres 18-20, Zona 10', 'ESC-GD-002');
INSERT INTO ESCUELA (nombre, direccion, acuerdo) VALUES ('Instituto de Conducción Segura', 'Calzada Roosevelt 25-30, Zona 11', 'ESC-ICS-003');

-- Ubicaciones (relaciones)
INSERT INTO UBICACION (id_escuela, id_centro) VALUES (1,1);
INSERT INTO UBICACION (id_escuela, id_centro) VALUES (1,2);
INSERT INTO UBICACION (id_escuela, id_centro) VALUES (2,1);
INSERT INTO UBICACION (id_escuela, id_centro) VALUES (3,2);
INSERT INTO UBICACION (id_escuela, id_centro) VALUES (3,3);

-- Tipos de licencia
INSERT INTO TIPO_LICENCIA (codigo, descripcion) VALUES ('M', 'Moto');
INSERT INTO TIPO_LICENCIA (codigo, descripcion) VALUES ('P', 'Particular');
INSERT INTO TIPO_LICENCIA (codigo, descripcion) VALUES ('B', 'Liviana');
INSERT INTO TIPO_LICENCIA (codigo, descripcion) VALUES ('A', 'Profesional');
INSERT INTO TIPO_LICENCIA (codigo, descripcion) VALUES ('E', 'Agrícola');

-- Tipos de trámite
INSERT INTO TIPO_TRAMITE (nombre) VALUES ('Primera licencia');
INSERT INTO TIPO_TRAMITE (nombre) VALUES ('Cambio de tipo');

-- Usuarios (personal ejemplo)
INSERT INTO USUARIO (identificacion, nombre_completo, rol) VALUES ('USR001', 'Ana Pérez', 'Recepcionista');
INSERT INTO USUARIO (identificacion, nombre_completo, rol) VALUES ('USR002', 'Luis Gómez', 'Evaluador');

-- Instructores
INSERT INTO INSTRUCTOR (identificacion, nombre_completo, especialidad) VALUES ('INS001', 'Carlos Méndez', 'Conducción práctica');
INSERT INTO INSTRUCTOR (identificacion, nombre_completo, especialidad) VALUES ('INS002', 'María López', 'Evaluación de maniobras');

-- Personas (aspirantes) - algunos ejemplos para pruebas
INSERT INTO PERSONA (identificacion, nombre_completo, direccion, telefono, genero, fecha_nacimiento, id_departamento, id_municipio)
VALUES ('DPI123456', 'Juan Carlos López García', 'Zona 12, Guatemala', '5551-2345', 'M', TO_DATE('1990-05-15','YYYY-MM-DD'), 1, 1);
INSERT INTO PERSONA (identificacion, nombre_completo, direccion, telefono, genero, fecha_nacimiento, id_departamento, id_municipio)
VALUES ('DPI789012', 'María Elena Rodríguez Morales', 'Mixco, Guatemala', '5552-3456', 'F', TO_DATE('1985-08-20','YYYY-MM-DD'), 1, 2);

-- Registros (inscripciones)
INSERT INTO REGISTRO (fecha_registro, id_persona, id_ubicacion, id_tipo_tramite, id_tipo_licencia, id_usuario_atendio)
VALUES (TO_DATE('2025-01-15','YYYY-MM-DD'), 1, 1, 1, 4, 1);   -- Juan, Profesional
INSERT INTO REGISTRO (fecha_registro, id_persona, id_ubicacion, id_tipo_tramite, id_tipo_licencia, id_usuario_atendio)
VALUES (TO_DATE('2025-01-15','YYYY-MM-DD'), 2, 2, 1, 3, 1);   -- María, Liviana

-- Correlativos diarios (ejemplo)
INSERT INTO CORRELATIVO (fecha, no_examen) VALUES (TO_DATE('2025-01-15','YYYY-MM-DD'), 1);
INSERT INTO CORRELATIVO (fecha, no_examen) VALUES (TO_DATE('2025-01-15','YYYY-MM-DD'), 2);
INSERT INTO CORRELATIVO (fecha, no_examen) VALUES (TO_DATE('2025-01-16','YYYY-MM-DD'), 1);

-- Exámenes
INSERT INTO EXAMEN (id_registro, id_correlativo, fecha_hora, id_instructor)
VALUES (1, 1, TIMESTAMP '2025-01-15 09:30:00', 1);
INSERT INTO EXAMEN (id_registro, id_correlativo, fecha_hora, id_instructor)
VALUES (2, 2, TIMESTAMP '2025-01-15 10:45:00', 2);

-- Preguntas teóricas (ejemplo extraído del JSON)
INSERT INTO PREGUNTA_TEORICA (texto, respuesta_a, respuesta_b, respuesta_c, respuesta_d, opcion_correcta)
VALUES ('¿Cuál es la distancia mínima que debe mantener entre vehículos en carretera?',
        '2 metros', '3 segundos de distancia', '5 metros', '1 segundo de distancia', 'B');
INSERT INTO PREGUNTA_TEORICA (texto, respuesta_a, respuesta_b, respuesta_c, respuesta_d, opcion_correcta)
VALUES ('¿Qué significa una señal de alto?',
        'Reducir velocidad', 'Detenerse completamente', 'Ceder el paso', 'Continuar con precaución', 'B');

-- Preguntas prácticas
INSERT INTO PREGUNTA_PRACTICA (texto, punteo_maximo) VALUES ('Estacionamiento en paralelo', 20);
INSERT INTO PREGUNTA_PRACTICA (texto, punteo_maximo) VALUES ('Conducir en reversa 50m', 15);

COMMIT;