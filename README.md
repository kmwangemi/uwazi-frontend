# Procurement Monitoring System - Frontend MVP

Kenya's AI-Powered Procurement Monitoring System - A critical anti-corruption platform for detecting and preventing fraud in public procurement worth KSh 1.5 trillion annually.

## 🎯 Overview

This is a production-ready Next.js 16+ frontend for the Procurement Monitoring System that helps EACC investigators, auditors, and citizens monitor government tenders, detect price inflation, identify ghost suppliers, and combat systemic corruption.

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts + D3.js
- **Maps**: Leaflet + React-Leaflet
- **HTTP Client**: Axios
- **PDF Generation**: react-pdf/renderer
- **Date Handling**: date-fns
- **Icons**: Lucide React

### Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/login/            # Authentication pages
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/            # Main dashboard
│   │   ├── tenders/              # Tenders module
│   │   ├── suppliers/            # Suppliers module
│   │   ├── entities/             # Procuring entities
│   │   ├── investigations/       # Case management
│   │   ├── analytics/            # Analytics & insights
│   │   ├── reports/              # Report generation
│   │   └── settings/             # User settings
│   └── (public)/                 # Public pages
│       ├── transparency/         # Public portal
│       └── whistleblower/        # Anonymous reporting
├── components/
│   ├── layout/                   # Layout components
│   ├── dashboard/                # Dashboard-specific
│   ├── shared/                   # Reusable components
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── api.ts                    # Axios configuration
│   ├── constants.ts              # Constants & enums
│   ├── formatters.ts             # Formatting utilities
│   ├── validations.ts            # Zod schemas
│   └── mockData.ts               # Mock data for development
├── services/                     # API service layer
├── stores/                       # Zustand stores
├── types/                        # TypeScript types
└── styles/                       # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd procurement-monitor-frontend
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Procurement Monitoring System
NEXT_PUBLIC_ENVIRONMENT=development
```

4. **Run development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Features

### Authentication (Complete)
- ✅ Login page with email/password
- ✅ Protected routes
- ✅ User session management
- ✅ Remember me functionality
- ✅ Auth state persistence

### Dashboard (Complete)
- ✅ Real-time statistics cards
- ✅ Risk distribution visualization
- ✅ Fraud trends chart (90-day history)
- ✅ County savings comparison
- ✅ Top corrupt entities leaderboard
- ✅ Responsive design

### Tenders Module
- 🔄 List with advanced filtering
  - Search by tender number/title
  - Filter by county, entity, category
  - Risk level slider
  - Date range picker
  - Amount range
- 🔄 Detail view with:
  - Risk analysis
  - Price comparison
  - Supplier verification
  - Specification analysis
  - Network graph
  - Investigation panel
- 🔄 Upload functionality
  - CSV/Excel support
  - Batch processing
  - Validation errors

### Suppliers Module
- 🔄 List with verification status
- 🔄 Detail view with:
  - Verification checklist
  - Directors information
  - Contract history
  - Network analysis
  - Red flags

### Procuring Entities
- 🔄 List and comparison
- 🔄 Detailed statistics
- 🔄 Spending analysis
- 🔄 Risk profiles

### Investigations
- 🔄 Case management
- 🔄 Evidence gallery
- 🔄 Timeline tracking
- 🔄 Outcome recording

### Public Portal (Complete)
- ✅ Transparency page
- ✅ Public statistics
- ✅ Key insights
- ✅ Call-to-action for whistleblowing

### Whistleblower Reporting (Complete)
- ✅ Anonymous submission form
- ✅ Multiple report types
- ✅ Tracking ID generation
- ✅ Status tracking
- ✅ Legal protection information
- ✅ Encrypted storage

### Analytics & Reports
- 🔄 Interactive charts
- 🔄 County comparison tools
- 🔄 Category deep-dive
- 🔄 Report templates
- 🔄 PDF export

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563EB) - Trust, government
- **Success**: Green (#10B981) - Savings, approved
- **Warning**: Orange (#F59E0B) - Medium risk
- **Danger**: Red (#EF4444) - High risk, corruption
- **Kenya Flag Colors**: Black, Red (#BB0000), Green (#006600)

### Risk Score Colors
- 0-25: Green (Low)
- 26-50: Yellow (Medium)
- 51-75: Orange (High)
- 76-100: Red (Critical)

### Typography
- **Headings**: Inter (bold)
- **Body**: Inter (regular)
- **Monospace**: JetBrains Mono (IDs, numbers)

## 🔐 Security Features

- ✅ TypeScript strict mode (no `any`)
- ✅ Zod validation for all forms
- ✅ Protected routes with auth checks
- ✅ Secure token storage
- ✅ CORS-protected API calls
- ✅ Input sanitization
- ✅ XSS prevention
- ✅ Environment variable validation

## 🧪 Development

### Code Quality

```bash
# Run linting
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check
```

### Component Guidelines

1. **Components must be < 200 lines** (split into subcomponents if needed)
2. **Use meaningful names** (no abbreviations)
3. **Include JSDoc comments** for complex logic
4. **Use semantic HTML** (<nav>, <main>, <section>)
5. **Ensure accessibility** (ARIA labels, keyboard nav)
6. **Mobile-first responsive design**
7. **Follow Tailwind conventions**

### State Management Pattern

**Zustand for UI State:**
```typescript
// stores/uiStore.ts
const { sidebarOpen, toggleSidebar } = useUIStore()
```

**Zustand for Auth:**
```typescript
// stores/authStore.ts
const { user, login, logout } = useAuthStore()
```

**React Query for Server State:**
```typescript
// hooks/useTenders.ts
const { data, isLoading } = useTenders(params)
```

## 📊 Mock Data

The application includes comprehensive mock data in `lib/mockData.ts` for development:
- 50 sample tenders with various risk levels
- 30 suppliers with verification data
- 20 procuring entities
- 15 investigations
- Dashboard statistics (all 47 counties)

## 🔌 API Integration

### Expected Backend Endpoints

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh

GET    /api/dashboard/stats
GET    /api/dashboard/alerts
GET    /api/dashboard/counties
GET    /api/dashboard/fraud-trends

GET    /api/tenders
GET    /api/tenders/{id}
POST   /api/tenders/upload
GET    /api/tenders/export
POST   /api/analyze/tender/{id}

GET    /api/suppliers
GET    /api/suppliers/{id}
POST   /api/suppliers/{id}/verify

GET    /api/entities
GET    /api/entities/{id}

GET    /api/investigations
GET    /api/investigations/{id}
POST   /api/investigations
PUT    /api/investigations/{id}
POST   /api/investigations/{id}/close
POST   /api/investigations/{id}/evidence
```

