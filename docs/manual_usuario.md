# Manual de usuario

> **Nota:** Este manual describe el comportamiento objetivo del sistema. La versión actual del repositorio ofrece una demo navegable con datos simulados y sin autenticación real.

## Introducción
La plataforma permite agendar turnos de ingreso a planta, gestionar documentación y monitorear el estado de atención. Existen dos perfiles principales: usuarios externos (conductores/empresas) y personal interno (planners, operativos, guardias).

## Acceso
- URL: https://agendamiento.yumatech.online
- Credenciales demo: `admin@demo.com` / `Admin123!`
- Soporte para cambio de idioma y tema desde el perfil del usuario.

## Panel de usuario (conductores/empresas)
1. **Inicio**
   - Selecciona planta, fecha y hora disponibles según capacidad y reglas activas.
2. **Datos del turno**
   - Ingresa cédula, nombre, placa y adjunta documentos requeridos.
   - El sistema autocompleta si la cédula/placa ya existe en la base.
3. **Confirmación**
   - Verifica el resumen, recibe QR y confirmación automática por WhatsApp/email.
4. **Mis turnos**
   - Visualiza próximos turnos, puede cancelar o reprogramar dentro de la tolerancia.
   - Si excede la ventana, se muestra el mensaje "Ya no puedes cancelar; contacta al operador".
5. **Documentos**
   - Gestiona licencias, SOAT, tecnomecánica y otros documentos con estado de vigencia.

## Panel de administración
1. **Dashboard**
   - Métricas del día (turnos por estado, ocupación de muelles, SLA promedio).
2. **Agenda**
   - Vista semanal/diaria de turnos con drag & drop hacia muelles disponibles.
   - Conflictos muestran toast de error; guardado automático con icono check.
3. **Turnos**
   - Listado con filtros avanzados (planta, estado, empresa, tipo vehículo).
   - Acciones rápidas: confirmar, cancelar, registrar no show, reenviar confirmación.
4. **Reglas**
   - Crear, editar y activar/desactivar reglas por planta.
   - Visualización de reglas activas con prioridad y vigencia.
5. **Notificaciones**
   - Historial de comunicaciones enviadas con iconografía por canal.
   - Botón "Reenviar confirmación".
6. **KPIs y simulador**
   - Formularios para ajustar `cupos por franja` y `duración promedio`.
   - Gráficos de proyección y tablas de resultados.

## Operaciones en planta (guardias)
- Módulo rápido para escanear QR, validar documentos pendientes y registrar ingreso.
- Cambio de estado a `EN_PROCESO` al realizar check-in.
- Registro de salida para cerrar turno.

## Buenas prácticas
- Mantener documentos actualizados para evitar rechazos.
- Revisar notificaciones previas al turno y llegar dentro de la ventana asignada.
- Administradores: monitorear alertas de capacidad y ajustar reglas cuando sea necesario.

## Soporte
- Canal de soporte interno disponible vía WhatsApp/Telegram.
- Logs de auditoría permiten rastrear cualquier acción.
