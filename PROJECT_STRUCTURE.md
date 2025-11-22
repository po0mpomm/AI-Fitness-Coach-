# 🏗️ AI Fitness Coach App - Project Structure

## 📁 Professional Backend/Frontend Architecture

This project follows a professional separation between backend and frontend code while maintaining Next.js conventions.

## 🎯 Structure Overview

```
AI Fitness Coach App/
├── 📱 app/                          # Next.js App Router
│   ├── api/                         # API Routes (Backend Entry Points)
│   │   ├── generate-plan/
│   │   │   └── route.ts            # Fitness Plan API Route
│   │   ├── generate-image/
│   │   │   └── route.ts            # Image Generation API Route
│   │   └── text-to-speech/
│   │       └── route.ts            # TTS API Route
│   ├── globals.css                  # Global Styles
│   ├── layout.tsx                   # Root Layout
│   └── page.tsx                     # Home Page
│
├── 🔧 backend/                      # Backend Code
│   ├── services/                    # Business Logic Services
│   │   ├── fitness-plan.service.ts  # Fitness Plan Generation Logic
│   │   ├── image-generation.service.ts # Image Generation Logic
│   │   ├── text-to-speech.service.ts   # TTS Logic
│   │   ├── ai-prompts.ts            # AI Prompt Templates
│   │   └── index.ts                 # Service Exports
│   ├── controllers/                 # Request Handlers
│   │   ├── fitness-plan.controller.ts
│   │   ├── image-generation.controller.ts
│   │   ├── text-to-speech.controller.ts
│   │   └── index.ts                 # Controller Exports
│   ├── middleware/                  # Middleware Functions
│   └── utils/                       # Backend Utilities
│
├── 🎨 frontend/                     # Frontend Code
│   ├── components/                  # React Components
│   │   ├── features/                # Feature-Based Components
│   │   │   ├── fitness-plan/
│   │   │   │   └── plan-display.tsx
│   │   │   ├── theme/
│   │   │   │   ├── theme-provider.tsx
│   │   │   │   └── theme-toggle.tsx
│   │   │   └── user-input/
│   │   │       └── user-form.tsx
│   │   └── ui/                      # Reusable UI Components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       └── textarea.tsx
│   ├── hooks/                       # Custom React Hooks
│   ├── pages/                       # Page Components
│   ├── utils/                       # Frontend Utilities
│   │   ├── cn.ts                    # Class Name Utilities
│   │   ├── storage.ts               # Local Storage Utils
│   │   └── index.ts                 # Utility Exports
│   └── index.ts                     # Component Exports
│
├── 🤝 shared/                       # Shared Code
│   ├── types/                       # TypeScript Type Definitions
│   │   └── index.ts                 # All Types
│   ├── constants/                   # Shared Constants
│   │   ├── api.ts                   # API Endpoints & Keys
│   │   ├── ai-models.ts             # AI Model Configurations
│   │   ├── app.ts                   # App-wide Constants
│   │   └── index.ts                 # Constant Exports
│   └── config/                      # Shared Configuration
│
├── 📄 Configuration Files
│   ├── next.config.js               # Next.js Configuration
│   ├── tailwind.config.ts           # Tailwind CSS Configuration
│   ├── tsconfig.json                # TypeScript Configuration
│   └── package.json                 # Dependencies
│
└── 📚 Documentation
    ├── README.md                    # Project Documentation
    ├── ARCHITECTURE.md              # Architecture Details
    └── PROJECT_STRUCTURE.md         # This File
```

## 🔄 Data Flow

### Backend Flow
```
API Route (app/api/*/route.ts)
    ↓
Controller (backend/controllers/*.controller.ts)
    ↓
Service (backend/services/*.service.ts)
    ↓
External APIs (Gemini, ElevenLabs, etc.)
```

### Frontend Flow
```
Page Component (app/page.tsx)
    ↓
Feature Components (frontend/components/features/*)
    ↓
API Call → Backend Route
    ↓
State Management (React Hooks)
    ↓
UI Components (frontend/components/ui/*)
```

## 📦 Module Organization

### Backend Services
- **fitness-plan.service.ts**: Handles AI-based plan generation
- **image-generation.service.ts**: Manages image generation logic
- **text-to-speech.service.ts**: Handles TTS conversion

### Backend Controllers
- Thin layer between API routes and services
- Handles request/response transformation
- Error handling and validation

### Frontend Components
- **features/**: Feature-specific components (Plan Display, User Form, Theme)
- **ui/**: Reusable UI primitives (Button, Card, Input, etc.)

### Shared Resources
- **types/**: TypeScript interfaces and types
- **constants/**: Configuration constants and API endpoints
- Used by both frontend and backend

## 🎯 Benefits of This Structure

1. **Clear Separation**: Backend and frontend are clearly separated
2. **Scalability**: Easy to add new features and services
3. **Maintainability**: Easy to find and update code
4. **Testability**: Services and components can be tested independently
5. **Professional**: Follows industry-standard project organization
6. **Type Safety**: Shared types ensure consistency between frontend and backend

## 🚀 Import Paths

### Backend Imports
```typescript
import { FitnessPlanService } from "@/backend/services/fitness-plan.service";
import { UserDetails } from "@/shared/types";
import { GEMINI_CONFIG } from "@/shared/constants/ai-models";
```

### Frontend Imports
```typescript
import { UserForm } from "@/frontend/components/features/user-input/user-form";
import { FitnessPlan } from "@/shared/types";
import { cn } from "@/frontend/utils";
```

### Shared Imports
```typescript
import { UserDetails } from "@/shared/types";
import { DEFAULT_MESSAGES } from "@/shared/constants/app";
```

