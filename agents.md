Agendamiento Planta 1

1) Objetivo del proyecto

Construir un sistema web completo para agendamiento de turnos de vehículos en planta (recepción, control de acceso, ventanillas, muelles), con:

Panel público/usuario (conductores o empresas transportadoras) para solicitar, ver, cancelar y reprogramar turnos.

Panel interno/administración para orquestar reglas, cupos, validaciones, priorizaciones y monitoreo en tiempo real.

Motor de reglas configurable (por planta, día, franja horaria, tipo de vehículo, proveedor, urgencias, etc.).

Notificaciones (WhatsApp, email, SMS opcional).

KPIs y simuladores (capacidad vs demanda, SLA de atención, cuellos de botella, cumplimiento por proveedor).

Auditoría y trazabilidad completa.

2) Principios de diseño de la app (UI/UX)

Diseño pulido, profesional y artístico, con tema claro/oscuro y paletas alternativas.

Mobile-first (conductores usan teléfono), responsive total (desktop para planners).

Accesible (contraste AA, navegación por teclado, labels/aria), microinteracciones sutiles (framer-motion).

Simplicidad de flujo: crear turno en ≤ 3 pasos; estado del turno siempre visible; errores explicados en lenguaje llano.

Idiomas: ES/EN de base (i18n listo para más).

3) Arquitectura y stack recomendado

Frontend: Next.js 15 + React 19 (App Router), TypeScript, TailwindCSS, shadcn/ui, Framer Motion, React Query/TanStack Query, i18next (next-i18next).

Backend: Next.js (rutas /api) + Prisma ORM + Zod para validaciones, tsoa opcional para OpenAPI; colas con BullMQ (Redis).

BD: PostgreSQL 15.

Cache/colas: Redis.

Auth: Auth.js (NextAuth) con JWT y Providers (credenciales corporativas/SSO OIDC si aplica); 2FA opcional.

Mensajería: Webhook + servicio WhatsApp (wbot / WhatsApp Business API) y SMTP para email.

Infra: VPS Ubuntu 24.04, Docker Compose (reverse proxy Caddy o Nginx), PM2 opcional para scripts, backups automáticos (pg_dump + restic).

Observabilidad: pino + pino-pretty, OpenTelemetry (traces), Healthchecks, Sentry (errores).

Pruebas: Vitest/Playwright (E2E), Jest si prefieres, Prisma test utils, factory-bot.

Estándares: ESLint + Prettier + Husky (pre-commit), conventional commits, CI/CD (GitHub Actions).

Seguridad: rate limiting (Upstash/Redis), CORS, Helmet, validación Zod en todas las entradas, cifrado de secretos (Dotenv + SOPS si hay multi-entorno).

4) Estructura de repositorio (monorepo simple)
/agendamiento
  /app                # Next.js (frontend + APIs)
    /app              # rutas (UI y server actions)
    /pages            # si usas pages para fallback
    /components
    /styles
    /lib              # sdk http, utils, auth, i18n
    /server           # servicios, casos de uso
    /features         # dominios: turnos, reglas, etc.
    /api              # rutas rest si prefieres /api
  /prisma             # esquema, migraciones, seeders
  /packages
    /ui               # librería UI compartida (opcional)
    /config           # eslint, tsconfig, tailwind preset
  /deploy             # docker, compose, caddy, scripts
  /tests              # e2e, contract tests

5) Estados del turno (máquina de estados)

CREADO → VALIDANDO → CONFIRMADO → EN_PROCESO → ATENDIDO → CERRADO

Ramas de excepción:

RECHAZADO (regla/validación fallida)

CANCELADO_USUARIO

CANCELADO_ADMIN

NO_SHOW

Transiciones controladas por casos de uso y motor de reglas (con logs de auditoría).

6) Integraciones (plan base)

WhatsApp: confirmaciones, recordatorios, cambios de estado, link mágico a la cita.

Email: confirmaciones formales a empresas.

Webhooks: hacia Power Automate/n8n para flujos externos (ERP, guardas, portería).

Impresión: PDF de pase/QR para acceso (jsPDF o server-side con Playwright/Puppeteer).

7) Seguridad y cumplimiento

Logs de auditoría con usuario, IP, acción, antes/después.

PII mínima: cédula y placa con hashing reversible opcional, cifrado en reposo para campos sensibles.

RBAC (roles): admin, planner, operativo, guardia, usuario.

Modo “solo lectura” para auditorías.

Backups: diarios + retención 30/90 días; restauración validada.

Bloque 2 — Modelo de Datos (PostgreSQL + Prisma) (próximo paso)

Incluye todas las tablas, columnas, tipos, índices y relaciones. Te adelanto la lista y, si confirmas, te doy cada tabla con detalle de columnas (nombre, tipo, nullability, default, índice, FK) y los enums.

Tablas núcleo

usuarios (cuentas del sistema)

roles y usuario_roles (RBAC)

empresas (transportadoras/proveedores)

conductores

vehiculos

plantas (sede, muelles, ventanillas)

requisitos_documentales (SOAT, licencia, etc.)

documentos_conductor / documentos_vehiculo

turnos (la cita/slot)

turno_eventos (histórico de estados)

tipos_turno (descarga, cargue, especial)

reglas_agendamiento (motor de reglas)

parametros_agendamiento (cupos, ventanas, SLA)

bloqueos_calendario (feriados, mantenimientos)

asignaciones_muelle (slot físico)

notificaciones (WA/email/SMS)

webhooks_outbox (eventos a integrar, patrón outbox)

kpi_snapshots (agregados diarios/horarios)

auditoria (trazabilidad de cambios)

archivos (PDF/soportes; S3-compatible si se usa)

Enums clave

TurnoEstado, TurnoMotivoCancelacion, CanalNotificacion, TipoDocumento, TipoVehiculo, PrioridadTurno, Idioma, TemaUI.

Índices

Búsquedas por placa, cedula, fecha_hora, planta_id, estado.

Índices parciales para turnos por estado activo.

FKs con ON UPDATE CASCADE, ON DELETE RESTRICT (o SET NULL según el caso).


Bloque 2 — Modelo de Datos
2.1 — Enums (PostgreSQL / Prisma)

TurnoEstado: CREADO | VALIDANDO | CONFIRMADO | EN_PROCESO | ATENDIDO | CERRADO | RECHAZADO | CANCELADO_USUARIO | CANCELADO_ADMIN | NO_SHOW

MotivoCancelacion: USUARIO | ADMIN | CLIMA | MANTENIMIENTO | DOCUMENTOS | CAPACIDAD | OTRO

CanalNotificacion: WHATSAPP | EMAIL | SMS | PUSH

TipoDocumento: LICENCIA | SOAT | TECNICOMECANICA | TARJETA_PROPIEDAD | CEDULA | OTRO

TipoVehiculo: CAMIONETA | RIGIDO | TRACTO | DOBLETROQUE | MOTO | OTRO

PrioridadTurno: NORMAL | ALTA | URGENTE

Idioma: ES | EN

TemaUI: SYSTEM | LIGHT | DARK

2.2 — Tablas Núcleo
1) usuarios

id (PK, serial/bigserial)

email (varchar(150), unique, not null)

password_hash (varchar(255), nullable si SSO)

nombre (varchar(120), not null)

telefono (varchar(20), null)

idioma (enum Idioma, default ES)

tema_ui (enum TemaUI, default SYSTEM)

activo (boolean, default true)

created_at (timestamptz, default now())

updated_at (timestamptz)
Índices: idx_usuarios_email_unique, idx_usuarios_activo

2) roles

id (PK)

nombre (varchar(50), unique: admin, planner, operativo, guardia, usuario)

descripcion (varchar(200))
Índices: idx_roles_nombre_unique

3) usuario_roles (bridge RBAC)

usuario_id (FK → usuarios.id, on delete cascade)

rol_id (FK → roles.id, on delete restrict)
PK compuesta: (usuario_id, rol_id)

4) empresas

id (PK)

nit (varchar(30), unique, not null)

razon_social (varchar(150), not null)

contacto (varchar(120))

telefono (varchar(20))

email (varchar(150))

activa (boolean default true)

created_at, updated_at
Índices: idx_empresas_nit_unique, idx_empresas_activa

5) conductores

id (PK)

cedula (varchar(20), unique, not null)

nombre (varchar(120), not null)

telefono (varchar(20))

email (varchar(150))

empresa_id (FK → empresas.id, set null)

activo (boolean default true)

created_at, updated_at
Índices: idx_conductores_cedula_unique, idx_conductores_empresa, idx_conductores_activo

6) vehiculos

id (PK)

placa (varchar(10), unique, not null, uppercase)

tipo (enum TipoVehiculo, not null)

empresa_id (FK → empresas.id, set null)

capacidad_tn (numeric(6,2), null)

activo (boolean default true)

