# Arquitectura técnica

## Visión general
El sistema combina un frontend Next.js 15 (App Router) y un backend basado en rutas API y server actions para procesar la lógica de agendamiento. Se priorizan componentes de servidor para listados extensos, mientras que formularios y dashboards funcionan como componentes cliente con React Query para mutaciones y revalidaciones.

## Frontend
- **Tecnologías:** React 19 con TypeScript y Tailwind CSS ejecutándose en Next.js 15 (App Router).
- **Estructura:** vistas agrupadas en la carpeta `app/` (`(public)` para flujo de conductor, `(app)` para paneles) y componentes reutilizables en `components/`. Datos simulados y utilidades viven en `lib/`.
- **Estado y datos:** Se utiliza un contexto propio para idioma y toasts. React Query está configurado pero actualmente solo como base para futuras integraciones de datos en tiempo real.
- **UX adicional:** Tema claro/oscuro, selector ES/EN, skeleton loaders básicos y animación de confeti en la confirmación de turno.

## Backend
- **Estado actual:** Solo se expone el endpoint `/api/health` para monitoreo. El resto de interacciones se simula en el cliente.
- **Plan futuro:** Incorporar rutas API y server actions respaldadas por una base de datos relacional (PostgreSQL/Prisma) y validaciones con Zod.
- **Integraciones planificadas:** Motor de reglas, colas BullMQ con Redis y conectores externos (WhatsApp, correo, webhooks) se documentan como próximos hitos.

## Infraestructura
- **Entorno de desarrollo:** Ejecución local mediante `npm run dev`.
- **Planificado:** Docker Compose para app + base de datos + Redis, proxy inverso con Caddy y despliegue en VPS mediante GitHub Actions.
- **Escalabilidad prevista:** Separar futuros workers de colas y habilitar CDN para assets estáticos.

## Observabilidad y monitoreo
- **Actual:** Consola del navegador y el healthcheck `/api/health`.
- **Próximo hito:** Incorporar logging estructurado (pino), trazas con OpenTelemetry y alertas con Sentry/Healthchecks.

## Seguridad
- **Actual:** Flujo demo sin autenticación ni almacenamiento real.
- **Planificado:** Auth.js/NextAuth con SSO corporativo opcional, rate limiting en Redis y auditoría detallada al incorporar persistencia.

## Respaldo y continuidad
- Backups automáticos usando `pg_dump` y posible integración con `restic`.
- Planificado: Scripts de `deploy/scripts/backup.sh` y `restore.sh` para recuperación rápida.
- Estrategia de retención 30/90 días y pruebas periódicas de restauración.

> **Nota:** Los scripts `deploy/scripts/backup.sh` y `deploy/scripts/restore.sh` aún no forman parte del repositorio y serán incorporados en entregables futuros.

## Roadmap técnico
- Implementar SSO corporativo (Azure AD/Keycloak).
- Añadir permisos granulares y scopes.
- Optimizar simulador con modelos predictivos (Prophet) y exponer API pública documentada.
