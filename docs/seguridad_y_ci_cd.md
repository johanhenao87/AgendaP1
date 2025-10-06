# Seguridad y CI/CD

## Seguridad de la aplicación
- Autenticación con Auth.js/NextAuth, soporte SSO corporativo (OIDC) y 2FA opcional.
- RBAC granular con roles (`admin`, `planner`, `operativo`, `guardia`, `usuario`).
- Rate limiting mediante Redis/Upstash; protección CSRF y headers con Helmet.
- Validación exhaustiva de entradas con Zod y sanitización de datos.
- Logs de auditoría con usuario, IP, acción, estado previo/posterior y `traceId`.
- Cifrado en reposo para PII sensible (cédula, placa) y cifrado de secretos con Dotenv/SOPS.
- Política de backups diarios y verificación periódica de restauración.

## Seguridad operativa
- Acceso a infraestructura con SSH + claves, MFA en paneles administrativos.
- Monitoreo con alertas cuando se detectan errores críticos o tasa alta de rechazo.
- Revisiones de dependencia (Dependabot) y escaneo Snyk/Trivy en pipeline.

## Pipeline CI/CD
1. **Lint & typecheck:** ESLint, Prettier, TypeScript.
2. **Tests:** Vitest/Playwright y pruebas Prisma en base temporal.
3. **Build:** compilación Next.js y generación de assets.
4. **Deploy:** publicación a VPS mediante Docker Compose `pull` + `up -d`.
5. **Post-deploy:** ejecutar migraciones (`prisma migrate deploy`) y healthcheck.

## Infraestructura como código
- Archivos en `deploy/` incluyen `docker-compose.yml`, `Caddyfile` y scripts.
- Scripts `backup.sh` / `restore.sh` para administración de base de datos.
- Variables sensibles se administran vía `.env` cifrado o secrets del proveedor.

## Checklist previo a go-live
- Todas las rutas sirviéndose bajo HTTPS.
- Variables `.env` definidas sin valores por defecto inseguros.
- Cuentas admin con 2FA activo y contraseñas rotadas.
- Backups automatizados y restauración probada.
- Monitoreo y alertas activos (Sentry, Healthchecks).
- Pipeline CI/CD ejecutando pruebas antes de cada despliegue.
