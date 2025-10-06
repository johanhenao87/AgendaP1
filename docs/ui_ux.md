# Lineamientos UI/UX

## Principios de diseño
- Estilo profesional y artístico con modo claro/oscuro y paletas alternativas.
- Enfoque mobile-first para conductores, con layouts responsive para planners.
- Accesibilidad AA: contraste, navegación por teclado, labels claros, soporte lector de pantalla.
- Microinteracciones sutiles (Framer Motion) en transiciones y feedback.
- Internacionalización ES/EN desde el inicio con textos gestionados por i18next.

## Flujos principales
### Creación de turno (usuario)
1. Selección de planta, fecha y hora disponibles.
2. Formulario de datos (cédula, nombre, placa, tipo vehículo, documentos).
3. Confirmación con resumen y generación de QR + WhatsApp.
4. Pantalla de éxito con confeti ligero y CTA para ver turnos.

### Gestión de turnos (planner)
- Agenda tipo calendario con franjas y muelles.
- Drag & drop de turnos a muelles disponibles; conflictos muestran toast de error.
- Guardado automático con icono de verificación y estado de sincronización.

### Validación documental
- Listado de requisitos con estados (`pendiente`, `aprobado`, `vencido`).
- Botón para solicitar reenvío o subir nuevamente.
- Alertas visuales cuando falta documentación crítica.

## Estados vacíos y errores
- 404: mensaje "Ruta no encontrada 🧭" + botón a inicio.
- 500: mensaje humano "Algo salió mal; intentemos otra vez." con acción de reintentar.
- Empty states con mensajes claros y CTA relevantes (p.e. "No tienes turnos programados" → "Crear turno").

## Componentes clave
- Cards resumen de turnos con chips de estado y tiempo restante.
- Timeline de eventos para auditoría en detalle de turno.
- Sección "Comunicaciones enviadas" con iconografía por canal.
- Botón "Reenviar confirmación" en detalle.
- Heatmaps, pie charts y line charts cargados de forma lazy.

## Feedback y accesibilidad
- Skeleton loaders con animación shimmer para listados.
- Tolerancia y tiempos mostrados en copy claro (ej. "Puedes cancelar hasta 2h antes").
- Tooltips y ayudas contextuales para reglas y KPIs.

## Internacionalización
- Arquitectura con namespaces (`common`, `agenda`, `turnos`, `admin`).
- Switch de idioma persistente por usuario (`usuarios.idioma`).
- Formatos de fecha/hora adaptados al `timezone` de la planta.
