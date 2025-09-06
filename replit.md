# Overview

AgroVision is an AI-powered crop disease diagnosis application designed to help farmers in rural areas, particularly in Odisha, India. The platform allows farmers to upload crop images for instant disease detection, receive treatment recommendations, and access agricultural resources. The application features multilingual support (English and Odia), voice assistance, weather monitoring, disease alerts, and marketplace integration for connecting farmers with local agricultural stores.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built with React and TypeScript using a modern component-based architecture:

- **UI Framework**: React with TypeScript for type safety and better development experience
- **Styling**: Tailwind CSS with a comprehensive design system using CSS variables for theming
- **Component Library**: Radix UI primitives with custom shadcn/ui components for consistent, accessible UI elements
- **State Management**: TanStack React Query for server state management and API caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
The server follows a RESTful API design pattern using Express.js:

- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules for modern JavaScript features
- **File Upload**: Multer middleware for handling crop image uploads with size and type validation
- **API Design**: RESTful endpoints for farmers, crop diagnosis, weather data, disease alerts, and marketplace
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Development**: Hot reload with automatic server restart using tsx

## Data Storage Solutions
The application uses a hybrid storage approach:

- **Production Database**: PostgreSQL with Drizzle ORM for type-safe database interactions
- **Database Client**: Neon serverless PostgreSQL for cloud deployment
- **Development Storage**: In-memory storage implementation for rapid development and testing
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Type Safety**: Generated TypeScript types from database schema using drizzle-zod

## Authentication and Authorization
Currently implements a basic user system with plans for expansion:

- **User Management**: Basic user creation and lookup functionality
- **Farmer Profiles**: Dedicated farmer entities with location, language preferences, and achievement tracking
- **Session Management**: Foundation for session-based authentication (connect-pg-simple ready)

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter), TanStack React Query
- **TypeScript**: Full TypeScript support across client, server, and shared code
- **Database**: Drizzle ORM, Neon Database serverless PostgreSQL driver
- **HTTP Client**: Native fetch API with custom wrapper for API requests

### UI and Design Libraries
- **Radix UI**: Complete set of accessible UI primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS and Autoprefixer
- **Lucide React**: Modern icon library with consistent design
- **Class Variance Authority**: Type-safe CSS class management
- **Embla Carousel**: Touch-friendly carousel component

### Development and Build Tools
- **Vite**: Modern build tool with HMR and optimized production builds
- **ESBuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing with Tailwind CSS plugin
- **TSX**: TypeScript execution for development server

### Validation and Forms
- **Zod**: Runtime type validation for API requests and form data
- **React Hook Form**: Performant form library with minimal re-renders
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

### File Upload and Processing
- **Multer**: File upload middleware with size limits and type filtering
- **Native File API**: Browser-based file handling for drag-and-drop image upload

### Additional Utilities
- **Date-fns**: Modern date utility library for timestamp handling
- **CLSX & Tailwind Merge**: Utility for conditional CSS classes
- **Nanoid**: URL-safe unique ID generation
- **CMDK**: Command palette component for search functionality

The architecture emphasizes type safety, developer experience, and scalability while maintaining simplicity for rapid development and deployment.