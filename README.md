# Complejo Deportivo UB — Sistema de Gestión de Reservas y Torneos

> **Proyecto de Construcción de Software — TP1 / Entrega de Código**  
> **Universidad de Belgrano — Facultad de Ingeniería y Tecnología Informática**  
> **Carrera:** Ingeniería en Informática  
> **Integrantes:** Norjean, Marco, Pérez del Cerro y Paiva (Grupo 3)  
> **Docente:** Prof. Lic. María Julia Monasterio  
> **Figma Reference:** `2QdhwIwbWtyS5qnPX9twOW` (Complejo Deportivo UB)

---

## 📌 1. Visión General del Proyecto

Plataforma web integral para la digitalización y administración del **Complejo Deportivo UB**. El sistema soluciona los problemas tradicionales de solapamiento de horarios, pérdidas económicas por turnos reservados sin asistencia, gestión manual de torneos de fin de semana, cálculo de tablas de posiciones y asignaciones arbitrales.

### Módulos Principales
1. **Gestión de Reservas y Canchas:** Turnos de 1 hora con seña obligatoria del 30%, política de cancelación pre-24hs con reintegro y control de inasistencias con suspensión automática (3 faltas = 14 días).
2. **Administración de Torneos de Liga:** Competencias todos contra todos (Round-Robin) con control de cupos, aranceles, generación automática de fixtures (con fechas libres rotativas para equipos impares) y cálculo en tiempo real de la tabla de posiciones (PTS, PJ, PG, PE, PP, GF, GC, DG).
3. **Equipos y Nóminas:** Inscripción de equipos por parte del capitán, validación estricta de cupos por deporte e impedimento de que un jugador dispute un torneo en más de un equipo (RF-16).
4. **Panel de Arbitraje:** Visualización de encuentros asignados, actas digitales de partido, carga de resultados y registro de tarjetas/sanciones disciplinarias.
5. **Dashboard Administrativo, Reportes y Auditoría:** Métricas clave en tiempo real, ABM de canchas, supervisión de agenda y registro inmutable en `audit_log`.

---

## 🏛️ 2. Arquitectura del Repositorio y Separación de Capas

El repositorio está estrictamente desacoplado en tres capas independientes:

```
complejo-deportivo-ub/
│
├── database/                    # Persistencia y Modelo Relacional MySQL
│   ├── schema.sql               # DDL con 11 tablas, PKs BIGINT, FKs, CHECKs e índices
│   ├── seeds.sql                # Datos de prueba realistas (usuarios, canchas, torneos, partidos, etc.)
│   ├── procedures_and_triggers.sql # Stored procedures: posiciones automáticas, inasistencias, cancelaciones
│   └── README.md                # Documentación detallada del modelo relacional
│
├── backend/                     # API REST Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/              # Base de datos MySQL2 pool, variables ENV y almacén en-memoria
│   │   ├── middlewares/         # JWT Auth, RBAC (Cliente, Administrador, Arbitro), Error handler
│   │   ├── modules/
│   │   │   ├── auth/            # Login, registro, perfil y validaciones (RF-01)
│   │   │   ├── canchas/         # ABM canchas y disponibilidad con regla fin de semana (RF-02, RF-06)
│   │   │   ├── reservas/        # Turnos 1h, seña 30%, cancelación >24hs, inasistencias (RF-03, 04, 05)
│   │   │   ├── torneos/         # Creación, fixture Round-Robin, tabla posiciones (RF-07, 09, 11)
│   │   │   ├── equipos/         # Inscripción, invitaciones y control un equipo/torneo (RF-08, 14, 15, 16)
│   │   │   ├── partidos/        # Resultados, asignación de árbitro, estados (RF-10, 17, 18, 19)
│   │   │   ├── lista_espera/    # Turnos ocupados y reactivación automática (RF-24)
│   │   │   ├── sanciones/       # Tarjetas, observaciones y suspensiones (RF-20)
│   │   │   ├── notificaciones/  # Alertas automáticas de reservas, partidos y sanciones (RF-23)
│   │   │   └── reportes/        # Métricas de ocupación, ingresos y audit_log (RF-25, RF-26)
│   │   ├── routes.ts            # Agregador unificado de rutas REST (/api/v1)
│   │   └── server.ts            # Servidor Express con CORS, logger y arranque
│   ├── __tests__/               # Tests automatizados de reglas de negocio
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                    # SPA React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── api/                 # Cliente HTTP y llamadas tipadas a la API backend
│   │   ├── components/          # Componentes extraídos directamente de Figma (2QdhwIwbWtyS5qnPX9twOW)
│   │   ├── context/             # ComplejoContext con estado unificado y fallback resiliente
│   │   ├── data/                # Datos maestros y configuraciones de prueba
│   │   ├── screens/             # Pantallas correspondientes a los 13 frames de Figma
│   │   ├── App.tsx              # Ruteo y preview interactivo de pantallas
│   │   └── index.css            # Tokens de diseño, paleta oficial y estilos base
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml           # Orquestación con 1 comando: MySQL + Backend + Frontend
├── package.json                 # Scripts NPM raíz de orquestación
└── README.md
```

