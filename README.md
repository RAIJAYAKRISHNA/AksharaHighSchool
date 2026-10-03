# Akshara High School Website

Website and portal for **Akshara High School** (Nursery to Class 10): public pages, admission enquiries, a gallery and events, and sign-in with a dashboard for admins and students.

> Page text (about, academics, facilities, and so on) is **sample content** until the school confirms it. See `docs/SCHOOL-REQUIREMENTS.md`.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JavaScript, React Router, CSS, Axios |
| Backend | Java 21 target, Spring Boot 4, Maven (wrapper), Spring Data JPA / Hibernate, Spring Security (JWT) |
| Database | PostgreSQL |

The React app talks only to the Spring Boot API. It never connects to the database.

## Project structure

    akshara-high-school/
    ├── frontend/   React app (src/pages, components, services, hooks, context, styles)
    ├── backend/    Spring Boot API (controller, service, repository, entity, dto, security, config)
    ├── database/   schema.sql (tables) and seed.sql (development sample data)
    └── docs/       API.md and SCHOOL-REQUIREMENTS.md

## Prerequisites

- JDK 21 or newer (any version Spring Boot supports)
- Node.js 18 or newer
- PostgreSQL 14 or newer
- No Maven install needed: the project includes the Maven Wrapper (`mvnw.cmd`)

## First-time setup (Windows PowerShell)

1. **Database.** Create a login role and database (pgAdmin Query Tool, connected as `postgres`):

       CREATE ROLE akshara_app WITH LOGIN PASSWORD '<choose a strong password>';
       CREATE DATABASE akshara_school OWNER akshara_app;

2. **Tables and sample data.** Run `database/schema.sql`, then `database/seed.sql` (development only), against `akshara_school` as `akshara_app`.
   With psql: `psql -U akshara_app -h localhost -d akshara_school -v ON_ERROR_STOP=1 -f database\schema.sql`

3. **Backend settings.** In `backend/`, copy `.env.example` to `.env` and fill in every value
   (database password, `JWT_SECRET` of 32+ random characters, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
   `.env` is ignored by Git. Never commit it.

4. **Frontend settings.** In `frontend/`, copy `.env.example` to `.env` (default API: `http://localhost:8080/api`).

## Run

    # terminal 1
    cd backend
    .\mvnw.cmd spring-boot:run

    # terminal 2
    cd frontend
    npm install
    npm run dev

Open http://localhost:5173. The first backend start creates the admin account from `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
Changing those values later does not change an existing admin. Health check: http://localhost:8080/actuator/health

## Accounts

| Role | Username | Created by |
|---|---|---|
| Admin | the email in `ADMIN_EMAIL` | automatically on first start |
| Student | admission number | the admin, in Dashboard > Students (a temporary password is shown once; the student must change it) |

There is no public sign-up.

## Tests and checks

    cd backend  && .\mvnw.cmd test        # automated API and security tests (in-memory H2, never touches PostgreSQL)
    cd frontend && npm run build          # production build
    cd frontend && npm audit --omit=dev   # dependency vulnerabilities

## Deployment notes

- Serve over **HTTPS**. Build the frontend with `npm run build` and serve `frontend/dist` with a web server that also
  returns `index.html` for unknown paths (React Router) and proxies `/api` to the backend. With that setup build with `VITE_API_BASE_URL=/api`.
- Build the backend with `.\mvnw.cmd package` and run `target/school-0.1.0.jar` with the environment variables from `backend/.env.example`.
- Use a **new** `JWT_SECRET`, admin password and database password for production. Do not load `seed.sql`.
- Set `CORS_ALLOWED_ORIGINS` to the real site address only.
- Behind a proxy, set `SERVER_FORWARD_HEADERS_STRATEGY=framework` so login throttling sees real client addresses.
  The throttle is in memory, so also rate-limit `/api/auth/login` at the proxy.
- Schedule regular PostgreSQL backups. Student records involve minors, so confirm the school's data protection obligations.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Backend: `Could not resolve placeholder 'DB_PASSWORD'` | `backend/.env` is missing or you started the app outside `backend/` |
| Backend: `Schema-validation: missing table` | Run `database/schema.sql` |
| Forms show "could not reach the server" | Backend is not running, or CORS origin does not match the frontend address |
| Blank page | Open the browser console (F12) and read the first red error |