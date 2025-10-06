# API y casos de uso

## Principios generales
- Todas las entradas se validan con Zod y devuelven errores explícitos.
- Autenticación vía Auth.js con JWT; scopes RBAC (`admin`, `planner`, `operativo`, `guardia`, `usuario`).
- Respuestas JSON con metadatos de auditoría y enlaces de navegación.
- Rate limiting y logging de auditoría en cada mutación.

## Máquina de estados del turno
```
CREADO → VALIDANDO → CONFIRMADO → EN_PROCESO → ATENDIDO → CERRADO
            ↓                   ↓
        RECHAZADO         CANCELADO_USUARIO
                               CANCELADO_ADMIN
                               NO_SHOW
```
Las transiciones se controlan en server actions respaldadas por el motor de reglas.

## Casos de uso principales
### Portal de usuario
1. **Crear turno**
   - `POST /api/turnos`
   - Valida cédula/placa, reglas vigentes y disponibilidad de franja.
   - Retorna QR, confirmación por WhatsApp/email y resumen del turno.
2. **Consultar turnos propios**
   - `GET /api/turnos?usuario=me`
   - Soporta filtros por fecha, estado y planta.
3. **Cancelar turno**
   - `POST /api/turnos/{id}/cancelar`
   - Evalúa tolerancia; si se excede responde con mensaje para contactar al operador.
4. **Reprogramar turno**
   - `POST /api/turnos/{id}/reprogramar`
   - Revalida reglas y disponibilidad antes de confirmar la nueva franja.

### Panel de administración
1. **Agenda y asignación de muelles**
   - `GET /api/agenda?planta={id}&fecha={yyyy-mm-dd}` retorna slots por hora y muelle.
   - `POST /api/agenda/{turnoId}/asignar` con `muelle_id` y `prioridad`.
   - Drag & drop en UI dispara actualización; si hay solape devuelve error tipo toast.
2. **Gestión de reglas**
   - `GET /api/reglas`
   - `POST /api/reglas` para crear reglas (`tipo_regla`, `condiciones`, `accion`).
   - `PATCH /api/reglas/{id}` para activar/desactivar o ajustar parámetros.
3. **Validación documental**
   - `POST /api/documentos/upload` con metadata (`tipo_documento`, `vigencia`).
   - Integración con servicios externos para verificación opcional.
4. **Notificaciones**
   - `POST /api/notificaciones/reenviar` para forzar un reenvío.
   - Registro histórico en `/api/turnos/{id}/comunicaciones`.
5. **Simulador de agenda**
   - `POST /api/simulador` recibe `cupos_por_franja`, `duracion_promedio`, `horizonte`.
   - Devuelve proyección en JSON usada para charts de capacidad.

### Auditoría y reporting
- `GET /api/auditoria` lista eventos con filtros (usuario, módulo, rango fechas).
- `GET /api/kpis` agrupa métricas clave (turnos por estado, ocupación, SLA, cancelaciones).
- `GET /api/kpis/heatmap` genera ocupación semanal por muelle.

## Contratos destacados
```ts
// Ejemplo de creación de turno
const CrearTurnoSchema = z.object({
  plantaId: z.string().uuid(),
  fecha: z.string().date(),
  hora: z.string(),
  cedula: z.string().min(5),
  placa: z.string().toUpperCase(),
  tipoVehiculo: z.enum(["TRACTOMULA","CAMIONETA","DOBLE_TROQUE","OTRO"]),
  documentos: z.array(z.object({
    tipo: z.enum(["LICENCIA","SOAT","TECNICOMECANICA","TARJETA_PROPIEDAD","CEDULA","OTRO"]),
    url: z.string().url(),
    vigencia: z.string().date().optional()
  }))
});
```

## Webhooks y eventos
- **Webhook externo:** `/api/webhooks/turnos` envía eventos `CREADO`, `CONFIRMADO`, `CANCELADO`, `NO_SHOW`.
- **Worker BullMQ:** colas `notificaciones`, `recordatorios`, `kpi_snapshots`.
- **Notificaciones:** plantillas con variables (`turno.codigo`, `planta.nombre`, `fecha_formateada`).

## Manejo de errores
- Códigos estandarizados (`RULE_VIOLATION`, `CAPACITY_EXCEEDED`, `DOCUMENTO_VENCIDO`).
- Respuestas con `traceId` para correlacionar en OpenTelemetry.
- Mensajes de usuario en español e inglés listos para i18n.
