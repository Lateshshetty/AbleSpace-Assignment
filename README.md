# AbleSpace Full Stack Developer Assessment

## Overview

Full-stack task management assessment built with Next.js App Router, NestJS, MongoDB Atlas, guest authentication, Google OAuth, reusable components, theme persistence, and a Part 2 product workflow write-up.

## Features

- Guest login that creates an isolated authenticated user.
- Google OAuth backend endpoints using configurable credentials.
- Protected task CRUD APIs.
- Task dashboard with create, edit, delete, status, priority, due date, loading, error, and empty states.
- Light/dark theme persistence.
- Responsive layout for mobile, tablet, and desktop.

## Technology Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, React Hook Form, Zod, Lucide React.
- Backend: NestJS, TypeScript, Mongoose, Passport JWT, Google OAuth, class-validator.
- Database: MongoDB Atlas.

## Architecture

The frontend calls a centralized API layer in `frontend/services`. Auth tokens are stored client-side for this assessment and attached as bearer tokens. The backend validates JWTs through a guard and always derives `userId` from the authenticated token, never from frontend input.

## Folder Structure

```text
frontend/
backend/
part2/
```

## Prerequisites

- Node.js 20 or newer.
- npm.
- MongoDB Atlas database.
- Google Cloud OAuth client for Google login.

## Environment Variables

Copy each `.env.example` to `.env` locally and fill in real values. Never commit `.env`.

Backend:

```env
MONGODB_URI=
MONGODB_DB_NAME=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
JWT_SECRET=
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
PORT=3001
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## MongoDB Setup

Create a MongoDB Atlas cluster, allow your current IP or deployment host, create a database user, and place the rotated connection string in `backend/.env` as `MONGODB_URI`.

## Google OAuth Setup

In Google Cloud Console, configure an OAuth 2.0 Client ID:

- Authorized JavaScript origin: `http://localhost:3000`
- Authorized redirect URI: `http://localhost:3001/auth/google/callback`

For production, add the deployed frontend origin and deployed backend callback URL.

## Local Development

```bash
npm install
npm run dev:backend
npm run dev:frontend
```

Frontend runs on `http://localhost:3000`. Backend runs on `http://localhost:3001`.

## API Documentation

- `POST /auth/guest`
- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /auth/me`
- `POST /auth/logout`
- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

## Authentication

Guest login creates a guest user and returns a JWT. Google OAuth creates or updates a Google user, then redirects to the frontend with a token. Task routes are protected by JWT auth.

## Theme System

Theme state is stored in `localStorage`, applied through CSS variables, and reflected across background, text, borders, panels, controls, and task cards.

## Task Management

Tasks include title, description, status, priority, due date, and timestamps. Backend queries are scoped by authenticated user.

## Responsive Design

The dashboard uses a collapsible sidebar, mobile top bar controls, touch-sized actions, and flexible grids for 320px through large desktop layouts.

## Deployment

Deploy frontend to Vercel and backend to Render, Railway, or similar. Configure production environment variables in each platform and update CORS to use the deployed frontend URL. Do not expose backend secrets in frontend variables.

## Part 2

See `part2/README.md`.

## Figma

The linked Figma was visible only in signed-out preview during implementation. The login frame was inspectable visually; Dev Mode measurements and all exact frame specs were not available without sign-in/permissions.

## Design Decisions

The UI follows the visible Figma login direction: compact centered authentication panel, black primary action, white secondary Google action, restrained borders, and clean spacing. The dashboard extends the same visual language without adding decorative gradients.

## Known Limitations

- Google OAuth requires valid local Google Cloud configuration to test end to end.
- Exact Figma Dev Mode values were unavailable in the current access context.
- Deployment must be completed with the user's hosting accounts.

## Security Notes

- Secrets are read only from environment variables.
- `.env` is ignored by git.
- Protected routes validate JWTs.
- Task ownership is enforced on the backend.