created_at, updated_at
Índices: idx_vehiculos_placa_unique, idx_vehiculos_empresa, idx_vehiculos_activo

7) plantas

id (PK)

nombre (varchar(120), unique, not null)

direccion (varchar(200))

timezone (varchar(60), default America/Bogota)

activo (boolean default true)

created_at, updated_at

8) muelles (slots físicos)

id (PK)

planta_id (FK → plantas.id, cascade)

nombre (varchar(60), not null)

activo (boolean default true)
Índices: únicos por (planta_id, nombre)

9) ventanillas (si aplica prechequeo/portería)

id (PK)

planta_id (FK → plantas.id)

nombre (varchar(60))

activo (boolean default true)
Índices: únicos por (planta_id, nombre)

10) requisitos_documentales

id (PK)

planta_id (FK → plantas.id, cascade)

nombre (enum TipoDocumento o varchar(60))

obligatorio_conductor (boolean)

obligatorio_vehiculo (boolean)

vigencia_dias (int, null)

activo (boolean default true)

11) documentos_conductor

id (PK)

conductor_id (FK → conductores.id, cascade)

tipo (enum TipoDocumento)

numero (varchar(60))

emitido_el (date)

vence_el (date)

archivo_id (FK → archivos.id, null)

valido (boolean, default null; validación manual/automática)
Índices: únicos por (conductor_id, tipo, numero) parciales si numero no null

12) documentos_vehiculo

Igual a documentos_conductor pero con vehiculo_id

13) tipos_turno

id (PK)

codigo (varchar(30), unique) — p.e. DESCARGA, CARGA, ESPECIAL

descripcion (varchar(150))

prioridad_default (enum PrioridadTurno, default NORMAL)

duracion_estimada_min (int, default 60)

activo (boolean, default true)

14) parametros_agendamiento

id (PK)

planta_id (FK → plantas.id)

franja_minutos (int, default 30)

capacidad_por_franja (int, default 4)

antelacion_min_reserva_horas (int, default 1)

limite_cancelacion_horas (int, default 2)

sla_atencion_min (int, default 90)

ventana_operacion_inicio (time, p.e. 06:00)

ventana_operacion_fin (time, p.e. 22:00)

dias_habilitados (varchar(14)) — ej: “1,2,3,4,5,6” (ISO dow)
Índices: únicos por planta_id (uno vigente por planta)

15) reglas_agendamiento

id (PK)

planta_id (FK → plantas.id)

tipo_regla (varchar(40)) — p.e. MAX_POR_EMPRESA, BLOQUEO_TIPO_VEHICULO, PRIORIDAD_PROVEEDOR, DOCUMENTO_OBLIGATORIO, CAPACIDAD_DIA

condicion_json (jsonb) — expresividad (ej: { empresaId: X, max: 5, periodo: "DIA" })

accion_json (jsonb) — p.e. { efecto: "RECHAZAR" | "PRIORIZAR" | "WARN", prioridad: "ALTA" }

activo (boolean default true)
Índices: GIN sobre condicion_json si se filtra

16) bloqueos_calendario

id (PK)

planta_id (FK → plantas.id)

inicio (timestamptz)

fin (timestamptz)

motivo (varchar(140))

afecta_tipos (varchar(120)) — CSV ids o jsonb
Índices: idx_bloqueo_planta_timerange

17) turnos

id (PK)

planta_id (FK → plantas.id)

tipo_turno_id (FK → tipos_turno.id)

empresa_id (FK → empresas.id, set null)

conductor_id (FK → conductores.id)

vehiculo_id (FK → vehiculos.id)

fecha (date) — normalizado

hora (time) — franja base

fecha_hora (timestamptz) — columna derivada/índice

estado (enum TurnoEstado, default CREADO)

prioridad (enum PrioridadTurno, default de tipo)

muelle_id (FK → muelles.id, null hasta asignar)

ventanilla_id (FK → ventanillas.id, null)

observaciones (text)

motivo_cancelacion (enum MotivoCancelacion, null)

creado_por_usuario_id (FK → usuarios.id, set null)

updated_at, created_at
Índices:

idx_turnos_fecha_hora (btree)

idx_turnos_planta_estado_activo (parcial donde estado in activos)

idx_turnos_placa_fecha (compuesto via join materializable; alternativa: vista)

18) turno_eventos (histórico)

id (PK)

turno_id (FK → turnos.id, cascade)

de_estado (enum TurnoEstado, null)

a_estado (enum TurnoEstado)

motivo (varchar(120))

metadata (jsonb) — origen, usuario, IP, etc.

created_at (timestamptz default now())
Índices: idx_eventos_turno, idx_eventos_created_at

19) asignaciones_muelle

id (PK)

turno_id (FK → turnos.id, unique) — 1:1 con turno

muelle_id (FK → muelles.id)

inicio_previsto (timestamptz)

fin_previsto (timestamptz)

inicio_real (timestamptz, null)

fin_real (timestamptz, null)
Índices: idx_muelle_timerange (para detectar solapes)

20) notificaciones

id (PK)

turno_id (FK → turnos.id, null si genéricas)

canal (enum CanalNotificacion)

destino (varchar(150)) — tel/email

plantilla (varchar(60)) — CONFIRMACION, RECORDATORIO, etc.

payload (jsonb)

enviado (boolean default false)

error (text)

created_at, enviado_at
Índices: idx_notif_pendientes (parcial enviado=false)

21) webhooks_outbox (patrón outbox)

id (PK)

tipo_evento (varchar(60)) — TURNO_CONFIRMADO, etc.

payload (jsonb)

estado (varchar(20)) — PENDIENTE|ENVIADO|ERROR|REINTENTAR

reintentos (int default 0)

created_at, updated_at
Índices: idx_outbox_pendientes

22) kpi_snapshots

id (PK)

planta_id (FK → plantas.id)

granularidad (varchar(10)) — HORA|DIA

periodo (timestamptz) — inicio rango

turnos_creados (int)

turnos_confirmados (int)

no_show (int)

cancelados (int)

tiempo_promedio_atencion_min (numeric(6,2))

ocupacion_promedio_muelles_pct (numeric(5,2))

sla_cumplimiento_pct (numeric(5,2))
Índices: únicos por (planta_id, granularidad, periodo)

23) auditoria

id (PK)

tabla (varchar(60))

registro_id (varchar(60))

accion (varchar(20)) — INSERT|UPDATE|DELETE

antes (jsonb)

despues (jsonb)

usuario_id (FK → usuarios.id, set null)

ip (inet, null)

created_at (timestamptz default now())
Índices: idx_auditoria_tabla_registro, idx_auditoria_created_at

24) archivos

id (PK)

nombre (varchar(140))

mime (varchar(80))

tamano_bytes (int)

ubicacion (varchar(200)) — ruta S3/local

hash (varchar(64))

created_at

2.3 — Reglas de integridad y negocio en BD

Un turno no puede tener solape con otro del mismo vehículo en la misma franja (unique index sobre (vehiculo_id,fecha,hora) + validación de solape por rango cuando hay duracion_estimada).

asignaciones_muelle: evitar solapes de un muelle por rango (EXCLUDE USING gist (muelle_id WITH =, tsrange(inicio_previsto, fin_previsto) WITH &&) si habilitamos btree_gist).

documentos_*: si requisitos_documentales.obligatorio_* = true, bloquear CONFIRMADO cuando falta o está vencido (regla a nivel de servicio; BD puede soportar con check y vistas de control).

turnos.fecha_hora generado/actualizado por trigger o por capa de servicio para indexar rápido.

2.4 — Ejemplo de Prisma Schema (extracto coherente)

Nota: nombres en inglés por convención de Prisma; mapeo @map si quieres mantener snake_case en BD.

// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
generator client { provider = "prisma-client-js" }

// Enums
enum TurnoEstado {
  CREADO VALIDANDO CONFIRMADO EN_PROCESO ATENDIDO CERRADO RECHAZADO CANCELADO_USUARIO CANCELADO_ADMIN NO_SHOW
}
enum PrioridadTurno { NORMAL ALTA URGENTE }
enum MotivoCancelacion { USUARIO ADMIN CLIMA MANTENIMIENTO DOCUMENTOS CAPACIDAD OTRO }
enum CanalNotificacion { WHATSAPP EMAIL SMS PUSH }
enum TipoDocumento { LICENCIA SOAT TECNICOMECANICA TARJETA_PROPIEDAD CEDULA OTRO }
enum TipoVehiculo { CAMIONETA RIGIDO TRACTO DOBLETROQUE MOTO OTRO }
enum Idioma { ES EN }
enum TemaUI { SYSTEM LIGHT DARK }

// Tablas clave (extracto)
model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  passwordHash String?   @map("password_hash")
  nombre       String
  telefono     String?
  idioma       Idioma    @default(ES)
  temaUi       TemaUI    @default(SYSTEM) @map("tema_ui")
  activo       Boolean   @default(true)
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime? @updatedAt @map("updated_at")
  roles        UserRole[]
}

