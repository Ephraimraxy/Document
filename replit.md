# OnlyOffice Document Integration App

## Overview

This is a web-based document editing application that integrates OnlyOffice Document Server to provide online document creation and editing capabilities. The application allows users to create Word documents, Excel spreadsheets, and PowerPoint presentations directly in their browser using the OnlyOffice editor embedded within a React-based frontend.

The application follows a modern full-stack architecture with a React frontend and Express backend, designed for simplicity and productivity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system

**Design System:**
- Custom color palette with light/dark mode support
- Productivity-focused design inspired by Notion, Linear, and Google Docs
- Consistent spacing using Tailwind's scale (4, 6, 8, 12, 16)
- Inter font family for typography
- Component library includes buttons, dialogs, forms, and specialized document components

**Key Frontend Components:**
- `CreateDocumentButton`: Entry point for document creation
- `DocumentTypeSelector`: Allows selection between Word, Excel, and PowerPoint
- `OnlyOfficeEditor`: Embeds the OnlyOffice Document Server editor
- `EditorHeader`: Displays document title and close functionality

**State Flow:**
1. User initiates document creation
2. Document type selection triggers API call to backend
3. Backend returns OnlyOffice configuration with JWT token
4. Frontend initializes OnlyOffice editor with configuration
5. Editor loads in full-screen mode for document editing

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **Build Tool**: esbuild for production bundling
- **Development**: tsx for TypeScript execution

**API Endpoints:**
- `POST /api/doc-config`: Generates OnlyOffice document configuration with JWT token
- `POST /api/callback`: Handles OnlyOffice document save callbacks

**Authentication & Security:**
- JWT tokens used to secure OnlyOffice integration
- Hardcoded secret for OnlyOffice: `6c7176c0e28d4653a9c7178cff054122`
- Session-based authentication infrastructure in place (connect-pg-simple)

**Storage Layer:**
- In-memory storage implementation (`MemStorage`) for user data
- Interface-based design (`IStorage`) allows easy migration to database
- Drizzle ORM configured for PostgreSQL (schema defined but not actively used)

### Database Schema

**ORM**: Drizzle ORM with PostgreSQL dialect

**Tables:**
- `users` table with fields:
  - `id`: UUID primary key (auto-generated)
  - `username`: Unique text field
  - `password`: Text field for hashed passwords

**Note**: Database is configured but currently using in-memory storage. The schema suggests future authentication features.

### External Dependencies

**OnlyOffice Document Server:**
- **Server URL**: `https://0df6a6d6.docs.onlyoffice.com`
- **Integration**: JavaScript API loaded from `/web-apps/apps/api/documents/api.js`
- **Purpose**: Provides the core document editing functionality
- **Communication**: Configuration passed via JWT tokens, callback URL for save operations

**Third-Party Services:**
- **Neon Database**: PostgreSQL provider (via `@neondatabase/serverless`)
- **Font**: Google Fonts (Inter font family)

**Key NPM Packages:**
- `@radix-ui/*`: Headless UI component primitives
- `@tanstack/react-query`: Server state management
- `jsonwebtoken`: JWT token generation for OnlyOffice
- `drizzle-orm`: Database ORM
- `tailwindcss`: Utility-first CSS framework
- `wouter`: Lightweight routing
- `vite`: Frontend build tool and dev server

**Development Tools:**
- Replit-specific plugins for error handling and development experience
- TypeScript for type safety across the stack
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)