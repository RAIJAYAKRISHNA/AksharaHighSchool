# Akshara High School Website

A full-stack website for **Akshara High School** (Nursery to Class 10).

> **Content note:** Most content is sample/demo text until confirmed by the school.

## Tech Stack

| Layer     | Technology                                              |
| --------- | ------------------------------------------------------- |
| Frontend  | React, Vite, JavaScript, React Router, CSS, Axios       |
| Backend   | Java, Spring Boot, Maven, Spring Data JPA, Hibernate    |
| Database  | PostgreSQL                                              |

## Architecture

```text
React App (Frontend)
        │  HTTP / REST
        ▼
Spring Boot (Backend)
        │  JPA / Hibernate
        ▼
PostgreSQL (Database)
```

The React app never connects directly to PostgreSQL.

## Project Structure

```text
akshara-high-school/
├── frontend/    React + Vite application
├── backend/     Spring Boot REST API
├── database/    schema.sql and seed.sql
├── docs/        API.md and SCHOOL-REQUIREMENTS.md
├── .gitignore
└── README.md
```

## Development Phases

1. Project Initialization
2. React Frontend Foundation
3. Global Design System
4. Navbar + Footer
5. Homepage
6. Other React Pages
7. Spring Boot Backend Foundation
8. PostgreSQL + JPA
9. REST APIs
10. React ↔ Backend Integration
11. Testing + Debugging
12. Final UI Polish + Documentation

## Prerequisites

- Node.js 18+ and npm
- JDK 17+
- Maven 3.9+
- PostgreSQL 14+

## Getting Started

Setup instructions will be added as each phase is completed.