# replit.md

## Overview

This is a full-stack AI trading platform built with modern web technologies. The application is configured as a web-based trading platform with support for AI-powered strategy generation, market analysis, and user portfolio management. It features a React frontend with Express backend, utilizing PostgreSQL for data persistence and Drizzle ORM for database operations.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript (TSX)
- **Build Tool**: Vite for development and bundling
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (configured for Neon Database)
- **ORM**: Drizzle ORM with type-safe queries
- **Validation**: Zod for schema validation
- **Session Management**: Express sessions with PostgreSQL store

### Key Technologies
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Planned integration (infrastructure in place)
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Deployment**: Configured for production builds with static file serving

## Key Components

### Database Layer
- **Schema**: Centralized in `shared/schema.ts` using Drizzle ORM
- **Migrations**: Automated with drizzle-kit in `migrations/` directory
- **Connection**: Neon Database with WebSocket support for serverless deployment

### Frontend Components
- **Design System**: Custom CSS variables and themes in `client/src/styles/`
- **Component Library**: shadcn/ui components with consistent styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Progressive Web App**: Configured with service worker and manifest

### Backend Services
- **API Routes**: RESTful API structure in `server/routes.ts`
- **Storage Interface**: Abstracted storage layer with in-memory fallback
- **Middleware**: Request logging, error handling, and static file serving

## Data Flow

1. **Client Requests**: React frontend makes API calls to Express backend
2. **Server Processing**: Express routes handle business logic and database operations
3. **Database Operations**: Drizzle ORM provides type-safe database queries
4. **Response Flow**: JSON responses sent back to frontend for state updates
5. **Real-time Updates**: Prepared for WebSocket integration via Neon Database

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **class-variance-authority**: Type-safe component variants

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with hot module replacement
- **Backend**: tsx for TypeScript execution with auto-reload
- **Database**: Drizzle migrations for schema synchronization

### Production Build
- **Frontend**: Vite builds to `dist/public/` for static file serving
- **Backend**: ESBuild bundles server code to `dist/` directory
- **Deployment**: Single server serves both API and static files

### Environment Configuration
- **DATABASE_URL**: Required for PostgreSQL connection
- **NODE_ENV**: Controls development/production behavior
- **Build Scripts**: Separate build steps for frontend and backend

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 30, 2025. Initial setup