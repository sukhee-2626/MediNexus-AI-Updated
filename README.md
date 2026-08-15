# 🏥 MediNexus AI (formerly MediChain)

> **Next-Generation Healthcare Management, AI Diagnostics & Patient Care Ecosystem**

MediNexus AI is an enterprise-grade, intelligent healthcare platform designed to bridge the gap between patient care, hospital management, AI-driven diagnostics, and seamless data access. Built with modern web technologies, real-time database capabilities, and AI intelligence, MediNexus AI simplifies appointment scheduling, patient records management, clinical insights, and patient-doctor collaboration.

---

## ✨ Key Features

### 👨‍⚕️ Provider & Hospital Management
- **Smart Patient Dashboard**: Real-time patient overview, search, filtering, risk indicators, and recent health activity.
- **AI Diagnostics & Analytics**: Automated patient summaries, risk assessment scoring, and predictive health alerts powered by Gemini AI.
- **Smart Appointment Management**: Seamless appointment requests, status tracking (Pending, Scheduled, Completed, Cancelled), and doctor availability scheduling.
- **Audit Logs & Security**: Comprehensive activity logs for compliance audit trails and consent management.
- **Data Export & Reporting**: Export patient data and hospital records securely to CSV/Excel format.

### 👤 Patient Portal
- **Interactive Patient Portal**: Unified access for patients to view medical records, prescription details, and health timelines.
- **AI Health Assistant & Chatbot**: Instant AI-powered assistance for general health inquiries, symptom guidance, and appointment queries.
- **Consent Management**: Direct patient control over data sharing permissions with healthcare providers.
- **Prescription Refills & Requests**: Simplified online prescription refill requests and appointment scheduling.
- **Personalized Health Alerts**: Real-time notifications for upcoming appointments, medication schedules, and health warnings.

### 🤖 AI Engine & Edge Intelligence
- **Intelligent Patient Record Summarization**: Summarizes lengthy medical histories into actionable clinical highlights.
- **Predictive Risk Assessment**: Categorizes health risk levels (Low, Moderate, High) with recommendation vectors.
- **Multi-modal Diagnostics**: Integrates modern AI capabilities for automated medical insights.

---

## 🛠️ Technology Stack

- **Frontend Core**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/)
- **State & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Real-time Subscriptions, Edge Functions)
- **AI Capabilities**: Google Gemini API & Supabase Edge Functions
- **Data Visualization**: [Recharts](https://recharts.org/)

---

## 📁 Repository Structure

```
medichain-spark-main/
├── public/                 # Static assets & branding icons
├── src/
│   ├── assets/             # Images and illustration assets
│   ├── components/         # Reusable UI & section components
│   │   ├── dashboard/      # Hospital / Doctor dashboard modules
│   │   ├── patient/        # Patient portal components & AI chatbot
│   │   └── ui/             # Radix UI / shadcn component primitives
│   ├── hooks/              # Custom React hooks (Auth, Toast, Mobile)
│   ├── integrations/       # Supabase client integration & types
│   ├── lib/                # Utilities and Gemini AI client helpers
│   ├── pages/              # Main route views (Dashboard, PatientPortal, Auth, etc.)
│   └── main.tsx            # Application entry point
├── supabase/               # Migrations, Edge Functions & database setup
├── tailwind.config.ts      # Tailwind styling configuration
├── vite.config.ts          # Vite build & plugin configuration
└── package.json            # Dependencies & build scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or `bun` / `yarn`)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sukhee-2626/MediNexus-AI-Updated.git
   cd MediNexus-AI-Updated
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:8080` (or `http://localhost:5173`).

---

## 📦 Build & Deployment

To generate a production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🔐 Security & Data Privacy

MediNexus AI follows strict security standards:
- **Row Level Security (RLS)**: Enforced via Supabase PostgreSQL policies.
- **Granular Consent Controls**: Patients grant or revoke medical record access dynamically.
- **Encrypted Transits**: All communication is secured via TLS/SSL.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