## 🧩 Key Components

### Shared Components
- `LoadingSpinner` - Loading states
- `ErrorBoundary` - Error handling
- `EmptyState` - No data states
- `RiskScoreMeter` - Circular risk visualization
- `StatsCard` - Dashboard statistics
- `TenderCard` - Tender card display

### Layout Components
- `Header` - Top navigation
- `Sidebar` - Side navigation
- `DashboardLayout` - Dashboard wrapper
- `PublicLayout` - Public pages wrapper

### Form Components
- Login form with validation
- Whistleblower form
- Investigation creation form
- Advanced filter panels

## 🚢 Deployment

### Building for Production

```bash
pnpm build
pnpm start
```

### Deployment Platforms

**Vercel (Recommended)**
```bash
vercel deploy
```

**Other Platforms**
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Heroku (via Docker)

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://api.procmon.ke
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_APP_NAME=Procurement Monitoring System
```

## 📈 Performance Optimizations

- ✅ Code splitting with dynamic imports
- ✅ Image optimization with Next.js Image
- ✅ React Query caching (1-minute stale time)
- ✅ Debounced search (300ms)
- ✅ Pagination (25-50 items per page)
- ✅ Tree-shaking unused code
- ✅ CSS purging with Tailwind

## ♿ Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Color contrast (4.5:1 minimum)
- ✅ Alt text for images
- ✅ Screen reader friendly tables
- ✅ Skip to content links

## 🧹 Cleaning Up Mock Data

To switch from mock data to real API:

1. **Update services** - Remove mock fallbacks
2. **Remove mockData.ts** - Delete the file
3. **Update .env.local** - Set real API URL
4. **Test API calls** - Verify all endpoints work

## 📝 License

This project is part of Kenya's anti-corruption initiative. All rights reserved.

## 🤝 Contributing

For issues and improvements, please contact the development team.

## 📞 Support

For technical support, email: support@procmon.ke

---

**Made with ❤️ to fight corruption and protect Kenya's future**
