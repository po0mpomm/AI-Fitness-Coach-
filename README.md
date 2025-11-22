# 💪 AI Fitness Coach App

An AI-powered fitness assistant built using Next.js that generates personalized workout and diet plans using Google Gemini AI. The app includes voice and image generation features for a more immersive experience.

## 🚀 Features

### User Input
- **Personal Information**: Name, Age, Gender
- **Physical Metrics**: Height & Weight
- **Fitness Goals**: Weight Loss, Muscle Gain, Endurance, General Fitness, Flexibility
- **Fitness Level**: Beginner / Intermediate / Advanced
- **Workout Location**: Home / Gym / Outdoor
- **Dietary Preferences**: Vegetarian / Non-Vegetarian / Vegan / Keto
- **Optional Fields**: Medical history, stress level

### AI-Powered Plan Generation
- **🏋️ Workout Plan**: Daily exercise routines with sets, reps, and rest time
- **🥗 Diet Plan**: Meal breakdown for breakfast, lunch, dinner, and snacks
- **💬 AI Tips & Motivation**: Lifestyle and posture tips, motivational lines
- **⚡ Dynamic Prompt Engineering**: All content is AI-generated and personalized based on user input

### Voice Features
- **Read My Plan**: Uses browser TTS (with ElevenLabs API fallback) to speak out Workout and Diet Plans
- **Play/Pause/Restart Controls**: Full audio playback controls
- **Section Selection**: Choose which section to listen to (Workout or Diet)

### Image Generation
- Click on any exercise or meal item to generate a visual representation
- Uses Unsplash free images (with Gemini/OpenAI AI generation support)
- Examples:
  - "Barbell Squat" → realistic gym exercise image
  - "Grilled Chicken Salad" → food-style image

### Additional Features
- **📄 PDF Export**: Export generated plan as PDF
- **🌗 Dark / Light Mode**: Toggle between themes
- **💾 Local Storage**: Save plan in browser local storage
- **🧩 Regenerate Plan**: Generate a new plan with the same user details
- **⚡ Smooth Animations**: Framer Motion animations throughout
- **💬 Daily Motivation Quote**: AI-powered motivational quotes

## 🛠️ Tech Stack

| Category | Tools |
|----------|-------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS, Shadcn UI components |
| **AI APIs** | Google Gemini 2.0 Flash (for plans), OpenAI DALL-E 3 (optional for images) |
| **Voice** | Browser TTS / ElevenLabs API (optional) |
| **Images** | Unsplash (free) / Gemini / OpenAI DALL-E 3 |
| **Animations** | Framer Motion |
| **PDF Export** | jsPDF + html2canvas |
| **Form Handling** | React Hook Form + Zod validation |
| **Deployment** | Vercel / Netlify ready |

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "AI Fitness Coach App"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Google Generative AI (Gemini) API Key (Required)
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here

   # OpenAI API Key (Optional - for AI image generation with DALL-E)
   OPENAI_API_KEY=your_openai_api_key_here

   # ElevenLabs API Key (Optional - for better TTS)
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

   # Next.js
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys Setup

### Google Generative AI (Gemini) API Key (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign up or log in with your Google account
3. Click "Create API Key"
4. Copy your API key
5. Add it to your `.env.local` file as `GOOGLE_AI_API_KEY`

**Note:** The app uses Gemini 2.0 Flash for generating workout and diet plans.

### OpenAI API Key (Optional - for Image Generation)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Add it to your `.env.local` file
6. **Note:** Only needed if you want to use DALL-E 3 for AI-generated images

### ElevenLabs API Key (Optional)
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Add it to your `.env.local` file
6. If not provided, the app will use browser's built-in TTS

## 📁 Project Structure

```
AI Fitness Coach App/
├── app/                          # Next.js App Router (Pages & Routes)
│   ├── api/                      # API Routes (Backend Endpoints)
│   │   ├── generate-plan/        # Fitness Plan Generation API
│   │   ├── generate-image/       # Image Generation API
│   │   └── text-to-speech/       # Text-to-Speech API
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
│   ├── constants/                # Configuration Constants
│   │   ├── api.ts                # API Endpoints & Keys
│   │   ├── ai-models.ts          # AI Model Configurations
│   │   ├── app.ts                # App-wide Constants
│   │   └── index.ts              # Re-export all constants
│   ├── prompts/                  # AI Prompt Templates
│   │   └── ai-prompts.ts         # Prompt Generation
│   ├── types/                    # TypeScript Type Definitions
│   │   └── index.ts              # All type definitions
│   └── utils/                    # Utility Functions
│       ├── storage.ts            # Local Storage Utilities
│       ├── cn.ts                 # Class Name Utilities
│       └── index.ts              # Re-export all utils
│
├── public/                       # Static Assets
├── .env.local                    # Environment Variables (Not in Git)
├── .gitignore                    # Git Ignore Rules
├── ARCHITECTURE.md               # Architecture Documentation
├── next.config.js                # Next.js Configuration
├── next-env.d.ts                 # Next.js TypeScript Definitions
├── package.json                  # Dependencies & Scripts
├── postcss.config.mjs            # PostCSS Configuration
├── README.md                     # This file
├── tailwind.config.ts            # Tailwind CSS Configuration
└── tsconfig.json                 # TypeScript Configuration
```

### Architecture Benefits

- **Feature-based organization**: Components grouped by feature for easy navigation
- **Separation of concerns**: Clear distinction between UI, business logic, and API
- **Reusability**: Shared utilities and constants in dedicated folders
- **Scalability**: Easy to add new features without cluttering the structure
- **Maintainability**: Clear file organization makes code easier to find and update

## 🎯 Usage

1. **Fill in your details**: Enter your personal information, fitness goals, and preferences
2. **Generate Plan**: Click "Generate My Fitness Plan" to create your personalized plan
3. **View Plan**: Browse through your workout and diet plans
4. **Listen to Plan**: Click "Read Workout Plan" or "Read Diet Plan" to hear it
   - Use **Play/Pause** to control playback
   - Use **Restart** to start from the beginning
   - Use **Stop** to stop playback
5. **Generate Images**: Click the image icon next to exercises or meals to generate visuals
6. **Export PDF**: Click "Export PDF" to download your plan
7. **Regenerate**: Click "Regenerate Plan" to create a new plan with the same details

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import your repository on [Netlify](https://netlify.com)
3. Add environment variables in Netlify dashboard
4. Deploy!

## 🔒 Privacy & Security

- All API calls are made server-side (API routes)
- User data is stored only in browser local storage (client-side)
- No user data is sent to third parties except for AI API calls
- API keys should never be exposed to the client

## 🐛 Troubleshooting

### API Key Errors
- Ensure your `.env.local` file exists and contains valid API keys
- Restart the development server after adding environment variables

### Image Generation Not Working
- Image generation uses Unsplash free images by default (works without API keys)
- For AI-generated images, add OpenAI API key or wait for Gemini quota

### TTS Not Working
- Browser TTS works by default (no setup needed)
- If ElevenLabs API key is not set, the app will use browser TTS

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🙏 Acknowledgments

- Google Gemini for AI plan generation
- OpenAI for DALL-E image generation
- ElevenLabs for TTS API
- Shadcn for UI components
- Framer Motion for animations

---

Built with ❤️ using Next.js and AI
