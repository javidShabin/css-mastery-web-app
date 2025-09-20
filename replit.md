# CSS Academy - Interactive CSS Learning Platform

## Overview

CSS Academy is a modern web application designed to teach CSS concepts through interactive lessons and hands-on coding exercises. The platform features a comprehensive curriculum covering CSS Grid, Flexbox, positioning, and other fundamental CSS topics. Students can progress through structured modules, complete coding exercises, and track their learning progress in real-time.

The application provides an integrated code editor with live preview functionality, allowing students to experiment with CSS properties and see immediate visual feedback. It includes a dashboard for tracking progress, individual lesson pages with detailed content, and a playground for free-form experimentation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript, implementing a single-page application (SPA) architecture. The application uses Wouter for lightweight client-side routing and TanStack Query for server state management and caching. The UI is constructed with shadcn/ui components built on Radix UI primitives, providing accessible and customizable interface elements.

The component architecture follows a modular design with reusable UI components, specialized feature components (code editor, progress tracking), and page-level components. State management is handled through React hooks and TanStack Query, with local state for UI interactions and server state for lesson data and progress tracking.

### Backend Architecture
The backend uses Express.js with TypeScript, implementing a REST API architecture. The server follows a layered pattern with route handlers, storage abstraction, and middleware for logging and error handling. The application currently uses an in-memory storage implementation with a well-defined interface that can be easily swapped for database persistence.

API endpoints are organized around core entities (modules, lessons, user progress) with CRUD operations. The storage layer provides data access abstraction, allowing for future database integration without changing business logic.

### Data Management
The application uses Drizzle ORM for database schema definition and management, configured for PostgreSQL. Database migrations are handled through Drizzle Kit. The schema defines core entities including users, lessons, modules, and user progress with proper relationships and constraints.

Current implementation includes an in-memory storage layer for development, with PostgreSQL schema ready for production deployment. User progress tracking includes completion status, timestamps, and code submission history.

### Development and Build System
The project uses Vite for fast development builds and hot module replacement. The build system supports both client and server TypeScript compilation, with esbuild handling server-side bundling for production. Tailwind CSS provides utility-first styling with custom design tokens and component variants.

Path aliases are configured for clean imports (@/ for client code, @shared for shared utilities), and the development environment includes error overlays and debugging tools optimized for the Replit platform.

### User Interface and Experience
The UI implements a responsive design with mobile-first considerations. The layout includes a persistent header with navigation and progress indicators, an expandable sidebar for lesson navigation (hidden on mobile), and a main content area that adapts based on the current view.

The code editor component provides syntax highlighting, live preview functionality, and tabbed interfaces for HTML, CSS, and result views. Progress tracking is visualized through progress rings, completion badges, and module-level statistics.

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks and context for state management
- **Express.js**: Backend web server framework
- **TypeScript**: Type safety across the entire application stack
- **Vite**: Development server and build tool with hot module replacement

### Database and ORM
- **Drizzle ORM**: Type-safe ORM for database operations and schema management
- **Drizzle Kit**: Database migration and schema management tools
- **@neondatabase/serverless**: PostgreSQL connection driver optimized for serverless environments

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Radix UI**: Accessible component primitives for complex UI elements
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library for consistent iconography

### State Management and Data Fetching
- **TanStack React Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management and validation
- **Wouter**: Lightweight client-side routing

### Development and Build Tools
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **ESBuild**: Fast bundling for production server builds
- **tsx**: TypeScript execution for development server

### Utilities and Helpers
- **clsx & tailwind-merge**: Conditional CSS class name management
- **date-fns**: Date manipulation and formatting utilities
- **zod**: Runtime type validation and schema definition
- **class-variance-authority**: Type-safe component variant management