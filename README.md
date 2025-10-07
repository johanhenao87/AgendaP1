# Agendamiento Planta 1

## 🧭 Propósito
Sistema web integral para gestionar el agendamiento de turnos de vehículos en planta. Permite a conductores y planners coordinar
cupos, validar documentos, monitorear estados en tiempo real y analizar KPIs operativos.

## ⚙️ Tecnologías
- **Frontend y backend**: Next.js 15 (App Router), React 19, TypeScript.
- **UI**: Tailwind CSS, componentes propios inspirados en shadcn/ui.
- **Estado y validaciones**: React Query (planificado), Zod/Prisma (planificado).

## 🧱 Módulos incluidos
- Landing pública con resumen funcional.
- Flujo demo de creación de turno para conductores (slot grid, autocompletado y confeti de confirmación).
- Panel simulado para planners con tabla viva, cancelación con tolerancia y tablero drag & drop de muelles.
- Vista de KPIs con filtros, heatmap, gráficos (pie y línea) y simulador visual de capacidad.
- Endpoint de salud (`/api/health`) para monitoreo básico.
- Toggle de tema claro/oscuro, selector ES/EN y sistema de toasts accesibles.

> ℹ️ La lógica de negocio, persistencia y autenticación están representadas con datos simulados. Los módulos de API real, reglas dinámicas y colas se integrarán en siguientes iteraciones.

## 🚀 Puesta en marcha
```bash
npm install
npm run dev
```

Visita `http://localhost:3000` para explorar la interfaz demo.

### Scripts disponibles
- `npm run dev` — Ejecuta el entorno de desarrollo.
- `npm run build` — Genera la build de producción.
- `npm run start` — Sirve la build generada.
- `npm run lint` — Ejecuta ESLint.
- `npm run typecheck` — Verifica tipos TypeScript sin emitir artefactos.

## 📁 Estructura del repositorio
```
app/
├── (app)/               # Áreas autenticadas (panel y KPIs)
├── (public)/            # Flujo demo para conductores
├── api/                 # Rutas serverless (healthcheck)
├── layout.tsx           # Layout raíz
└── page.tsx             # Landing principal
components/              # UI reutilizable
lib/                     # Utilidades y datos simulados
public/                  # Assets estáticos (pendiente)
docs/                    # Documentación técnica y funcional existente
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
- UI navegable para los módulos clave descritos.
- Simulación de turnos, reglas, KPIs y estados vacíos en la interfaz.
- Scripts de desarrollo y build configurados.
- Endpoint de salud listo para integraciones de monitoreo.
- Páginas de error (404/500) y temas listo para producción.

## 🔭 Próximos pasos sugeridos
- Conectar la app con una base de datos real y Prisma ORM.
- Integrar autenticación corporativa (Azure AD / Keycloak).
- Añadir motor de reglas dinámico y colas BullMQ.
- Implementar API pública documentada con OpenAPI.
- Automatizar despliegue con Docker, Caddy y pipelines CI/CD.
