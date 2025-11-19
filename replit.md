# Haritsattva - Organic Produce E-Commerce Platform

## Overview

Haritsattva is a premium e-commerce platform for organic fruits and vegetables delivery. The application features a clean, modern interface inspired by premium food marketplaces, with emphasis on product photography and minimal design. It provides Replit Auth authentication with protected routes, product browsing with category filters, shopping cart functionality, contact form with backend integration, scroll animations, and an auto-rotating hero carousel.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preferences: Premium minimal aesthetic with generous whitespace, smooth animations, and scroll effects.
Currency: Indian Rupees (₹) throughout the application.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type safety and modern component patterns
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing (alternative to React Router)

**UI Component Library**
- shadcn/ui components based on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theme system supporting light/dark modes via context provider
- "New York" style variant from shadcn/ui configuration

**State Management**
- TanStack Query (React Query) for server state management and caching
- React Context API for client-side state (Cart, Theme, Auth)
- Custom hooks pattern for reusable stateful logic (useAuth, useCart, useScrollAnimation)

**Design System**
- Premium minimalism aesthetic with generous whitespace
- Typography: DM Sans/Inter as primary fonts via Google Fonts
- Spacing system based on Tailwind's 4/6/8/12/16/20/24 unit scale
- Responsive grid layouts (4-column desktop, 2-column tablet, 1-column mobile)
- Hover effects with scale transforms and shadow elevations
- Smooth transitions and natural animations

### Backend Architecture

**Server Framework**
- Express.js application with TypeScript
- ESM module system (type: "module" in package.json)
- Custom middleware for request logging and JSON parsing
- RESTful API design pattern

**Development Setup**
- Dual-mode server: Vite dev server in development, static serving in production
- Custom Vite middleware integration for seamless SSR-style development
- Hot module replacement during development

**API Routes Structure**
- `/api/auth/*` - Authentication endpoints (login, user info)
- `/api/contact` - Contact form submission
- `/api/contact/submissions` - Protected admin endpoint for viewing submissions

**Session Management**
- Express-session with dual store strategy:
  - Memory store for development environment
  - PostgreSQL-backed session store (connect-pg-simple) for production
- 7-day session TTL (time-to-live)
- HTTP-only cookies with secure flag in production

### Authentication & Authorization

**Replit Auth Integration**
- OpenID Connect (OIDC) based authentication via Replit's identity provider
- Passport.js strategy for OIDC flow
- Discovery endpoint: `https://replit.com/oidc`
- Automatic user profile synchronization (email, name, profile image)

**Authorization Pattern**
- `isAuthenticated` middleware for protected routes
- User information stored in session and accessible via `req.user`
- Frontend auth state managed through TanStack Query with automatic caching

**Routing Strategy**
- Public landing page shown to unauthenticated users
- Protected application routes (home, products, cart, etc.) require authentication
- Frontend guards based on `useAuth()` hook checking authentication status

### Data Storage Solutions

**Database**
- PostgreSQL as the primary database (configured via Drizzle)
- Neon serverless PostgreSQL driver for connection pooling
- Connection via DATABASE_URL environment variable

**ORM & Schema Management**
- Drizzle ORM for type-safe database queries and migrations
- Drizzle-Zod integration for runtime validation matching database schema
- Schema-first approach with TypeScript types generated from database schema

**Data Models**
- `users` - User profiles synchronized from Replit Auth (id, email, firstName, lastName, profileImageUrl)
- `sessions` - Session storage table with sid, sess (JSON), and expiration
- `products` - Product catalog (name, description, price, category, imageUrl, inStock)
- `cart_items` - Shopping cart persistence (productId, quantity)
- `contact_submissions` - Contact form data (name, email, phone, message, createdAt)

**Fallback Storage**
- In-memory storage implementation (MemStorage class) as development fallback
- Implements same IStorage interface for consistent API across storage backends
- UUID generation for entity IDs using Node's crypto module

### External Dependencies

**Third-Party UI Libraries**
- Radix UI - Comprehensive set of unstyled, accessible component primitives (@radix-ui/react-*)
- cmdk - Command palette component for search/navigation
- vaul - Drawer component (via Drawer primitive)
- embla-carousel-react - Carousel/slider functionality
- lucide-react - Icon library with consistent design
- react-day-picker - Date picker component
- recharts - Charting library for data visualization
- input-otp - OTP input component

**Form & Validation**
- react-hook-form - Performant form state management with minimal re-renders
- @hookform/resolvers - Integration layer for validation libraries
- zod - Schema validation and TypeScript type inference
- drizzle-zod - Automatic Zod schema generation from Drizzle schemas

**Utilities & Helpers**
- clsx & tailwind-merge - Conditional className composition
- class-variance-authority (cva) - Type-safe component variant management
- date-fns - Date manipulation and formatting
- memoizee - Function memoization for performance optimization
- nanoid - Compact unique ID generation

**Development Tools**
- @replit/vite-plugin-runtime-error-modal - Error overlay for development
- @replit/vite-plugin-cartographer - Replit-specific development tooling
- @replit/vite-plugin-dev-banner - Development environment banner
- tsx - TypeScript execution for development server
- esbuild - Fast JavaScript bundler for production builds
- drizzle-kit - CLI tool for database migrations and schema management

**Authentication**
- openid-client - OpenID Connect client implementation
- passport - Authentication middleware
- openid-client/passport - Passport strategy for OIDC

**Asset Management**
- Static images stored in `attached_assets/generated_images/` directory
- Vite alias `@assets` points to attached_assets folder
- Product images referenced directly in code (not database-driven yet)

**Environment Configuration**
- Environment variables: DATABASE_URL, SESSION_SECRET, REPL_ID, ISSUER_URL, NODE_ENV
- Different behavior between development and production environments
- Automatic SSL certificate handling for Replit deployment