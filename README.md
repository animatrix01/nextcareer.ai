<div align="center">
  <img src="./public/nextcareerlogo.png" alt="NextCareer AI Logo" width="200"/>
  
  # NextCareer AI
  
  ### The AI-Native Operating System for Your Career
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.0-61dafb?style=flat&logo=react)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  
  **One connected workspace for resumes, ATS scoring, career roadmaps, interview prep, and job offers.**
  
  [Live Demo](https://nextcareer.ai) · [Report Bug](https://github.com/animatrix01/techcareer.ai/issues) · [Request Feature](https://github.com/animatrix01/techcareer.ai/issues)
  
</div>

---

## 🌟 Overview

**NextCareer AI** is an AI-powered career development platform designed to help job seekers build ATS-optimized resumes, analyze their job readiness, and create personalized career roadmaps. Unlike traditional career tools that work in isolation, NextCareer AI integrates three powerful tools into one seamless workspace — all powered by modern AI technology.

### Why NextCareer AI?

- 🎯 **ATS-First Design** — Every resume template is optimized to pass Applicant Tracking Systems
- 🤖 **AI-Powered Intelligence** — Smart content suggestions, skill recommendations, and career path generation
- 🎨 **20+ Professional Templates** — Beautiful, modern designs that work across industries
- 📊 **Instant Analysis** — Get your ATS score and actionable improvements in seconds
- 🗺️ **Personalized Roadmaps** — AI-generated learning paths tailored to your target role
- 💾 **Persistent Storage** — Your data is securely saved and accessible across devices
- ⚡ **Blazing Fast** — Built with Next.js 15 and modern performance optimizations

---

## 🚀 Features

### 1. 📝 **Resume Builder**

Build a resume that gets past ATS — and impresses humans.

- **20+ ATS-Ready Templates** — Professional designs optimized for various industries
- **AI-Powered Enhancements** — Transform weak bullet points into powerful impact statements
- **Live Preview** — See changes in real-time as you type
- **Smart Skills Input** — AI suggests relevant skills based on your role
- **Template Switching** — Change templates anytime without losing your data
- **One-Click PDF Export** — Generate professional PDFs via browser print
- **Drag & Drop Editing** — Reorder sections effortlessly
- **Resume Upload & Parse** — Import existing resumes (PDF/DOCX) and edit them

**Key Steps:**
- Personal Information & Summary
- Work Experience with AI-enhanced descriptions
- Education & Certifications
- Skills with autocomplete suggestions
- Projects & Achievements
- Preview & Export

### 2. 🔍 **ATS Analyzer**

Know your ATS score before the recruiter sees your resume.

- **Instant 0-100 Score** — Get your ATS compatibility rating in seconds
- **Issue Detection** — Identifies critical, warning, and info-level problems
- **Weak Action Verbs** — Flags passive language and suggests stronger alternatives
- **Keyword Analysis** — Compares your resume against industry standards
- **File Support** — Upload PDF or DOCX files
- **AI Fix Recommendations** — Specific, actionable suggestions for each issue
- **Benchmarking** — Compare your score against similar roles and experience levels

**What It Analyzes:**
- ATS compatibility and parsing issues
- Keyword density and relevance
- Action verb strength
- Format and structure
- Content quality and quantification
- Section completeness

### 3. 🗺️ **Career Roadmap Builder**

A personalized learning path to your target role.

- **1,000+ Role Targets** — From Software Engineer to Product Manager
- **AI-Generated Paths** — Step-by-step learning sequence based on your current skills
- **Skill Gap Analysis** — Identifies what you need to learn and in what order
- **Time Estimates** — Realistic timelines for each learning phase
- **Resource Recommendations** — Courses, certifications, and projects to complete
- **Milestone Tracking** — Break down your journey into achievable goals
- **Dashboard Integration** — All roadmaps saved to your personal dashboard

**Roadmap Includes:**
- Current skill assessment
- Target role requirements
- Prioritized skill learning order
- Recommended certifications
- Project ideas for portfolio
- Estimated completion timeline

---

## 🛠️ Tech Stack

### **Frontend**
- **[Next.js 15](https://nextjs.org/)** — React framework with App Router
- **[React 19](https://react.dev/)** — UI library with latest features
- **[TypeScript 5](https://www.typescriptlang.org/)** — Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** — Smooth animations and transitions
- **[GSAP](https://greensock.com/gsap/)** — Advanced animation library
- **[Lenis](https://lenis.studiofreight.com/)** — Smooth scroll library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)** — 3D graphics with Three.js

### **Backend & Database**
- **[Neon PostgreSQL](https://neon.tech/)** — Serverless PostgreSQL database
- **[Drizzle ORM](https://orm.drizzle.team/)** — Type-safe database queries
- **[Clerk](https://clerk.com/)** — Authentication and user management
- **[Upstash Rate Limit](https://upstash.com/)** — Redis-based rate limiting
- **[Svix](https://www.svix.com/)** — Webhook handling

### **AI & Processing**
- Custom AI integration for content generation
- Resume parsing (PDF & DOCX support)
- Natural language processing for skill extraction
- Career path generation algorithms

### **UI Components & Libraries**
- **[Radix UI](https://www.radix-ui.com/)** — Accessible component primitives
- **[Lucide Icons](https://lucide.dev/)** — Beautiful icon library
- **[React Hook Form](https://react-hook-form.com/)** — Performant form handling
- **[Zod](https://zod.dev/)** — TypeScript-first schema validation
- **[Zustand](https://zustand-demo.pmnd.rs/)** — Lightweight state management
- **[Sonner](https://sonner.emilkowal.ski/)** — Toast notifications
- **[DND Kit](https://dndkit.com/)** — Drag-and-drop functionality

### **Build Tools & Dev Experience**
- **[Turbopack](https://turbo.build/pack)** — Fast bundler for development
- **[ESLint](https://eslint.org/)** — Code linting
- **[PostCSS](https://postcss.org/)** — CSS transformations

---

## 📦 Installation

### Prerequisites

- **Node.js 20+** and npm/pnpm/yarn
- **PostgreSQL database** (Neon recommended)
- **Clerk account** for authentication
- **AI API keys** (as configured)

### 1. Clone the Repository

```bash
git clone https://github.com/animatrix01/techcareer.ai.git
cd techcareer.ai
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=your_neon_database_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# AI Configuration (Configure as per your setup)
AI_API_KEY=your_ai_api_key
```

### 4. Database Setup

Generate and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

Optionally, open Drizzle Studio to view your database:

```bash
npm run db:studio
```

### 5. Run Development Server

```bash
npm run dev
# or with webpack
npm run dev:webpack
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure

```
techcareer.ai/
├── public/                     # Static assets
│   ├── nextcareerlogo.png     # Logo file
│   └── *.svg                  # Icon files
├── src/
│   ├── actions/               # Server actions
│   │   ├── resume.ts         # Resume CRUD operations
│   │   └── roadmap.ts        # Roadmap generation
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Authentication routes
│   │   ├── (dashboard)/      # Dashboard routes
│   │   ├── api/              # API routes
│   │   │   ├── ai/           # AI endpoints
│   │   │   └── webhooks/     # Webhook handlers
│   │   ├── tools/            # Tool pages
│   │   │   ├── builder/      # Resume builder
│   │   │   ├── analyzer/     # ATS analyzer
│   │   │   └── roadmap/      # Career roadmap
│   │   ├── features/         # Features page
│   │   ├── faq/              # FAQ page
│   │   └── page.tsx          # Landing page
│   ├── components/            # React components
│   │   ├── features/         # Feature-specific components
│   │   ├── landing/          # Landing page sections
│   │   ├── roadmap/          # Roadmap components
│   │   ├── shared/           # Shared components
│   │   └── ui/               # UI primitives
│   ├── lib/                   # Utilities and configs
│   │   ├── ai/               # AI utilities
│   │   ├── db/               # Database schema & client
│   │   ├── llm/              # LLM prompts & client
│   │   └── utils/            # Helper functions
│   ├── stores/                # Zustand state stores
│   └── data/                  # Static data (roles, degrees)
├── drizzle/                   # Database migrations
├── scripts/                   # Utility scripts
├── .env.local                 # Environment variables
├── drizzle.config.ts          # Drizzle ORM config
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS config
└── package.json               # Dependencies
```

---

## 🎯 Usage

### Building a Resume

1. **Choose a Template** — Browse 20+ professional designs
2. **Fill in Details** — Step through each section (Personal Info, Experience, Education, Skills, Projects)
3. **AI Enhance** — Click the sparkle icon to improve bullet points with AI
4. **Live Preview** — Watch your resume update in real-time
5. **Switch Templates** — Try different designs without losing data
6. **Export PDF** — Download your finished resume

### Analyzing a Resume

1. **Upload File** — Drop your PDF or DOCX resume
2. **Instant Score** — Get your ATS compatibility rating (0-100)
3. **Review Issues** — See critical, warning, and info-level problems
4. **Follow Suggestions** — Apply AI-recommended fixes
5. **Re-analyze** — Upload the improved version and track progress

### Creating a Career Roadmap

1. **Select Target Role** — Choose from 1,000+ career paths
2. **Current Skills** — Tell us what you already know
3. **Generate Roadmap** — AI creates your personalized learning path
4. **Review Milestones** — See skills prioritized by importance
5. **Track Progress** — Save to dashboard and mark completed items
6. **Access Resources** — Get course and certification recommendations

---

## 🔧 Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run dev:webpack      # Start dev server with webpack

# Production
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio

# Code Quality
npm run lint             # Run ESLint
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed
- Ensure all builds pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ using Next.js, React, and TypeScript
- UI components from Radix UI and shadcn/ui
- Icons from Lucide
- Animations powered by Framer Motion and GSAP
- Database hosted on Neon
- Authentication by Clerk

---

## 📞 Support & Contact

- **GitHub Issues:** [Report bugs or request features](https://github.com/animatrix01/techcareer.ai/issues)
- **Documentation:** [Read the full docs](#) (coming soon)
- **Community:** Join our discussions

---

<div align="center">
  
  **Made with 💙 by the NextCareer AI Team**
  
  ⭐ Star us on GitHub — it helps!
  
</div>
