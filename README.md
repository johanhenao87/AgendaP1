# Agendamiento Planta 1

## 🧭 Propósito
Sistema web integral para gestionar el agendamiento de turnos de vehículos en planta. Permite a conductores y planners coordinar cupos, validar documentos, monitorear estados en tiempo real y analizar KPIs operativos.

## ⚙️ Tecnologías propuestas
- **Frontend:** Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, React Query, i18next.
- **Backend:** Next.js API Routes, Prisma ORM, Zod, BullMQ (Redis) para colas, Webhooks.
- **Infraestructura:** PostgreSQL 15, Redis, Docker Compose, Caddy como reverse proxy, OpenTelemetry, Sentry.

## 🧱 Módulos clave
1. Panel de usuario (creación, consulta, cancelación y reprogramación de turnos).
2. Panel de administración con agenda en tiempo real, reglas y asignación de muelles.
3. Motor de reglas dinámico con validaciones y priorizaciones.
4. Gestión documental y validaciones automáticas.
5. Sistema de notificaciones multicanal (WhatsApp, email, SMS opcional).
6. KPIs y simulador de capacidad para análisis operativo.

## 🚀 Instalación rápida
```bash
git clone https://github.com/yumatech/agendamiento.git
cd agendamiento
cp .env.example .env
docker compose up -d --build
```

### Desarrollo local
```bash
npm install
npm run dev
```

### Pruebas y mantenimiento
- `npm run test` — pruebas unitarias y E2E.
- `npx prisma migrate deploy` — aplicar migraciones.
- `npx prisma studio` — inspección de datos.

## 👤 Acceso demo
- Usuario: `admin@demo.com`
- Contraseña: `Admin123!`

## 📁 Estructura propuesta del repositorio
```
agendamiento/
├── app/                     # Next.js (App Router + API)
│   ├── app/                 # layouts, rutas públicas e internas
│   ├── components/          # UI shadcn + componentes propios
│   ├── features/            # módulos: turnos, reglas, admin, user
│   ├── lib/                 # contratos, hooks, helpers, cliente API
│   ├── server/              # servicios Prisma, reglas, colas
│   ├── prisma/              # esquema y migraciones
│   ├── public/              # assets estáticos
│   └── tests/               # pruebas unitarias y E2E
├── deploy/                  # infraestructura (docker, caddy, scripts)
├── docs/                    # documentación funcional y técnica
├── .env.example
├── package.json
└── README.md
```

## 📚 Documentación disponible
- [Arquitectura](docs/arquitectura.md)
- [API y casos de uso](docs/api.md)
- [Modelo de datos](docs/base_datos.md)
- [Reglas y KPIs](docs/reglas_y_kpi.md)
- [Lineamientos UI/UX](docs/ui_ux.md)
- [Seguridad y CI/CD](docs/seguridad_y_ci_cd.md)
- [Manual de usuario](docs/manual_usuario.md)

## ✅ Checklist de entrega
- Documentación funcional y técnica.
- Esquema de base de datos y migraciones.
- API y casos de uso principales.
- UI/UX detallado con flujos clave.
- Módulo de KPIs y simulador documentado.
- Docker + CI/CD descritos.
- Manual técnico y de usuario.
- Seguridad, respaldos y monitoreo cubiertos.

## 🔭 Próximos pasos sugeridos
- Integrar SSO corporativo (Azure AD / Keycloak).
- Añadir permisos granulares por scopes.
- Extender simulador con predicciones (Prophet).
- Exponer API externa REST/GraphQL con OpenAPI.
- Integrar con Power BI / Power Automate para reportes.
