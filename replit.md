# DocFlow - Document Management System

## Overview

DocFlow is a comprehensive document management system built for organizational document workflow and collaboration. The application provides secure document upload, OnlyOffice integration for real-time editing, department-based document distribution, and notification management. It features a modern web interface built with React and TypeScript, supported by a PostgreSQL database with Drizzle ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing without the complexity of React Router
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with CSS custom properties for consistent theming and responsive design
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessible, customizable components
- **Form Management**: React Hook Form with Zod validation for robust form handling
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features
- **File Handling**: Multer middleware for multipart file uploads with memory storage
- **Authentication**: Firebase Authentication integration with custom middleware
- **API Design**: RESTful endpoints with consistent error handling and logging middleware

### Database Architecture
- **Database**: PostgreSQL as the primary relational database
- **ORM**: Drizzle ORM for type-safe database queries and schema management
- **Connection**: Neon Database serverless PostgreSQL for cloud hosting
- **Schema**: Well-defined tables for users, departments, documents, and notifications with proper relationships
- **Migrations**: Drizzle Kit for database schema migrations and version control

### Authentication & Authorization
- **Provider**: Firebase Authentication for user management and token verification
- **Strategy**: JWT tokens with Firebase Admin SDK for server-side verification
- **User Management**: Firestore integration for extended user profile data
- **Authorization**: Department-based access control for document visibility

### File Storage & Document Processing
- **Storage**: Firebase Cloud Storage for secure file persistence
- **Document Editing**: OnlyOffice integration for collaborative document editing
- **File Types**: Support for DOCX, XLSX, and PPTX formats with validation
- **Security**: JWT tokens for OnlyOffice document access control

### Real-time Features
- **Notifications**: Firebase Firestore real-time listeners for instant notification updates
- **Document Status**: Live updates for document review status and workflow changes
- **User Presence**: Real-time notification counters and status indicators

## External Dependencies

### Cloud Services
- **Firebase Authentication**: User authentication and session management
- **Firebase Firestore**: Real-time database for notifications and user profiles
- **Firebase Cloud Storage**: Secure file storage with access control
- **Neon Database**: Serverless PostgreSQL hosting for application data

### Document Processing
- **OnlyOffice Document Server**: Collaborative document editing capabilities
- **JWT**: Token-based security for OnlyOffice integration

### Development & Build Tools
- **Vite**: Frontend build tool with HMR and optimization
- **TypeScript**: Static type checking across the entire application
- **Drizzle Kit**: Database schema management and migration tool
- **ESBuild**: Backend bundling for production deployment

### UI & Styling Libraries
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Consistent icon library for the user interface
- **Date-fns**: Date manipulation and formatting utilities