---

## 🎨 3. Especificación Visual y Figma (`2QdhwIwbWtyS5qnPX9twOW`)

El frontend implementa fielmente los fundamentos del **Manual de Marca y Diseño** y las pantallas de Figma:

### Paleta de Colores Oficial
| Token | Hex | Uso en la Aplicación |
| :--- | :--- | :--- |
| **Dark Surface** | `#293827` | Fondo principal de la aplicación y páginas |
| **Light Surface** | `#344732` | Tarjetas, contenedores y paneles |
| **Surface Alt** | `#3C503A` | Modales, encabezados y estados hover |
| **Primary** | `#65C556` | Botones de acción principal (CTA), estados libres y badges |
| **Text Primary** | `#FFFFFF` | Títulos y texto de alta jerarquía |
| **Text Secondary**| `#A3B89E` | Subtítulos, labels y descripciones complementarias |
| **Borders** | `#445941` | Separadores y bordes con grosor de 1px |
| **Ocupado / Error** | `#FF5C5C` (BG `#4C2B2B`) | Turnos ocupados y estados de alerta |
| **Mantenimiento**| `#FFA94D` (BG `#4C3F2B`) | Canchas en reacondicionamiento |

### Mapeo de Pantallas Figma
- `landing page` (id `224:2016`): [`LandingPage.tsx`](file:///c:/Users/seba/complejo-deportivo-ub/frontend/src/screens/LandingPage.tsx)
- `landing page - Arbitro` (id `278:94`) & `arbitro-Partidos` (id `294:25`): [`ArbitroPanel.tsx`](file:///c:/Users/seba/complejo-deportivo-ub/frontend/src/screens/ArbitroPanel.tsx)
- `mis-torneos` (id `242:1726`): [`MisTorneos.tsx`](file:///c:/Users/seba/complejo-deportivo-ub/frontend/src/screens/MisTorneos.tsx)
- `mis-reservas` (id `242:82`): [`MisReservas.tsx`](file:///c:/Users/seba/complejo-deportivo-ub/frontend/src/screens/MisReservas.tsx)
- `login-registro-desktop` (ids `196:15`, `242:7`, `274:57`): [`LoginScreen.tsx`](file:///c:/Users/seba/complejo-deportivo-ub/frontend/src/screens/LoginScreen.tsx)
- `admin-dashboard` (id `99:7`): [`AdminOverview.tsx`](file:///c:/Users/seba/complejo-deportivo-ub/frontend/src/screens/AdminOverview.tsx)
- `dashboard-admin-agenda` (id `197:15`): [`AdminAgenda.tsx`](file:///c:/Users/seba/complejo-deportivo-ub/frontend/src/screens/AdminAgenda.tsx)
- `admin-dashboard-gestionTorneos` (id `242:448`): [`AdminTorneo.tsx`](file:///c:/Users/seba/complejo-deportivo-ub/frontend/src/screens/AdminTorneo.tsx)
- `modal-inscripcion-torneo` (id `99:285`): [`InscripcionTorneoModal.tsx`](file:///c:/Users/seba/complejo-deportivo-ub/frontend/src/components/InscripcionTorneoModal.tsx)
- `modal-confirmacion-pago` (id `101:280`): [`ConfirmacionPagoModal.tsx`](file:///c:/Users/seba/complejo-deportivo-ub/frontend/src/components/ConfirmacionPagoModal.tsx)

---

## 📋 4. Matriz de Cumplimiento de Requerimientos Funcionales (RF)

| ID | Requerimiento Funcional | Backend | Frontend | Base de Datos |
| :--- | :--- | :--- | :--- | :--- |
| **RF-01** | Registro e Inicio de Sesión | `auth.service.ts` | `LoginScreen.tsx` | Tabla `usuario` |
| **RF-02** | Gestión de Canchas (ABM) | `canchas.service.ts` | `AdminCanchas.tsx` | Tabla `cancha` |
| **RF-03** | Reserva de Turnos (1 hora + Seña 30%) | `reservas.service.ts` | `LandingPage.tsx`, `ConfirmacionPagoModal.tsx` | Tabla `reserva` |
| **RF-04** | Cancelación (>24hs reintegra seña) | `reservas.service.ts` | `MisReservas.tsx`, `CancelacionConfirmModal.tsx` | Procedimiento `sp_cancelar_reserva` |
| **RF-05** | Control de Inasistencias (3 faltas = 14d) | `reservas.service.ts` | `AdminAgenda.tsx` | Procedimiento `sp_registrar_inasistencia` |
| **RF-06** | Disponibilidad fines de semana | `canchas.service.ts` | `LandingPage.tsx` | Consulta relacional `partido` vs `reserva` |
| **RF-07** | Creación de Torneos (modalidad liga) | `torneos.service.ts` | `AdminTorneo.tsx` | Tabla `torneo` |
| **RF-08** | Inscripción de Equipos | `equipos.service.ts` | `InscripcionTorneoModal.tsx` | Tabla `equipo` |
| **RF-09** | Organización de Partidos (Round-Robin) | `torneos.service.ts` | `AdminTorneo.tsx`, `MisTorneos.tsx` | Tabla `partido` |
| **RF-10** | Registro de Resultados | `partidos.service.ts` | `ArbitroPanel.tsx`, `AdminResultados.tsx` | Tabla `partido` |
| **RF-11** | Actualización Automática de Posiciones | `torneos.service.ts` | `MisTorneos.tsx`, `AdminTorneo.tsx` | Procedimiento `sp_actualizar_tabla_posiciones` |
| **RF-12** | Gestión de Jugadores | `auth.service.ts` | `MisReservas.tsx` | Tabla `usuario` |
| **RF-13** | Historial de Equipos | `equipos.service.ts` | `MisTorneos.tsx` | Tabla `equipo_jugador` |
| **RF-14** | Invitaciones a Equipos | `equipos.service.ts` | `InscripcionTorneoModal.tsx` | Tabla `equipo_jugador` |
| **RF-15** | Aceptación de Invitaciones | `equipos.service.ts` | `MisReservas.tsx` | Tabla `equipo_jugador` |
| **RF-16** | Control: Un solo equipo por torneo | `equipos.service.ts` | `InscripcionTorneoModal.tsx` | Constraint & validación |
| **RF-17** | Gestión y Designación de Árbitros | `partidos.service.ts` | `AdminResultados.tsx`, `ArbitroPanel.tsx` | FK `fk_arbitro_id` |
| **RF-18** | Programación de Partidos | `torneos.service.ts` | `AdminTorneo.tsx` | Tabla `partido` |
| **RF-19** | Estados de Partidos | `partidos.service.ts` | `ArbitroPanel.tsx` | ENUM `estado` |
| **RF-20** | Registro de Sanciones y Tarjetas | `sanciones.service.ts` | `ArbitroPanel.tsx` | Tabla `sancion` |
| **RF-21** | Estadísticas Deportivas | `torneos.service.ts` | `MisTorneos.tsx` | Columnas calculadas |
| **RF-22** | Historial de Resultados | `partidos.service.ts` | `MisTorneos.tsx` | Tabla `partido` |
| **RF-23** | Notificaciones | `notificaciones.service.ts`| `NotificationDropdown.tsx` | Tabla `notificacion` |
| **RF-24** | Lista de Espera | `lista_espera.service.ts` | `ListaEsperaModal.tsx` | Tabla `lista_espera` |
| **RF-25** | Reportes Administrativos | `reportes.service.ts` | `AdminReportes.tsx`, `AdminOverview.tsx` | Agregaciones SQL |
| **RF-26** | Auditoría del Sistema | `reportes.service.ts` | `AdminAuditoria.tsx` | Tabla `audit_log` |

---

## 🚀 5. Cómo Ejecutar el Proyecto

### Opción A: Con Docker Compose (Recomendado)
Todo el sistema (MySQL 8, Backend Node.js y Frontend Vite) arranca con un solo comando:
```bash
docker compose up -d
```
- **Frontend Web:** http://localhost:5173
- **Backend API:** http://localhost:4000/api/v1/health
- **Base de Datos MySQL:** `localhost:3306` (Base: `complejo_deportivo_ub`)

---

### Opción B: Ejecución Local en Desarrollo

#### 1. Instalar dependencias
```bash
# Instalar backend
cd backend
npm install
npm run build
cd ..

# Instalar frontend
cd frontend
npm install
npm run build
cd ..
```

#### 2. Correr los Tests Unitarios y de Reglas de Negocio
```bash
npm run test
```
*Verifica automáticamente el cálculo de señas al 30%, política >24hs, suspensión por inasistencias y generador Round-Robin.*

#### 3. Levantar Servidores
- **Iniciar Backend:**
  ```bash
  npm run dev:backend
  ```
  *(El backend cuenta con modo híbrido resiliente: se conecta automáticamente a MySQL si está disponible, o arranca en modo en-memoria con datos completos de seed para pruebas inmediatas).*

- **Iniciar Frontend:**
  ```bash
  npm run dev:frontend
  ```

---

## 🔑 6. Credenciales de Prueba (Demo Accounts)

| Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@complejoub.com` | `password123` |
| **Árbitro** | `arbitro@complejoub.com` | `password123` |
| **Cliente / Capitán** | `lucas@gmail.com` | `password123` |
| **Cliente Test Inasistencias** | `sancionado@gmail.com` | `password123` |

---

## 📡 7. Documentación de Endpoints (API REST v1)

| Módulo | Método | Endpoint | Descripción | Rol Requerido |
| :--- | :---: | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/register` | Registro de usuario | Público |
| **Auth** | `POST` | `/api/v1/auth/login` | Login y emisión de JWT | Público |
| **Auth** | `GET` | `/api/v1/auth/me` | Obtener perfil del usuario autenticado | Todos |
| **Canchas** | `GET` | `/api/v1/canchas` | Listar canchas activas | Público |
| **Canchas** | `GET` | `/api/v1/canchas/:id/disponibilidad` | Grilla de turnos de 1h y bloqueo fin de semana | Público |
| **Canchas** | `POST` | `/api/v1/canchas` | Crear cancha nueva | Administrador |
| **Reservas**| `POST` | `/api/v1/reservas` | Reservar turno (seña 30% simulada) | Cliente |
| **Reservas**| `GET` | `/api/v1/reservas/mis-reservas` | Mis reservas con cálculo de horas | Cliente |
| **Reservas**| `POST` | `/api/v1/reservas/:id/cancelar` | Cancelar reserva (regla >24hs devolución seña) | Cliente/Admin |
| **Reservas**| `PUT` | `/api/v1/reservas/:id/inasistencia` | Marcar falta (3 inasistencias = 14 días ban) | Administrador |
| **Torneos** | `GET` | `/api/v1/torneos` | Listar torneos de liga | Público |
| **Torneos** | `GET` | `/api/v1/torneos/:id/posiciones` | Tabla de posiciones calculada | Público |
| **Torneos** | `GET` | `/api/v1/torneos/:id/fixture` | Fixture y partidos de la competencia | Público |
| **Torneos** | `POST` | `/api/v1/torneos` | Crear torneo de liga | Administrador |
| **Torneos** | `POST` | `/api/v1/torneos/:id/generar-fixture` | Generador automático Round-Robin | Administrador |
| **Equipos** | `POST` | `/api/v1/equipos` | Inscripción de equipo por capitán | Cliente |
| **Equipos** | `POST` | `/api/v1/equipos/:id/invitar` | Invitar jugador a la nómina | Cliente (Capitán) |
| **Partidos**| `GET` | `/api/v1/partidos/arbitro/mis-partidos` | Partidos asignados al árbitro | Árbitro |
| **Partidos**| `PUT` | `/api/v1/partidos/:id/resultado` | Carga de resultado y actualización de tabla | Árbitro/Admin |
| **Lista Espera**| `POST` | `/api/v1/lista-espera` | Anotarse a turno ocupado | Cliente |
| **Sanciones**| `POST`| `/api/v1/sanciones` | Registrar tarjeta o sanción disciplinaria | Árbitro/Admin |
| **Notificaciones**| `GET` | `/api/v1/notificaciones` | Notificaciones del usuario | Todos |
| **Reportes**| `GET` | `/api/v1/reportes/dashboard` | Métricas generales y ocupación | Administrador |
| **Reportes**| `GET` | `/api/v1/reportes/auditoria` | Registro de auditoría administrativa | Administrador |
