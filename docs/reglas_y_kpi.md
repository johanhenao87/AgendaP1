# Motor de reglas y KPIs

## Motor de reglas
- Se configura por planta con prioridad (`prioridad` numérica) y vigencia (`vigencia_desde`, `vigencia_hasta`).
- Tipos soportados:
  - `MAX_POR_EMPRESA`: limita turnos por empresa y franja.
  - `BLOQUEO_TIPO_VEHICULO`: restringe tipos de vehículo en rangos de fechas.
  - `PRIORIDAD_PROVEEDOR`: ajusta prioridad de atención.
  - `DOCUMENTO_OBLIGATORIO`: valida que se adjunten documentos específicos.
  - `CAPACIDAD_DIA` y `CAPACIDAD_FRANJA`: controla cupos globales.
  - `TOLERANCIA_CANCELACION`: define ventana para cancelar sin penalidad.
  - `VENTANILLA_OBLIGATORIA`: fuerza paso por ventanilla/prechequeo.
- Acciones posibles: `RECHAZAR`, `PRIORIZAR`, `WARN` (solo notifica).
- Evaluación en cadena: se ejecutan reglas activas ordenadas por prioridad, acumulando resultados y registrando auditoría.

## Flujo de validación
1. Reglas de capacidad bloquean si no hay cupos disponibles.
2. Validaciones documentales revisan vigencias y estados (`documentos.estado`).
3. Prioridades ajustan orden en agenda y asignación de muelles.
4. Si alguna regla devuelve `RECHAZAR`, se informa el motivo al usuario.

## KPIs operativos
1. **Turnos creados:** `COUNT(*) FROM turnos WHERE created_at BETWEEN $from AND $to`.
2. **Turnos confirmados:** porcentaje sobre turnos creados.
3. **Turnos atendidos vs no show:** comparación `ATENDIDO` vs `NO_SHOW`.
4. **Ocupación de muelles:** heatmap semanal con ocupación real vs capacidad.
5. **Tiempo medio de atención:** diferencia entre `inicio_real` y `fin_real` de `asignaciones_muelle`.
6. **Cancelaciones:** tasa por motivo (`CANCELADO_USUARIO`, `CANCELADO_ADMIN`).
7. **Cumplimiento SLA:** `% de turnos atendidos dentro de su ventana de atención`.
8. **Errores de reglas:** conteo de eventos `RULE_VIOLATION` por tipo de regla.

## Simulador de capacidad
- Inputs: `cupos_por_franja`, `duracion_promedio`, `horizonte_dias`, `distribucion_demanda`.
- Calcula ocupación teórica vs real usando datos históricos y reglas activas.
- Devuelve:
  - Proyección de turnos confirmados por día.
  - Recomendaciones de ajuste de cupos o apertura de muelles.
  - Alertas de cuellos de botella si la demanda supera la capacidad > 80%.

## Dashboard de análisis
- **Turnos por estado:** gráfico de torta.
- **Ocupación muelles:** heatmap semanal.
- **Tiempo medio de atención:** gráfica lineal por día.
- Filtros superiores por fecha, planta y tipo de vehículo.
- Exportación a CSV y enlace a Power BI.

## Alertas y notificaciones
- Recordatorios automáticos 24h y 2h antes de la cita.
- Alertas internas cuando la ocupación supera 90%.
- Reporte diario vía email a planners con KPIs clave y simulación actualizada.
