# Overview

DeFi Quest is a gamified DeFi platform that combines cryptocurrency commitment tracking with social gaming features. The platform allows users to set DeFi-related goals (holding positions, DCA strategies, staking commitments, trading targets), track progress through a quest system, and compete with others on leaderboards. Key features include XP-based progression, achievement systems, social feeds, ZK proof verification for privacy-preserving goal verification, and a comprehensive commitment tracking system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18 with TypeScript**: Modern React application using functional components with hooks
- **Vite Build System**: Fast development and production builds with HMR support
- **UI Framework**: Extensive use of Radix UI primitives with custom Tailwind CSS styling for consistent design
- **State Management**: Zustand stores for client-side state (audio, commitments, quests, leaderboard)
- **3D Capabilities**: React Three Fiber and Drei for potential 3D visualizations and interactive elements
- **Query Management**: TanStack React Query for server state management and caching

## Backend Architecture
- **Express.js API**: RESTful API server with middleware for logging and error handling
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development, designed to support database backends
- **Route Structure**: Organized routes for user management, goal tracking, quest system, achievements, ZK proofs, and social features

## Database Design
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect configuration
- **Schema Structure**: Comprehensive tables for users, goals, quests, achievements, ZK proofs, social interactions, and accountability features
- **Migration System**: Drizzle Kit for database schema migrations and management

## Key Data Models
- **Users**: Profile data, XP tracking, streak counters, level progression
- **Goals/Commitments**: DeFi-specific goal types with progress tracking and XP rewards
- **Quests**: Daily/weekly challenges with different categories and difficulty levels
- **Achievements**: Unlockable rewards tied to user progression and milestones
- **ZK Proofs**: Privacy-preserving verification system for goal completion
- **Social Features**: Posts, interactions, and accountability partnerships

## Authentication & Privacy
- **ZK Proof System**: Allows users to verify goal completion without revealing sensitive financial information
- **Privacy-First Design**: Commitment tracking that respects user privacy while enabling verification

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for state management
- **Build Tools**: Vite, TypeScript, PostCSS, Tailwind CSS for development and styling
- **UI Components**: Comprehensive Radix UI component library for accessible, unstyled components

## Database & ORM
- **Drizzle ORM**: Type-safe database interactions with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **Database Migrations**: Drizzle Kit for schema management

## 3D & Graphics
- **React Three Fiber**: React renderer for Three.js 3D graphics
- **@react-three/drei**: Useful helpers and abstractions for 3D scenes
- **@react-three/postprocessing**: Post-processing effects for enhanced visuals
- **vite-plugin-glsl**: GLSL shader support for custom graphics

## Development & Utilities
- **Class Utilities**: clsx and class-variance-authority for conditional styling
- **Date Handling**: date-fns for date manipulation and formatting
- **TypeScript**: Full type safety across the application
- **ESBuild**: Fast bundling for production builds

## Additional Features
- **Audio Support**: Built-in audio management system for game sounds and music
- **Mobile Responsiveness**: Mobile-first design with responsive breakpoints
- **Command Palette**: cmdk for searchable command interface
- **Session Management**: Express session handling with PostgreSQL store
