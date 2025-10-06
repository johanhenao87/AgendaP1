# Modelo de datos (PostgreSQL + Prisma)

## Enums principales
- `Idioma`: `ES`, `EN`.
- `TemaUI`: `SYSTEM`, `LIGHT`, `DARK`.
- `TipoVehiculo`: `TRACTOMULA`, `DOBLE_TROQUE`, `CAMIONETA`, `SPRINTER`, `MOTO`, `OTRO`.
- `TurnoEstado`: `CREADO`, `VALIDANDO`, `CONFIRMADO`, `EN_PROCESO`, `ATENDIDO`, `CERRADO`, `RECHAZADO`, `CANCELADO_USUARIO`, `CANCELADO_ADMIN`, `NO_SHOW`.
- `TipoDocumento`: `LICENCIA`, `SOAT`, `TECNICOMECANICA`, `TARJETA_PROPIEDAD`, `CEDULA`, `OTRO`.
- `TipoRegla`: `MAX_POR_EMPRESA`, `BLOQUEO_TIPO_VEHICULO`, `PRIORIDAD_PROVEEDOR`, `DOCUMENTO_OBLIGATORIO`, `CAPACIDAD_DIA`, `CAPACIDAD_FRANJA`, `TOLERANCIA_CANCELACION`, `VENTANILLA_OBLIGATORIA`.

## Tablas núcleo
### usuarios
- `id` (PK, uuid)
- `email` (varchar(150), único, no nulo)
- `nombre` (varchar(120))
- `telefono` (varchar(20))
- `idioma` (`Idioma`, default `ES`)
- `tema_ui` (`TemaUI`, default `SYSTEM`)
- `activo` (boolean, default true)
- `created_at`, `updated_at`
- Índices: `idx_usuarios_email_unique`, `idx_usuarios_activo`

### roles
- `id` (PK)
- `nombre` (varchar(50), único) — valores: `admin`, `planner`, `operativo`, `guardia`, `usuario`
- `descripcion` (varchar(200))

### usuario_roles
- `usuario_id` (FK → usuarios.id, cascade)
- `rol_id` (FK → roles.id, restrict)
- PK compuesta `(usuario_id, rol_id)`

### empresas
- `id` (PK)
- `nit` (varchar(30), único, no nulo)
- `razon_social` (varchar(150), no nulo)
- `contacto`, `telefono`, `email`
- `activa` (boolean, default true)
- Timestamps e índices `idx_empresas_nit_unique`, `idx_empresas_activa`

### conductores
- `id` (PK)
- `cedula` (varchar(20), único, no nulo)
- `nombre` (varchar(120), no nulo)
- `telefono`, `email`
- `empresa_id` (FK → empresas.id, set null)
- `activo` (boolean, default true)
- Índices: `idx_conductores_cedula_unique`, `idx_conductores_empresa`, `idx_conductores_activo`

### vehiculos
- `id` (PK)
- `placa` (varchar(10), único, uppercase)
- `tipo` (`TipoVehiculo`, no nulo)
- `empresa_id` (FK → empresas.id, set null)
- `capacidad_tn` (numeric(6,2))
- `activo` (boolean, default true)
- Índices: `idx_vehiculos_placa_unique`, `idx_vehiculos_empresa`, `idx_vehiculos_activo`

### plantas
- `id` (PK)
- `nombre` (varchar(120), único, no nulo)
- `direccion` (varchar(200))
- `timezone` (varchar(60), default `America/Bogota`)
- `activo` (boolean, default true)

### muelles
- `id` (PK)
- `planta_id` (FK → plantas.id, cascade)
- `nombre` (varchar(60), no nulo)
- `activo` (boolean, default true)
- Índice único `(planta_id, nombre)`

### ventanillas
- Similar a muelles, opcional para prechequeo.

## Tablas de turnos y operaciones
### turnos
- `id` (PK)
- `codigo` (varchar(16), único)
- `planta_id`, `muelle_id`, `ventanilla_id`
- `empresa_id`, `conductor_id`, `vehiculo_id`
- `estado` (`TurnoEstado`)
- `fecha_hora` (timestamptz) — inicio programado
- `duracion_estimado` (interval)
- `prioridad` (smallint, default 0)
- `qr_url`, `comentarios`
- `created_at`, `updated_at`
- Índices por `planta_id`, `estado`, `fecha_hora` y parcial para estados activos.

### turnos_historial
- Registra cada transición con `estado_anterior`, `estado_nuevo`, `usuario_id`, `comentario`, `metadata` (jsonb).

### turnos_documentos
- Asociaciones con documentos requeridos (`documento_id`, `turno_id`, `estado_validacion`).

### documentos
- `id`, `tipo_documento`, `url`, `vigencia_desde`, `vigencia_hasta`, `verificado_por`, `estado`.

### reglas
- `id`, `planta_id`, `nombre`, `tipo_regla`, `condiciones_json`, `accion_json`, `prioridad`, `activa`, `vigencia_desde/hasta`.
- Índices por `planta_id`, `activa`, `tipo_regla`.

### bloqueos_calendario
- Define cierres por planta/franja: `fecha`, `hora_inicio`, `hora_fin`, `motivo`, `capacidad_restante`.

### cupos_planta
- Plantas y franjas con capacidades (`capacidad_total`, `ocupacion_actual`).

### asignaciones_muelle
- Intervalos reales de atención: `turno_id`, `muelle_id`, `inicio_real`, `fin_real`, `observaciones`.

### notificaciones
- Log de envíos: `turno_id`, `canal`, `mensaje`, `estado_envio`, `intentos`, `payload`.

### kpi_snapshots
- Métricas agregadas por día/planta: `turnos_creados`, `confirmados`, `cancelados`, `sla_promedio`, `ocupacion_promedio`.

### turno_eventos
- Trazabilidad detallada (check-in, validaciones, alertas) con `tipo_evento` y `metadata`.

## Índices recomendados
- Índice compuesto `turnos(planta_id, fecha_hora)` filtrado por estados activos.
- Índices GIN para columnas jsonb (`reglas.condiciones_json`, `accion_json`).
- Índices por `empresa_id` y `estado` en `turnos` para dashboards de planners.

## Migraciones y seed
- Prisma `schema.prisma` incluye enums y relaciones con `@@index`/`@@unique`.
- Script de seed crea roles base, planta demo, muelles, reglas iniciales y usuario admin.
