# API Reference

Base URL (development): `http://localhost:8080/api`. All bodies are JSON.

## Authentication

Sign in with `POST /auth/login`, then send `Authorization: Bearer <token>` on protected requests.
Tokens expire after `JWT_EXPIRY_MINUTES` (default 120). Admin routes need role `ADMIN`; student routes need role `STUDENT`.

## Errors

    { "message": "Human-readable text", "errors": { "fieldName": "Field message" } }

`errors` appears only for validation failures (400).

| Status | Meaning |
|---|---|
| 400 | Validation failed or malformed body |
| 401 | Not signed in, token expired, wrong login, or account deactivated mid-session |
| 403 | Signed in but the role is not allowed; or login for a deactivated account |
| 404 | Resource not found |
| 409 | Conflict (e.g. admission number already exists) |
| 429 | Too many failed logins (5 per username and address, 15 minutes) |
| 500 | Unexpected error (details are only in the server log) |

## Public endpoints

| Method | Path | Body or query | Success |
|---|---|---|---|
| POST | `/enquiries` | `studentName`, `dateOfBirth` (yyyy-MM-dd, past), `applyingFor` (`Nursery`, `LKG`, `UKG`, `Class 1` to `Class 10`), `parentName`, `phone` (10 digits, starts 6-9), `email`, `message` (optional, max 1000) | 201 `{message}` |
| POST | `/contact` | `name`, `email`, `phone` (optional), `subject`, `message` (10-1000) | 201 `{message}` |
| GET | `/events` | none | 200 `[{id, title, description, eventDate (or null), location}]` dated events first |
| GET | `/gallery` | `?category=` (optional) | 200 `[{id, title, description, category, imageUrl (or null)}]` |
| GET | `/actuator/health` (no `/api`) | none | 200 `{status: "UP"}` |

## Authentication endpoints

| Method | Path | Body | Success |
|---|---|---|---|
| POST | `/auth/login` | `username`, `password` | 200 `{token, tokenType, expiresInSeconds, user: {id, username, fullName, role, mustChangePassword}}` |
| GET | `/auth/me` | none (signed in) | 200 user object |
| POST | `/auth/change-password` | `currentPassword`, `newPassword` (8-64 chars, a letter and a number) | 200 `{message}` |

## Student endpoint (role STUDENT)

| Method | Path | Success |
|---|---|---|
| GET | `/student/profile` | 200 `{id, admissionNumber, fullName, className, section, guardianName, guardianPhone, enabled, mustChangePassword, createdAt}` |

## Admin endpoints (role ADMIN)

| Method | Path | Body | Success |
|---|---|---|---|
| GET | `/admin/summary` | none | 200 `{newEnquiries, unreadMessages, students, events, galleryItems}` |
| GET | `/admin/enquiries` | none | 200 list, newest first |
| PATCH | `/admin/enquiries/{id}/status` | `{status}`: `NEW`, `CONTACTED` or `CLOSED` | 200 enquiry |
| GET | `/admin/contact-messages` | none | 200 list, newest first |
| POST | `/admin/contact-messages/{id}/read` | none | 200 message |
| GET | `/admin/students` | none | 200 list |
| POST | `/admin/students` | `admissionNumber`, `fullName`, `className`, `section?`, `guardianName?`, `guardianPhone?` | 201 `{student, temporaryPassword}` (password shown once) |
| PUT | `/admin/students/{id}` | same fields as create | 200 student |
| POST | `/admin/students/{id}/activate` or `/deactivate` | none | 200 student |
| POST | `/admin/students/{id}/reset-password` | none | 200 `{student, temporaryPassword}` |
| POST | `/admin/events` | `title`, `description`, `eventDate?` (yyyy-MM-dd), `location?` | 201 event |
| PUT | `/admin/events/{id}` | same | 200 event |
| DELETE | `/admin/events/{id}` | none | 204 |
| POST | `/admin/gallery` | `title`, `description?`, `category`, `imageUrl?` (must start with http:// or https://) | 201 item |
| PUT | `/admin/gallery/{id}` | same | 200 item |
| DELETE | `/admin/gallery/{id}` | none | 204 |

`{id}` for students is the user id returned in `student.id`.