model Role {
  id     Int        @id @default(autoincrement())
  nombre String     @unique
  users  UserRole[]
}
model UserRole {
  userId Int
  roleId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role   Role @relation(fields: [roleId], references: [id])
  @@id([userId, roleId])
}

model Company {
  id          Int       @id @default(autoincrement())
  nit         String    @unique
  razonSocial String    @map("razon_social")
  contacto    String?
  telefono    String?
  email       String?
  activa      Boolean   @default(true)
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime? @map("updated_at")
  drivers     Driver[]
  vehicles    Vehicle[]
}

model Driver {
  id         Int       @id @default(autoincrement())
  cedula     String    @unique
  nombre     String
  telefono   String?
  email      String?
  empresaId  Int?
  empresa    Company?  @relation(fields: [empresaId], references: [id], onDelete: SetNull)
  activo     Boolean   @default(true)
  createdAt  DateTime  @default(now()) @map("created_at")
  updatedAt  DateTime? @map("updated_at")
  documentos DocConductor[]
  turnos     Turno[]
}

model Vehicle {
  id         Int       @id @default(autoincrement())
  placa      String    @unique
  tipo       TipoVehiculo
  empresaId  Int?
  empresa    Company?  @relation(fields: [empresaId], references: [id], onDelete: SetNull)
  capacidadTn Decimal? @map("capacidad_tn")
  activo     Boolean   @default(true)
  createdAt  DateTime  @default(now()) @map("created_at")
  updatedAt  DateTime? @map("updated_at")
  documentos DocVehiculo[]
  turnos     Turno[]
}

model Plant {
  id        Int       @id @default(autoincrement())
  nombre    String    @unique
  direccion String?
  timezone  String    @default("America/Bogota")
  activo    Boolean   @default(true)
  muelles   Muelle[]
  ventanillas Ventanilla[]
  params    ParamAgendamiento[]
}

model Muelle {
  id       Int    @id @default(autoincrement())
  plantaId Int
  nombre   String
  activo   Boolean @default(true)
  planta   Plant  @relation(fields: [plantaId], references: [id], onDelete: Cascade)
  @@unique([plantaId, nombre])
}

model Ventanilla {
  id       Int    @id @default(autoincrement())
  plantaId Int
  nombre   String
  activo   Boolean @default(true)
  planta   Plant  @relation(fields: [plantaId], references: [id], onDelete: Cascade)
  @@unique([plantaId, nombre])
}

model TipoTurno {
  id                     Int            @id @default(autoincrement())
  codigo                 String         @unique
  descripcion            String?
  prioridadDefault       PrioridadTurno @default(NORMAL) @map("prioridad_default")
  duracionEstimadaMin    Int            @default(60) @map("duracion_estimada_min")
  activo                 Boolean        @default(true)
  turnos                 Turno[]
}

model Turno {
  id          Int           @id @default(autoincrement())
  plantaId    Int
  tipoTurnoId Int
  empresaId   Int?
  conductorId Int
  vehiculoId  Int
  fecha       DateTime      @db.Date
  hora        DateTime      @db.Time(6)
  fechaHora   DateTime      @map("fecha_hora")
  estado      TurnoEstado   @default(CREADO)
  prioridad   PrioridadTurno @default(NORMAL)
  muelleId    Int?
  ventanillaId Int?
  observaciones String?
  motivoCancelacion MotivoCancelacion?
  creadoPorUsuarioId Int?
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime?     @map("updated_at")

  planta      Plant      @relation(fields: [plantaId], references: [id])
  tipoTurno   TipoTurno  @relation(fields: [tipoTurnoId], references: [id])
  empresa     Company?   @relation(fields: [empresaId], references: [id], onDelete: SetNull)
  conductor   Driver     @relation(fields: [conductorId], references: [id])
  vehiculo    Vehicle    @relation(fields: [vehiculoId], references: [id])
  muelle      Muelle?    @relation(fields: [muelleId], references: [id])
  ventanilla  Ventanilla? @relation(fields: [ventanillaId], references: [id])

  eventos     TurnoEvento[]
  asignacion  AsignacionMuelle?

  @@index([plantaId, estado])
  @@index([fechaHora])
  @@unique([vehiculoId, fecha, hora])
}

model TurnoEvento {
  id        Int         @id @default(autoincrement())
  turnoId   Int
  deEstado  TurnoEstado?
  aEstado   TurnoEstado
  motivo    String?
  metadata  Json?
  createdAt DateTime    @default(now()) @map("created_at")
  turno     Turno       @relation(fields: [turnoId], references: [id], onDelete: Cascade)
  @@index([turnoId])
}

model AsignacionMuelle {
  id            Int       @id @default(autoincrement())
  turnoId       Int       @unique
  muelleId      Int
  inicioPrevisto DateTime
  finPrevisto    DateTime
  inicioReal     DateTime?
  finReal        DateTime?
  turno         Turno   @relation(fields: [turnoId], references: [id], onDelete: Cascade)
  muelle        Muelle  @relation(fields: [muelleId], references: [id])
}

model ParamAgendamiento {
  id                          Int @id @default(autoincrement())
  plantaId                    Int
  franjaMinutos               Int @default(30)
  capacidadPorFranja          Int @default(4)
  antelacionMinReservaHoras   Int @default(1)
  limiteCancelacionHoras      Int @default(2)
  slaAtencionMin              Int @default(90)
  ventanaOperacionInicio      DateTime @db.Time(6)
  ventanaOperacionFin         DateTime @db.Time(6)
  diasHabilitados             String   // "1,2,3,4,5,6"
  planta                      Plant @relation(fields: [plantaId], references: [id])
  @@unique([plantaId])
}


Nota: Faltan por volcar aquí (para no saturar): requisitos_documentales, documentos_conductor/vehiculo, notificaciones, webhooks_outbox, kpi_snapshots, auditoria, archivos. Las agrego en el repo junto con migraciones cuando confirmes este bloque.

2.5 — Índices y extensiones recomendadas en PostgreSQL

CREATE EXTENSION IF NOT EXISTS btree_gist; (para exclusiones por rango en muelles)

CREATE INDEX idx_turnos_fecha_hora ON turnos (fecha_hora);

Índices parciales:

CREATE INDEX idx_turnos_activos ON turnos(planta_id, fecha_hora) WHERE estado IN ('CREADO','VALIDANDO','CONFIRMADO','EN_PROCESO');

CREATE INDEX idx_notif_pendiente ON notificaciones(canal) WHERE enviado = false;

GIN para JSONB si filtramos por accion_json/condicion_json.

2.6 — Seeds mínimos (datos de arranque)

Roles: admin, planner, operativo, guardia, usuario.

Usuario admin: admin@dominio.local (password hash).

Plantas: Planta La Paila.

Muelles: Muelle 1..N.

Tipos de turno: DESCARGA, CARGA, ESPECIAL.

Parámetros de agendamiento por planta (franja 30 min, ventana 06:00–22:00).

Empresa demo, conductor demo, vehículo demo.

Requisitos documentales base: LICENCIA, SOAT, TECNICOMECANICA.

2.7 — Consultas clave (SQL de referencia)

Turnos del día por planta:

SELECT t.*, c.nombre AS conductor, v.placa
FROM turnos t
JOIN conductores c ON c.id = t.conductor_id
JOIN vehiculos v ON v.id = t.vehiculo_id
WHERE t.planta_id = $1 AND t.fecha = CURRENT_DATE
ORDER BY t.fecha_hora;


Detección de solape en muelles (simplificado):

SELECT 1
FROM asignaciones_muelle a
WHERE a.muelle_id = $1
  AND tstzrange(a.inicio_previsto, a.fin_previsto, '[)') &&
      tstzrange($2::timestamptz, $3::timestamptz, '[)');





Bloque 3 — API & Casos de Uso
3.1 — Convenciones generales

