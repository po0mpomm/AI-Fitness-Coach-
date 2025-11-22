# 📐 Project Architecture

Professional, easy-to-understand architecture for the AI Fitness Coach App.

---

## 📁 Directory Structure

```
AI Fitness Coach App/
├── app/                          # Next.js App Router (Pages & Routes)
│   ├── api/                      # API Routes (Backend Endpoints)
│   │   ├── generate-plan/        # Fitness Plan Generation API
│   │   │   └── route.ts
│   │   ├── generate-image/       # Image Generation API
│   │   │   └── route.ts
│   │   └── text-to-speech/       # Text-to-Speech API
│   │       └── route.ts
│   ├── globals.css               # Global Styles & Tailwind
│   ├── layout.tsx                # Root Layout (Theme Provider)
│   └── page.tsx                  # Home Page (Main Entry Point)
│
├── components/                   # React Components
│   ├── features/                 # Feature-Specific Components
│   │   ├── fitness-plan/         # Fitness Plan Feature
│   │   │   └── plan-display.tsx
│   │   ├── user-input/           # User Input Feature
│   │   │   └── user-form.tsx
│   │   └── theme/                # Theme Feature
│   │       ├── theme-provider.tsx
│   │       └── theme-toggle.tsx
│   └── ui/                       # Reusable UI Components (Shadcn)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── textarea.tsx
│
├── lib/                          # Shared Libraries & Utilities
│   ├── api/                      # API Client Services
│   │   ├── gemini.ts             # Gemini AI Service
│   │   ├── elevenlabs.ts         # ElevenLabs TTS Service
│   │   └── openai.ts             # OpenAI Service
│   ├── services/                 # Business Logic Services
│   │   ├── plan-generator.ts     # Plan Generation Logic
│   │   └── image-generator.ts    # Image Generation Logic
│   ├── constants/                # Configuration Constants
│   │   ├── api.ts                # API Endpoints & Keys
│   │   ├── ai-models.ts          # AI Model Configurations
│   │   └── app.ts                # App-wide Constants
│   ├── hooks/                    # Custom React Hooks
│   │   └── use-fitness-plan.ts   # Fitness Plan Hook
│   ├── types/                    # TypeScript Type Definitions
│   │   ├── index.ts              # Re-export all types
│   │   ├── user.ts               # User-related Types
│   │   └── fitness.ts            # Fitness Plan Types
│   ├── utils/                    # Utility Functions
│   │   ├── index.ts              # Re-export all utils
│   │   ├── storage.ts            # Local Storage Utilities
│   │   ├── formatters.ts         # Data Formatting
│   │   └── validators.ts         # Validation Utilities
│   └── prompts/                  # AI Prompt Templates
│       └── ai-prompts.ts         # Prompt Generation
│
├── public/                       # Static Assets
│   └── (images, icons, fonts)
│
├── .env.local                    # Environment Variables (Not in Git)
├── .eslintrc.json                # ESLint Configuration
├── .gitignore                    # Git Ignore Rules
├── next.config.js                # Next.js Configuration
├── next-env.d.ts                 # Next.js TypeScript Definitions
├── package.json                  # Dependencies & Scripts
├── package-lock.json             # Locked Dependencies
├── postcss.config.mjs            # PostCSS Configuration
├── tailwind.config.ts            # Tailwind CSS Configuration
├── tsconfig.json                 # TypeScript Configuration
└── README.md                     # Project Documentation
```

---

## 🏗️ Architecture Layers

### 1. **Presentation Layer** (`app/`, `components/`)
- **Purpose**: User interface and routing
- **Responsibilities**: 
  - Render UI components
  - Handle user interactions
  - Route management
  - Page layouts

### 2. **API Layer** (`app/api/`)
- **Purpose**: Backend API endpoints
- **Responsibilities**:
  - Handle HTTP requests
  - Validate input
  - Call services
  - Return responses

### 3. **Service Layer** (`lib/services/`)
- **Purpose**: Business logic
- **Responsibilities**:
  - Process business rules
  - Coordinate API calls
  - Data transformation

### 4. **Data Layer** (`lib/api/`)
- **Purpose**: External API communication
- **Responsibilities**:
  - API client configuration
  - Request/response handling
  - Error handling

### 5. **Utilities Layer** (`lib/utils/`, `lib/types/`, `lib/constants/`)
- **Purpose**: Shared utilities and configuration
- **Responsibilities**:
  - Type definitions
  - Helper functions
  - Constants
  - Validators

---

## 📦 Module Organization

### Components Structure

```
components/
├── features/          # Feature-specific components (domain-driven)
│   ├── fitness-plan/  # Everything related to fitness plan display
│   ├── user-input/    # Everything related to user input
│   └── theme/         # Everything related to theming
│
└── ui/                # Reusable UI primitives (presentation-only)
    ├── button.tsx
    ├── card.tsx
    └── ...
```

**Benefits:**
- Easy to find components by feature
- Clear separation of concerns
- Scalable structure

---

### Lib Structure

```
lib/
├── api/               # API clients (how we talk to external services)
├── services/          # Business logic (what we do with data)
├── constants/         # Configuration values (what settings we use)
├── hooks/             # Custom React hooks (reusable state logic)
├── types/             # TypeScript definitions (what data looks like)
├── utils/             # Helper functions (reusable utilities)
└── prompts/           # AI prompts (what we ask AI)
```

**Benefits:**
- Clear purpose for each folder
- Easy to locate code
- Follows separation of concerns

---

## 🔄 Data Flow

```
User Interaction (Frontend)
    ↓
Components (UI Layer)
    ↓
API Routes (app/api/)
    ↓
Services (lib/services/)
    ↓
API Clients (lib/api/)
    ↓
External APIs (Gemini, ElevenLabs, OpenAI)
```

---

## 📝 File Naming Conventions

- **Components**: `kebab-case.tsx` (e.g., `plan-display.tsx`)
- **Hooks**: `use-*.ts` (e.g., `use-fitness-plan.ts`)
- **Services**: `*.service.ts` or `kebab-case.ts` (e.g., `plan-generator.ts`)
- **Types**: `*.types.ts` or `index.ts` in types folder
- **Utils**: `kebab-case.ts` (e.g., `formatters.ts`)
- **Constants**: `kebab-case.ts` (e.g., `ai-models.ts`)

---

## 🎯 Best Practices

1. **Feature-based organization** - Group related components together
2. **Separation of concerns** - Each layer has a specific responsibility
3. **Reusability** - Shared code in `lib/`, reusable UI in `components/ui/`
4. **Type safety** - All types in `lib/types/`
5. **Configuration** - All constants in `lib/constants/`

---

## 🚀 Next Steps

This structure makes it easy to:
- Add new features (create new feature folder)
- Find code (clear folder names)
- Maintain code (logical organization)
- Scale the app (structured growth)

