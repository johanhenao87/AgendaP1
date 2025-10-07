# Arquitectura técnica

## Visión general
El sistema combina un frontend Next.js 15 (App Router) y un backend basado en rutas API y server actions para procesar la lógica de agendamiento. Se priorizan componentes de servidor para listados extensos, mientras que formularios y dashboards funcionan como componentes cliente con React Query para mutaciones y revalidaciones.

## Frontend
- **Tecnologías:** React 19 con TypeScript, TailwindCSS, shadcn/ui, Framer Motion para microinteracciones, i18next para internacionalización ES/EN.
- **Estructura:** módulos funcionales en `features/` (turnos, reglas, admin, user) respaldados por componentes reutilizables en `components/` y utilidades compartidas en `lib/`.
- **Estado y datos:** React Query gestiona caché y sincronización tras mutaciones; formularios usan React Hook Form + Zod.
- **UX adicional:** tema claro/oscuro, soporte mobile-first, accesibilidad AA y loaders skeleton con shimmer.

## Backend
- **Framework:** Next.js API Routes y server actions.
- **Persistencia:** Prisma ORM conectado a PostgreSQL 15 con migraciones versionadas.
- **Validaciones:** Zod para contratos; motor de reglas configurable con acciones `RECHAZAR`, `PRIORIZAR` o `WARN`.
- **Colas y jobs:** BullMQ con Redis para notificaciones, recordatorios y procesamientos diferidos.
- **Integraciones:** webhooks hacia sistemas externos (Power Automate, ERP), servicio WhatsApp Business API, SMTP para email y generación de PDFs/QR.

## Infraestructura
- **Contenedores:** Docker Compose orquesta servicios (app, PostgreSQL, Redis, Caddy).
- **Reverse proxy:** Caddy con certificados SSL automáticos.
- **Despliegue:** VPS Ubuntu 24.04; pipeline CI/CD en GitHub Actions con lint, tests y build antes de desplegar.
- **Escalabilidad:** posibilidad de separar workers BullMQ y habilitar CDN para assets.

## Observabilidad y monitoreo
- Logging estructurado con `pino` y formateo local `pino-pretty`.
- OpenTelemetry para traces y métricas.
- Sentry captura errores front y backend.
- Healthchecks expuestos para monitoreo externo y alertas vía email/Telegram.

## Seguridad
- Autenticación con Auth.js/NextAuth (credenciales y SSO corporativo opcional) y soporte 2FA.
- Rate limiting con Redis, headers de seguridad (Helmet) y CORS configurado.
- Auditoría con registros de usuario, IP, acción y cambios.
- Cifrado en reposo para datos sensibles y política de backups verificados.

## Respaldo y continuidad
- Backups automáticos usando `pg_dump` y posible integración con `restic`.
- Planificado: Scripts de `deploy/scripts/backup.sh` y `restore.sh` para recuperación rápida.
- Estrategia de retención 30/90 días y pruebas periódicas de restauración.

> **Nota:** Los scripts `deploy/scripts/backup.sh` y `deploy/scripts/restore.sh` aún no forman parte del repositorio y serán incorporados en entregables futuros.

## Roadmap técnico
- Implementar SSO corporativo (Azure AD/Keycloak).
- Añadir permisos granulares y scopes.
- Optimizar simulador con modelos predictivos (Prophet) y exponer API pública documentada.