Base: /api/v1/*

Auth: JWT (Auth.js). Header: Authorization: Bearer <token>.

RBAC: admin, planner, operativo, guardia, usuario.

Idempotencia: Header opcional Idempotency-Key en POST/PUT sensibles.

Paginación: ?page=1&limit=20, respuesta con meta: { page, limit, total }.

Errores (JSON):

400 VALIDATION_ERROR (detalles Zod)

401 UNAUTHORIZED

403 FORBIDDEN

404 NOT_FOUND

409 CONFLICT (solapes, duplicados)

422 RULE_VIOLATION (motor de reglas)

500 INTERNAL_ERROR

3.2 — Esquemas Zod (contratos compartidos)
// /app/lib/contracts.ts
import { z } from "zod"

export const IdSchema = z.object({ id: z.number().int().positive() })

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const TurnoEstado = z.enum([
  "CREADO","VALIDANDO","CONFIRMADO","EN_PROCESO",
  "ATENDIDO","CERRADO","RECHAZADO","CANCELADO_USUARIO",
  "CANCELADO_ADMIN","NO_SHOW"
])
export const Prioridad = z.enum(["NORMAL","ALTA","URGENTE"])

export const TurnoCreate = z.object({
  plantaId: z.number().int().positive(),
  tipoTurnoId: z.number().int().positive(),
  empresaId: z.number().int().positive().nullable().optional(),
  conductor: z.object({
    cedula: z.string().min(5),
    nombre: z.string().min(3),
    telefono: z.string().min(7),
    email: z.string().email().optional()
  }),
  vehiculo: z.object({
    placa: z.string().toUpperCase().regex(/^[A-Z0-9-]{5,8}$/),
    tipo: z.enum(["CAMIONETA","RIGIDO","TRACTO","DOBLETROQUE","MOTO","OTRO"])
  }),
  fecha: z.string().date().or(z.coerce.date()).transform(d=> new Date(d)),
  hora: z.string().regex(/^\d{2}:\d{2}$/),
  prioridad: Prioridad.default("NORMAL"),
  observaciones: z.string().max(500).optional()
})

export const TurnoFilter = z.object({
  plantaId: z.coerce.number().int().optional(),
  estado: TurnoEstado.optional(),
  placa: z.string().optional(),
  cedula: z.string().optional(),
  from: z.string().optional(), // ISO
  to: z.string().optional(),   // ISO
})

export const TurnoUpdateEstado = z.object({
  aEstado: TurnoEstado,
  motivo: z.string().max(120).optional()
})

export const ReglaSchema = z.object({
  tipo_regla: z.enum([
    "MAX_POR_EMPRESA","BLOQUEO_TIPO_VEHICULO","PRIORIDAD_PROVEEDOR",
    "DOCUMENTO_OBLIGATORIO","CAPACIDAD_DIA","BLOQUEO_RANGO_HORARIO"
  ]),
  condicion: z.record(z.any()), // JSON expresivo
  accion: z.object({
    efecto: z.enum(["RECHAZAR","PRIORIZAR","WARN"]),
    prioridad: Prioridad.optional(),
    mensaje: z.string().optional()
  }),
  activo: z.boolean().default(true)
})

3.3 — Endpoints clave
3.3.1 — Autenticación

POST /api/v1/auth/login → { email, password } → { token, user }

GET /api/v1/auth/me → usuario + roles

3.3.2 — Catálogos / metas

GET /api/v1/catalogos/plantas

GET /api/v1/catalogos/tipos-turno

GET /api/v1/catalogos/muelles?plantaId=...

GET /api/v1/catalogos/ventanillas?plantaId=...

3.3.3 — Turnos (CRUD + máquina de estados)

GET /api/v1/turnos?filters...&page&limit

GET /api/v1/turnos/:id

POST /api/v1/turnos (crea turno y valida reglas; estado: CREADO→VALIDANDO→CONFIRMADO si pasa)

PATCH /api/v1/turnos/:id/estado (transición; valida reglas y coherencia)

PATCH /api/v1/turnos/:id/assign ({ muelleId, inicioPrevisto, finPrevisto })

DELETE /api/v1/turnos/:id → CANCELADO_ADMIN (según rol) o CANCELADO_USUARIO (self-service)

3.3.4 — Documentos y requisitos

GET /api/v1/requisitos?plantaId=...

POST /api/v1/conductores/:id/documentos

POST /api/v1/vehiculos/:id/documentos

GET /api/v1/documentos/:id (descarga metadatos; el archivo se sirve por signed URL)

3.3.5 — Reglas y parámetros

GET /api/v1/parametros?plantaId=...

PUT /api/v1/parametros/:id (planner/admin)

GET /api/v1/reglas?plantaId=...

POST /api/v1/reglas (admin)

PUT /api/v1/reglas/:id

PATCH /api/v1/reglas/:id/activar/desactivar

3.3.6 — Bloqueos calendario

GET /api/v1/bloqueos?plantaId=...&from&to

POST /api/v1/bloqueos (admin/planner)

DELETE /api/v1/bloqueos/:id

3.3.7 — KPIs y simuladores

GET /api/v1/kpi/resumen?plantaId=&from=&to=

POST /api/v1/simular/agenda
Entrada: demanda esperada por hora + parámetros → Salida: ocupación de muelles, tiempos de espera, SLA estimado.

3.3.8 — Notificaciones y Webhooks

POST /api/v1/notificaciones/test (envío de prueba al teléfono/email)

POST /api/v1/webhooks/entregas (endpoint para ACK de terceros si aplica)

Interno: Outbox dispatcher (no público).

3.4 — Casos de uso (servicios de dominio)
CU-01 Crear Turno

Normaliza conductor/vehículo (upsert por cédula/placa).

Verifica ventana operativa, días hábiles y antelación mínima (parametría).

Motor de reglas (sincrónico) → WARN/PRIORIZAR/RECHAZAR.

Verifica solapes por vehículo y capacidad de franja.

Persiste turno (CREADO), registra turno_evento.

Si OK → VALIDANDO→CONFIRMADO, encola notificación CONFIRMACION.

Publica TURNO_CONFIRMADO en outbox.

CU-02 Cambiar Estado

Transiciones permitidas y bloqueadas (tabla de verdad).

RECHAZADO solo desde VALIDANDO.

NO_SHOW solo desde CONFIRMADO/EN_PROCESO después de tolerancia.

En cada transición: evento + outbox + notificación si corresponde.

CU-03 Asignar Muelle

Chequea solapes en asignaciones_muelle.

Si inicio_real al check-in (portería), transición a EN_PROCESO.

CU-04 Cancelación

Usuario: si faltan más de limite_cancelacion_horas.

Admin/Planner: siempre, con motivo.

En ambos: liberar cupo, actualizar KPIs.

CU-05 Documentos

Al confirmar o entrar a planta, validar documentos obligatorios y vigencias; si falta, RECHAZADO con DOCUMENTOS.

CU-06 Simulación

Con demanda horaria y capacidad/franjas, aplica colas M/M/c aproximada o heurística por franjas (detallo algoritmo en Bloque 5 de KPIs).

3.5 — Motor de Reglas (DSL JSON + ejecución)
Forma de regla (ejemplos):
{
  "tipo_regla": "MAX_POR_EMPRESA",
  "condicion": { "empresaId": 42, "max": 10, "periodo": "DIA" },
  "accion": { "efecto": "RECHAZAR", "mensaje": "Límite diario por empresa alcanzado." },
  "activo": true
}

{
  "tipo_regla": "BLOQUEO_TIPO_VEHICULO",
  "condicion": { "plantaId": 1, "tipos": ["DOBLETROQUE"], "rango": ["2025-10-06T06:00:00Z","2025-10-06T18:00:00Z"] },
  "accion": { "efecto": "RECHAZAR", "mensaje": "Tipo de vehículo no permitido en la franja." }
}

{
  "tipo_regla": "PRIORIDAD_PROVEEDOR",
  "condicion": { "empresaIdIn": [7,9,11] },
  "accion": { "efecto": "PRIORIZAR", "prioridad": "ALTA" }
}

{
  "tipo_regla": "DOCUMENTO_OBLIGATORIO",
  "condicion": { "entidad": "vehiculo", "tipo": "TECNICOMECANICA", "valido": true },
  "accion": { "efecto": "RECHAZAR", "mensaje": "Tecnomecánica vencida." }
}

Estrategia de ejecución

Se cargan reglas activas por plantaId.

Orden: reglas de rechazo → priorización → warn.

Cada regla produce RuleResult: { efecto, mensaje?, prioridad? }.

Si alguna RECHAZAR → aborta con 422 RULE_VIOLATION.

Si PRIORIZAR sugiere prioridad > actual → aplicar.

WARN se devuelve en la respuesta como warnings[].

Extensión: agregar script (safe sandbox) si se requiere lógica avanzada.

3.6 — Jobs asíncronos (BullMQ)

Colas:

notifications: { canal, destino, plantilla, payload }

kpi-rollup: procesos horarios/diarios de kpi_snapshots

webhook-dispatch: lee webhooks_outbox y entrega

Plantillas WhatsApp/Email (variables)

CONFIRMACION_TURNO: {{nombre}} tu turno {{id}} fue confirmado para {{fecha}} {{hora}} en {{planta}}.

RECORDATORIO_TURNO: Recordatorio: turno {{id}} hoy {{hora}}.

CAMBIO_ESTADO: Tu turno {{id}} pasó a {{estado}}. {{mensaje?}}

CANCELACION: Tu turno {{id}} fue cancelado. Motivo: {{motivo}}.

3.7 — Webhooks (patrón Outbox + entrega fiable)

webhooks_outbox almacena evento:

tipo_evento: TURNO_CONFIRMADO, TURNO_CANCELADO, ESTADO_CAMBIADO, ASIGNADO_MUELLE.

payload: snapshot seguro del evento.

Dispatcher (job webhook-dispatch) reintenta con backoff, firma HMAC en header X-Signature (sha256).

Consumidor externo (n8n/Power Automate) valida firma y procesa.

3.8 — Snippets (rutas Next.js + servicios)

Middleware de RBAC

// /app/server/authz.ts
export function requireRole(roles: Array<"admin"|"planner"|"operativo"|"guardia"|"usuario">) {
  return async (req: Request) => {
    const user = await getUserFromRequest(req)
    if (!user) return Response.json({code:"UNAUTHORIZED"}, {status:401})
    if (!user.roles.some(r=> roles.includes(r))) {
      return Response.json({code:"FORBIDDEN"}, {status:403})
    }
    return user
  }
}


Crear turno (handler)

// /app/api/v1/turnos/route.ts
import { TurnoCreate } from "@/app/lib/contracts"
import { createTurno } from "@/app/server/turnos.service"

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = TurnoCreate.safeParse(body)
  if (!parsed.success) return Response.json({code:"VALIDATION_ERROR", issues: parsed.error.issues},{status:400})

  try {
    const result = await createTurno(parsed.data, {
      idempotencyKey: req.headers.get("Idempotency-Key") ?? undefined
    })
    return Response.json(result, { status: 201 })
  } catch (e:any) {
    if (e.code === "RULE_VIOLATION") return Response.json({code:"RULE_VIOLATION", message:e.message, details:e.details},{status:422})
    if (e.code === "CONFLICT") return Response.json({code:"CONFLICT", message:e.message},{status:409})
    console.error(e)
    return Response.json({code:"INTERNAL_ERROR"}, {status:500})
  }
}


Servicio crear turno (resumen)

// /app/server/turnos.service.ts
export async function createTurno(input: TurnoCreateType, opts?: { idempotencyKey?: string }) {
  return await prisma.$transaction(async (tx)=>{
    // 1. Upsert entidades
    const empresa = input.empresaId ? await tx.company.findUnique({where:{id:input.empresaId}}) : null
    const conductor = await upsertDriver(tx, input.conductor)
    const vehiculo  = await upsertVehicle(tx, input.vehiculo, empresa?.id)

    // 2. Parametría y ventana
    await ensureVentanaOperativa(tx, input.plantaId, input.fecha, input.hora)

    // 3. Motor de reglas
    const ruleRes = await evalRules(tx, input.plantaId, { empresaId: empresa?.id, conductorId: conductor.id, vehiculoId: vehiculo.id, tipoTurnoId: input.tipoTurnoId, fecha: input.fecha, hora: input.hora })
    if (ruleRes.reject) throw { code:"RULE_VIOLATION", message: ruleRes.message, details: ruleRes.details }
    const prioridad = ruleRes.priority ?? input.prioridad

    // 4. Capacidad y solapes
    await ensureCapacidad(tx, input.plantaId, input.fecha, input.hora)
    await ensureNoSolapeVehiculo(tx, vehiculo.id, input.fecha, input.hora)

    // 5. Crear turno
    const fechaHora = composeFechaHora(input.fecha, input.hora)
    const turno = await tx.turno.create({
      data: {
        plantaId: input.plantaId, tipoTurnoId: input.tipoTurnoId,
        empresaId: empresa?.id ?? null, conductorId: conductor.id, vehiculoId: vehiculo.id,
        fecha: input.fecha as any, hora: toPgTime(input.hora) as any, fechaHora,
        prioridad, observaciones: input.observaciones ?? null, estado: "CREADO"
      }
    })

    // 6. Evento + transición a VALIDANDO → CONFIRMADO
    await tx.turnoEvento.create({ data: { turnoId: turno.id, deEstado: null, aEstado: "CREADO" } })
    const confirmado = await transitionEstado(tx, turno.id, "VALIDANDO")
    const finalizado = await transitionEstado(tx, turno.id, "CONFIRMADO")

    // 7. Outbox + notificación
    await enqueueOutbox(tx, "TURNO_CONFIRMADO", { turnoId: turno.id })
    await enqueueNotif("WHATSAPP", destinoFrom(conductor), "CONFIRMACION_TURNO", { id: turno.id, fecha: input.fecha, hora: input.hora })

    return { id: turno.id, estado: "CONFIRMADO" }
  })
}


Transición de estado

export async function transitionEstado(tx:any, turnoId:number, aEstado:TurnoEstado) {
  const turno = await tx.turno.findUnique({ where:{ id: turnoId } })
  ensureTransicionValida(turno.estado, aEstado)
  // validaciones contextuales (documentos, tiempos, etc.)
  const upd = await tx.turno.update({ where:{id:turnoId}, data:{ estado: aEstado, updatedAt: new Date() } })
  await tx.turnoEvento.create({ data:{ turnoId, deEstado: turno.estado, aEstado } })
  return upd
}

3.9 — Flujos UI (alto nivel)
Panel de Usuario (conductor/empresa)

Inicio: selector de planta → fecha → hora disponible (grilla por franja).

Formulario rápido: cédula + nombre + teléfono, placa + tipo, email opcional.

Revisión: resumen + advertencias de reglas (WARN).

Confirmación: turno confirmado + QR/ID + botones: agregar a calendario, compartir por WhatsApp.

Mis turnos: listado con filtro por estado, acciones: ver, cancelar (si ventana lo permite), reprogramar (crea nuevo y cancela anterior).

Documentos: subir/licencia/SOAT; validador de vigencia con semáforo.

Panel de Administración (planner/operativo)

Dashboard: KPIs del día (turnos por estado, ocupación por franja, SLA, no-shows, cola en vivo).

Agenda: vista calendario (día/semana), drag&drop de turnos, asignar muelles, detectar solapes.

Turnos: tabla avanzada (placa/cedula/empresa/estado/fecha), acciones masivas (cambiar estado, notificar).

Reglas & Parámetros: CRUD de reglas con vista previa “efecto probable”.

Bloqueos: crear feriados/mantenimientos por rango.

Documentos: bandeja de verificación manual (si se activa workflow humano).

Notificaciones: cola, reintentos, plantillas.

Auditoría: timeline de eventos por turno/usuario.

3.10 — Formatos de respuesta (ejemplos)

POST /turnos (201):

{
  "id": 1289,
  "estado": "CONFIRMADO",
  "warnings": [],
  "consejos": [
    "Sube tu SOAT vigente antes del ingreso para evitar demoras."
  ]
}


GET /turnos?plantaId=1&from=2025-10-06&to=2025-10-07:

{
  "data": [
    { "id":1289, "estado":"CONFIRMADO", "fecha":"2025-10-06", "hora":"08:30", "placa":"ABC123", "conductor":"Juan Pérez", "muelle":"M1" }
  ],
  "meta": { "page":1, "limit":20, "total": 57 }
}


422 RULE_VIOLATION:

{ "code":"RULE_VIOLATION", "message":"Límite diario por empresa alcanzado.", "details": { "empresaId": 42, "max": 10 } }

3.11 — Seguridad y límites

Rate limit por IP y por usuarioId (ej. 100 req/5 min; creación de turnos: 10/5 min).

CSRF: no aplica a APIs con Bearer; en UI usar server actions seguras.

Validación exhaustiva Zod en todas las entradas.

Logs con pino (correlation-id por request).

Auditoría de cambios (tablas críticas).

3.12 — Pruebas recomendadas

Unit: servicios (ensureCapacidad, evalRules, transitionEstado).

Contract: Schemas Zod con fixtures buenos/malos.

E2E: Playwright → flujos “crear turno”, “cancelar”, “asignar muelle”, “no_show”.

Carga: k6/Gatling sobre POST /turnos y GET /turnos.



Bloque 4 — UI / UX Detallada
4.1 — Diseño general

Estilo: minimalista industrial, inspirado en tableros de control modernos.

Paleta clara: fondo gris 50 / blanco, acentos azules y verdes.

Paleta oscura: gris 950 / acentos cian y ámbar.

Tipografía: Inter / Geist Sans.

Layout base: encabezado fijo, panel lateral con iconos, contenido en tarjetas con sombras suaves y bordes 2xl.

Animaciones: framer-motion para transiciones y feedbacks (fade/slide 100 ms).

Responsividad:

móvil → barra inferior de navegación.

tablet → sidebar colapsable.

desktop → layout de tres columnas (lista | detalle | sidebar de filtros).

4.2 — Arquitectura de carpetas UI
/app
  /layout.tsx
  /globals.css
  /theme-provider.tsx
  /i18n/
  /components/
    /ui/          # base shadcn (Button, Card, Dialog, etc.)
    /forms/       # formularios reutilizables
    /charts/      # KPI con Recharts
    /modals/
  /features/
    /user/        # panel de conductor/empresa
    /admin/       # panel interno

4.3 — Panel de Usuario (conductor/empresa)
Páginas y componentes

Inicio (/user)

Selector de planta → calendario → franjas horarias disponibles.

Componentes:

PlantPicker → Dropdown con logo y nombre.

DatePicker → react-day-picker personalizado.

SlotGrid → celdas de 30 min con colores según cupo (verde/amarillo/rojo).

Acciones: al seleccionar franja → abre modal de creación.

Crear Turno (/user/nuevo)

Formulario con validación zod: conductor + vehículo + observaciones.

Campos con feedback instantáneo ✔️ / ❌.

Paso 3: resumen y confirmación.

Tras enviar → animación de check verde + QR del turno.

Mis Turnos (/user/turnos)

Tabla responsive o lista card-style: fecha, hora, estado, acciones.

Acciones: Ver detalle / Cancelar / Reprogramar.

Color por estado:

Confirmado → verde,

En proceso → azul,

Cancelado → gris,

No show → rojo.

Documentos (/user/documentos)

Tarjetas con ícono + nombre + estado vigente/vencido.

Subida con Dropzone + progreso.

Validación automática de vigencia.

Perfil (/user/perfil)

Datos básicos, idioma, tema, logout.

Botón "Sincronizar WhatsApp".

4.4 — Panel de Administración (planner / operativo)
Secciones

Dashboard (/admin)

KPIs diarios: turnos por estado, ocupación muelles, SLA, cancelaciones.

Componentes:

KpiCard: valor + variación % vs ayer.

TurnosPorHoraChart: Recharts BarChart.

SlaTrend: LineChart.

Selector de planta + rango de fechas.

Agenda (/admin/agenda)

Vista de calendario diario/semana con muelles en filas y horas en columnas.

Funciones: drag & drop de turnos, colores por estado, tooltip detallado.

Integración con react-big-calendar o FullCalendar.

Turnos (/admin/turnos)

DataTable con filtros avanzados (fuzzy search, estado, empresa, fecha).

Acciones masivas: cambiar estado, enviar notificación.

Botón “Ver histórico” → modal timeline de eventos.

Reglas (/admin/reglas)

Tabla + editor JSON con validación Zod en vivo.

Botón “Probar regla” → modal simulador (muestra efecto).

Parámetros (/admin/parametros)

Formulario de configuración numérica (frances, cupos, ventana horaria).

Guardar → snackbar “Parámetros actualizados”.

Bloqueos (/admin/bloqueos)

Calendario marcando feriados y mantenimientos.

CRUD simple (rango fecha/hora + motivo).

Documentos (/admin/documentos)

Tabla por conductor/vehículo → estado documentos.

Filtros “faltantes” / “por vencer”.

Notificaciones (/admin/notificaciones)

Cola de mensajes → estado pendiente, enviado, error.

Acciones “Reintentar”, “Ver payload”.

Auditoría (/admin/auditoria)

Timeline de eventos con iconos según acción.

Filtros por usuario, fecha, tabla.

4.5 — Componentes UI reusables (base shadcn + extras)
Componente	Descripción
AppSidebar	Navegación con iconos (lucide-react) + colapsado automático
Topbar	Logo, nombre de planta, perfil usuario, botón tema/idioma
TurnoCard	Resumen de turno con color por estado
StateBadge	Etiqueta coloreada de estado (verde/amarillo/rojo)
SlotGrid	Matriz de horas disponibles por planta
ConfirmDialog	Modal reutilizable para acciones críticas
Toast	Feedback rápido (shadcn /toast hook)
DataTable	TanStack Table + paginación
KpiCard	Métrica + variación + icono
ThemeSwitcher	Botón para modo claro/oscuro
LanguageToggle	Selector ES/EN
DocumentUploader	Subida con preview y validación extensión
QRCodeDisplay	QR de turno en detalle
4.6 — Temas, i18n y accesibilidad

Temas: manejados por ThemeProvider (usando next-themes).

Internacionalización: next-i18next con namespaces (“common”, “user”, “admin”).

Accesibilidad:

roles ARIA en botones y listas.

contraste mínimo 4.5:1.

navegación por teclado (Tab/Enter/Esc) en modales.

4.7 — UX detallada de flujos críticos
Crear turno (3 pasos)

Seleccionar planta + fecha + hora

SlotGrid marca ocupación.

Si franja bloqueada → tooltip “Fuera de operación”.

Ingresar datos

Validación en tiempo real.

Si cedula/placa ya existe → autocompleta.

Confirmar turno

Simulación rápida → feedback “Cupo disponible”.

Al confirmar → pantalla de éxito con confeti ligero.

Cancelar turno

Dialog → mostrar mensaje y tolerancia restante.

Si fuera de tiempo → mensaje “Ya no puedes cancelar; contacta al operador”.

Asignar muelle (planner)

Drag turno → slot muelle libre.

Si solape → toast error.

Guardado automático con icono check.

Notificaciones

En detalle de turno → sección “Comunicaciones enviadas” (con ícono por canal).

Botón “Reenviar confirmación”.

4.8 — Simuladores y KPIs UI

Simulador de agenda: form inputs (“Cupos por franja”, “Duración promedio”) + gráfico resultado.

Dashboard KPI:

Turnos por estado → PieChart.

Ocupación muelles → Heatmap semana.

Tiempo medio de atención → LineChart.

Filtros fecha/planta arriba.

4.9 — Páginas de error y estados vacíos

404: “Ruta no encontrada 🧭” + botón inicio.

500: mensaje humano “Algo salió mal; intentemos otra vez.”

Empty states:

“No tienes turnos programados” → botón “Crear turno”.

“Sin reglas configuradas” → botón “Agregar regla”.

4.10 — Detalles técnicos de implementación UI

Server components para listados grandes (paginación SSR).

Client components solo en formularios y dashboards.

React Query para mutaciones y refetch post-acción.

Skeleton loaders (shimmer anim).

Optimización de imágenes Next/Image.

Lazy loading de charts y módulos pesados.


Bloque 5 — KPIs, Simuladores y Análisis de Rendimiento
5.1 — Objetivo

Dar a planners y administradores una visión clara de:

Rendimiento operativo por planta, muelle y día.

Capacidad real vs teórica.

Cumplimiento de SLA (Service Level Agreement).

Eficiencia en asignación de turnos y uso de muelles.

Identificación de cuellos de botella, picos de congestión y causas de cancelación.

5.2 — Fuentes de datos

Tabla turnos (estados, fechas, duraciones).

asignaciones_muelle (intervalos reales de atención).

kpi_snapshots (agregaciones históricas).

turno_eventos (tiempos entre transiciones).

bloqueos_calendario (capacidad reducida).

reglas_agendamiento (restricciones vigentes).

5.3 — Métricas clave (KPIs operativos)
1. Turnos creados

Número total de registros nuevos en un periodo.

SELECT COUNT(*) FROM turnos WHERE created_at BETWEEN $from AND $to;

2. Turnos confirmados

Proporción de turnos creados que pasaron a estado CONFIRMADO.

Confirmaci
o
ˊ
n
=
turnos confirmados
turnos creados
×
100
Confirmaci
o
ˊ
n=
turnos creados
turnos confirmados
	​

×100
3. Cancelaciones

Total de turnos con estado en (CANCELADO_USUARIO, CANCELADO_ADMIN).
Se desglosa por motivo de cancelación.

4. No-shows

Turnos CONFIRMADO que nunca pasaron a EN_PROCESO ni ATENDIDO antes del final de su franja.

NoShowRate
=
no_show
confirmados
×
100
NoShowRate=
confirmados
no_show
	​

×100
5. Tiempo medio de atención
𝑇
𝑝
𝑟
𝑜
𝑚
=
avg
(
𝑓
𝑖
𝑛
_
𝑟
𝑒
𝑎
𝑙
−
𝑖
𝑛
𝑖
𝑐
𝑖
𝑜
_
𝑟
𝑒
𝑎
𝑙
)
T
prom
	​

=avg(fin_real−inicio_real)

Extraído de asignaciones_muelle.

6. Cumplimiento SLA

Porcentaje de turnos atendidos antes del límite de sla_atencion_min (parametría de planta).

𝑆
𝐿
𝐴
=
turnos dentro de SLA
turnos atendidos
×
100
SLA=
turnos atendidos
turnos dentro de SLA
	​

×100
7. Ocupación de muelles
𝑂
𝑐
𝑢
𝑝
𝑎
𝑐
𝑖
𝑜
ˊ
𝑛
=
∑
(
duraci
o
ˊ
n real
)
total horas operativas
×
nº muelles
×
100
Ocupaci
o
ˊ
n=
total horas operativas×nº muelles
∑(duraci
o
ˊ
n real)
	​

×100
8. Retraso promedio de inicio

Tiempo medio entre hora prevista y inicio_real.

9. Tasa de rechazo por reglas

Conteo de turnos con error RULE_VIOLATION, agrupado por tipo de regla (MAX_POR_EMPRESA, DOCUMENTO_OBLIGATORIO, etc.)

10. Productividad por empresa

Turnos completados por empresa en rango → comparación con cupo asignado.

5.4 — Métricas de planeación (predictivas)
1. Demanda proyectada

Basada en promedio móvil (últimas 4 semanas) + factor de tendencia (últimos 3 días hábiles).

2. Capacidad disponible
𝐶
𝑎
𝑝
𝑎
𝑐
𝑖
𝑑
𝑎
𝑑
=
(
nº muelles
)
×
horas operativas
duraci
o
ˊ
n promedio de turno
Capacidad=(nº muelles)×
duraci
o
ˊ
n promedio de turno
horas operativas
	​

3. Simulación de saturación

Entradas:

cupos_por_franja

duracion_promedio_min

distribucion_llegadas (Poisson)

Resultado:

Tasa esperada de espera (E[Wq])

Porcentaje de saturación por franja

Recomendaciones automáticas:

“Ampliar ventana 1h antes”

“Agregar muelle virtual temporal”

5.5 — Algoritmo de simulación (simplificado M/M/c)

El sistema puede estimar colas por franja con modelo M/M/c (llegadas y servicio exponenciales).

Variables:

λ = tasa de llegada (turnos/hora)

μ = tasa de servicio (1 / duracion_promedio_horas)

c = número de muelles

Fórmulas:

Utilización por servidor:

𝜌
=
𝜆
𝑐
𝜇
ρ=
cμ
λ
	​


Probabilidad de cola (Erlang C):

𝑃
𝑐
𝑜
𝑙
𝑎
=
(
𝑐
𝜌
)
𝑐
𝑐
!
(
1
−
𝜌
)
∑
𝑛
=
0
𝑐
−
1
(
𝑐
𝜌
)
𝑛
𝑛
!
+
(
𝑐
𝜌
)
𝑐
𝑐
!
(
1
−
𝜌
)
P
cola
	​

=
∑
n=0
c−1
	​

n!
(cρ)
n
	​

+
c!(1−ρ)
(cρ)
c
	​

c!(1−ρ)
(cρ)
c
	​

	​


Espera promedio:

𝑊
𝑞
=
𝑃
𝑐
𝑜
𝑙
𝑎
𝑐
𝜇
−
𝜆
W
q
	​

=
cμ−λ
P
cola
	​

	​


Tiempo total esperado:

𝑊
=
𝑊
𝑞
+
1
𝜇
W=W
q
	​

+
μ
1
	​


Recomendación:

Si ρ > 0.85 → saturación alta, proponer más cupos o muelles.

Si ρ < 0.5 → capacidad ociosa.

5.6 — Visualizaciones en Dashboard
Métrica	Tipo de gráfico	Librería	Frecuencia
Turnos por estado	DonutChart	Recharts	tiempo real
Ocupación muelles	Heatmap semanal	d3.js o Chart.js	diario
SLA cumplimiento	LineChart	Recharts	diario
Tiempo medio de atención	BarChart	Recharts	diario
No-shows vs Cancelaciones	Stacked Bar	Recharts	semanal
Productividad por empresa	Horizontal Bar	Recharts	mensual
Demanda proyectada	AreaChart	Recharts	semanal
Simulación de saturación	LineChart (ρ vs hora)	Recharts	bajo demanda
5.7 — KPIs en tiempo real (streaming ligero)

Socket.io canal /kpi/live (solo lectura para planners).

Actualiza en dashboard cada 30 s:

turnos_activos

muelles_ocupados

espera_promedio_actual

no_shows_hoy

cancelaciones_hoy

5.8 — KPIs históricos (ETL nocturno)

Job kpi-rollup (BullMQ) a las 23:50:

Agrupa por planta y hora/día.

Calcula métricas anteriores.

Inserta/actualiza kpi_snapshots.

Purga datos antiguos (>90 días).

5.9 — Panel de simulador (UI)

Ruta: /admin/simulador

Componentes:

InputGroup con sliders:

Llegadas/hora (λ)

Duración promedio (min)

Muelles disponibles (c)

Botón “Simular”.

Resultado:

Tabla con ρ, Wq, W, SLA estimado.

Chart de ocupación proyectada.

Botón “Exportar PDF” → resumen visual con recomendaciones.

5.10 — Recomendaciones automáticas (IA ligera)

Una vez calculado el KPI diario, generar alertas automáticas:

“La planta X alcanzó 90 % de ocupación 3 días consecutivos.”

“El tiempo medio de atención aumentó 20 % respecto a ayer.”

“El 70 % de cancelaciones son por documentos vencidos.”

Guardadas en tabla alertas_kpi:

CREATE TABLE alertas_kpi (
  id serial primary key,
  planta_id int references plantas(id),
  tipo varchar(60),
  mensaje text,
  severidad varchar(10) check (severidad in ('INFO','WARN','CRIT')),
  creada_en timestamptz default now(),
  atendida boolean default false
);

5.11 — Exportes y reportes

Exportación PDF: jsPDF o server-side con Puppeteer (HTML-to-PDF).

Exportación Excel: SheetJS (.xlsx) con hojas: “KPIs diarios”, “Ocupación”, “SLA”.

API: /api/v1/reportes/kpi?plantaId=&from=&to=&formato=pdf|xlsx

Envió programado: job diario → envía PDF consolidado al correo del planner.

5.12 — Ejemplo de salida de simulador (JSON)
{
  "planta": "La Paila",
  "fecha": "2025-10-06",
  "muelles": 5,
  "hora_inicio": "06:00",
  "hora_fin": "22:00",
  "duracion_promedio": 55,
  "lambda": 3.8,
  "resultados": [
    { "hora": "06:00", "rho": 0.45, "espera_min": 8, "sla_estimado": 92 },
    { "hora": "08:00", "rho": 0.82, "espera_min": 20, "sla_estimado": 76 },
    { "hora": "12:00", "rho": 0.93, "espera_min": 45, "sla_estimado": 60 }
  ],
  "recomendaciones": [
    "Agregar un muelle temporal entre 10:00 y 14:00",
    "Reducir duración promedio a 50 min con mejor coordinación"
  ]
}

5.13 — UI de KPIs (interactiva)

Filtros superiores: Planta, rango fechas, turno tipo.

KpiCards con colores dinámicos según umbrales (verde ≤80%, ámbar ≤90%, rojo >90%).

Toggle: vista “Hoy / Semana / Mes”.

Exportar: PDF o Excel directo.

Tooltip avanzado: hover sobre gráfica → muestra datos + % variación.

5.14 — Desempeño y optimización

Consultas KPI en vistas materializadas.

Indexación combinada por planta_id, periodo.

Cache Redis TTL 60 s para dashboard.

Compresión gzip en API y lazy load en UI.

Jobs encolados asíncronamente → no bloquean flujos.

5.15 — Beneficio analítico final

El módulo KPI convierte el sistema de agendamiento en un centro de inteligencia operativa, permitiendo:

Decisiones basadas en datos (ampliar ventanas, reasignar personal).

Proyecciones de carga y saturación.

Identificación de reglas ineficientes (las que más rechazan).

Reportes históricos auditables para gestión de calidad.


Bloque 6 — Seguridad · Despliegue · CI/CD · Monitoreo
6.1 — Objetivos

Garantizar que el sistema:

Sea seguro por diseño, con mínima superficie de ataque.

Pueda desplegarse en contenedores reproducibles.

Se mantenga con pipelines automáticos (build + test + deploy).

Cuente con monitoreo activo y backups.

6.2 — Infraestructura recomendada (VPS Contabo / Ubuntu 24.04)
/agendamiento
  ├─ docker-compose.yml
  ├─ .env
  ├─ /app          # Next.js 15 + Prisma
  ├─ /db_backups
  ├─ /nginx_or_caddy
  └─ /logs

Servicios principales
Servicio	Contenedor	Puerto	Notas
frontend+backend	agendamiento_app	3000	Next.js (server + API)
db	postgres_agendamiento	5432	Volumen persistente
redis	redis_agendamiento	6379	Colas BullMQ
proxy	caddy	80/443	SSL auto con Let's Encrypt
worker	worker_agendamiento	–	procesa colas
backup	cron	–	pg_dump diario
6.3 — docker-compose.yml (base)
version: '3.9'
services:
  postgres:
    image: postgres:15
    container_name: postgres_agendamiento
    environment:
      POSTGRES_USER: agendamiento_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: agendamiento_db
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
      - ./db_backups:/backups
    restart: always

  redis:
    image: redis:7
    container_name: redis_agendamiento
    volumes:
      - ./data/redis:/data
    restart: always

  app:
    build: ./app
    container_name: agendamiento_app
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - postgres
      - redis
    restart: always

  worker:
    build: ./app
    container_name: worker_agendamiento
    command: npm run worker
    env_file: .env
    depends_on:
      - postgres
      - redis
    restart: always

  caddy:
    image: caddy:2
    container_name: caddy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - ./data/caddy:/data
      - ./config/caddy:/config
      - ./app/out:/srv
    restart: always

6.4 — Caddyfile (HTTPS automático)
agendamiento.yumatech.online {
  reverse_proxy agendamiento_app:3000
  encode gzip
  log {
    output file /var/log/caddy/access.log
  }
}

6.5 — Variables de entorno (.env ejemplo)
DATABASE_URL=postgresql://agendamiento_user:clave@postgres:5432/agendamiento_db
REDIS_URL=redis://redis:6379
NEXTAUTH_SECRET=claveultrasecreta
JWT_SECRET=otraclave
NODE_ENV=production
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=notificaciones@empresa.com
SMTP_PASS=contraseña

6.6 — Seguridad y cifrado

HTTPS obligatorio (Caddy/Let’s Encrypt).

CSRF y XSS: Next.js por defecto + helmet.

Rate limit: Upstash/Redis → 100 req / 5 min.

Cifrado de datos sensibles: bcrypt para contraseñas, AES256 para documentos.

Hash de archivos en BD (archivos.hash).

Cabeceras HTTP:

Content-Security-Policy: default-src 'self'

Strict-Transport-Security: max-age=31536000

X-Frame-Options: DENY

6.7 — Backups automatizados

Script cron diario:

#!/bin/bash
DATE=$(date +%F)
pg_dump -U agendamiento_user agendamiento_db > /backups/backup_$DATE.sql
find /backups -type f -mtime +30 -delete


Opcional: subir a S3 con rclone.

6.8 — CI/CD (GitHub Actions ejemplo)
name: Deploy Agendamiento
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t agendamiento_app ./app
      - name: Run tests
        run: docker run --rm agendamiento_app npm test
      - name: Push to VPS
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{secrets.VPS_HOST}}
          username: root
          key: ${{secrets.VPS_KEY}}
          source: "./"
          target: "~/agendamiento"
      - name: Remote deploy
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{secrets.VPS_HOST}}
          username: root
          key: ${{secrets.VPS_KEY}}
          script: |
            cd ~/agendamiento
            docker compose pull
            docker compose up -d --build

6.9 — Monitoreo y alertas
Herramientas recomendadas

Prometheus + Grafana → métricas CPU, RAM, DB.

Healthcheck endpoint → /api/health devuelve {status:"ok"}.

Sentry → errores frontend/backend.

Uptime Robot o Healthchecks.io para ping.

Logs estructurados

Pino logger → envía JSON a Grafana Loki.

Campos: timestamp, level, service, reqId, userId, mensaje.

6.10 — Mantenimiento y escala
Escenario	Solución
+ Carga de turnos	Separar worker BullMQ en otro host.
Alta concurrencia	Agregar Load Balancer (Nginx o Caddy cluster).
Lecturas pesadas	Replica read-only PostgreSQL.
Análisis profundo	ETL a Data Warehouse (BigQuery / Power BI).
Falla crítica	Restore último backup con pg_restore –clean –create.
6.11 — Versionado y documentación

Commits semánticos (feat:, fix:, chore:…).

CHANGELOG automático con standard-version.

Documentación API → OpenAPI / Swagger auto de tsoa o next-swagger-doc.

Manual técnico en /docs/ (estructura, scripts, diagramas).

6.12 — Matriz de responsabilidades (RACI simplificada)
Área	Responsable	Soporte	Informa
Infraestructura	DevOps	Johan	Gerencia
Seguridad	DevOps	SysAdmin	Gerencia
Aplicación	Desarrolladores	QA	DevOps
Datos/Backup	DBA	DevOps	Gerencia
Notificaciones	Integraciones	Desarrollo	Operaciones
6.13 — Checklist de go-live

 Todas las rutas bajo HTTPS.

 Variables .env sin hardcode.

 Cuentas admin con 2FA.

 Backups probados y verificados.

 Monitoreo activo + alertas email/Telegram.

 Sentry recibiendo eventos.

 CI/CD ejecuta tests antes de deploy.

 Bloque 7 — Documentación Final y Entregables
7.1 — Objetivo

Entregar un paquete completo que contenga:

Documentación funcional (qué hace el sistema).

Documentación técnica (cómo está construido).

Guía de instalación y mantenimiento.

Manual de usuario para los dos paneles.

Estructura del repositorio con README principal.

7.2 — Estructura del repositorio
agendamiento/
├── app/                     # Next.js + API
│   ├── app/                 # rutas y layouts
│   ├── components/          # UI shadcn + custom
│   ├── features/            # módulos (turnos, reglas, admin, user)
│   ├── lib/                 # contratos, helpers, hooks, api client
│   ├── server/              # servicios Prisma, reglas, colas
│   ├── prisma/              # esquema y migraciones
│   ├── public/              # assets estáticos
│   └── tests/               # pruebas unitarias y e2e
├── deploy/
│   ├── docker-compose.yml
│   ├── Caddyfile
│   └── scripts/
│       ├── backup.sh
│       └── restore.sh
├── docs/
│   ├── arquitectura.md
│   ├── api.md
│   ├── base_datos.md
│   ├── reglas_y_kpi.md
│   ├── ui_ux.md
│   ├── seguridad_y_ci_cd.md
│   └── manual_usuario.md
├── .env.example
├── README.md
└── package.json

7.3 — README principal (resumen ejecutivo)
🧭 Propósito

Sistema web integral para el agendamiento y control de turnos de vehículos en planta. Permite gestionar cupos, reglas, documentos, notificaciones y análisis de KPIs en tiempo real.

⚙️ Tecnologías

Next.js 15 · React 19 · TailwindCSS · Prisma · PostgreSQL · Redis · BullMQ · Docker · Caddy

🧱 Módulos

Panel de usuario (conductores/empresas)

Panel de administración (planificadores y operativos)

Motor de reglas dinámico

Gestión documental y validaciones

Sistema de notificaciones (WhatsApp/email)

KPIs y simulador de capacidad

🚀 Instalación rápida
git clone https://github.com/yumatech/agendamiento.git
cd agendamiento
cp .env.example .env
docker compose up -d --build


App disponible en https://agendamiento.yumatech.online

👤 Acceso inicial

Usuario: admin@demo.com
Contraseña: Admin123!

7.4 — Manual técnico resumido

Instalación

Clonar repositorio.

Configurar .env.

Ejecutar npm install && npx prisma migrate deploy.

Levantar docker compose up -d.

Desarrollo

npm run dev → entorno local con hot reload.

npx prisma studio → inspección de BD.

npm run test → pruebas unitarias.

Despliegue

Pipeline CI/CD de GitHub Actions.

VPS con Caddy reverse proxy y certificados SSL automáticos.

Backup / restore

docker exec postgres_agendamiento pg_dump -U agendamiento_user agendamiento_db > backup.sql
docker exec -i postgres_agendamiento psql -U agendamiento_user -d agendamiento_db < backup.sql

7.5 — Manual de usuario
Panel de Usuario

Inicio → elige planta, fecha, hora.

Datos → ingresa cédula, nombre, placa.

Confirmación → recibe QR del turno y mensaje WhatsApp.

Mis turnos → cancelar o reprogramar.

Documentos → subir licencias y verificar vigencia.

Panel de Administración

Dashboard → métricas del día.

Agenda → ver turnos por hora/muelle.

Turnos → filtrar, cambiar estados, enviar notificaciones.

Reglas → definir límites o bloqueos.

KPIs → revisar SLA, ocupación y cancelaciones.

Simulador → proyectar demanda futura.

7.6 — Diagramas esenciales

1. Flujo de turno

CREADO → VALIDANDO → CONFIRMADO → EN_PROCESO → ATENDIDO → CERRADO
          ↓                      ↓
       RECHAZADO           CANCELADO/NO_SHOW


2. Arquitectura

[Usuario/Conductor]
       ↓
  Next.js API Routes
       ↓
   Prisma ORM
       ↓
 [PostgreSQL] ←→ [Redis (colas)]
       ↓
 [Worker BullMQ] → [WhatsApp/Email/Webhooks]

7.7 — Checklist de entrega
Ítem	Estado
Documentación funcional	✅
Esquema BD y migraciones	✅
API y casos de uso	✅
UI/UX detallado	✅
Módulo KPI + simulador	✅
Docker + CI/CD	✅
Manual técnico y de usuario	✅
Seguridad y backups	✅
7.8 — Siguientes pasos recomendados

Implementar autenticación SSO corporativa (Azure AD o Keycloak).

Añadir módulo de permisos granulares (scopes).

Ampliar simulador con IA predictiva (series temporales Prophet).

Exponer API externa REST/GraphQL documentada con OpenAPI.

Conectar con Power BI / Power Automate para reportes extendidos.
