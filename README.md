# Kenya Procurement Anti-Corruption Monitoring System (KCAC)

An intelligence-grade procurement fraud detection and risk assessment platform for Kenya's public sector. Real-time analysis with AI-powered risk scoring, whistleblower portal, and investigator tools.

## Overview

The KCAC system provides comprehensive monitoring of procurement activities across Kenya's government entities, with focus on:

- **Real-time risk scoring** of tenders and suppliers
- **Fraud detection** using machine learning (price inflation, ghost companies, bid rigging)
- **Anonymous whistleblower portal** with credibility assessment
- **Investigation management** with case tracking
- **Analytics dashboard** with county-level and entity-level insights
- **ML model management** for continuous model improvement

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4
- **State Management**: Zustand
- **UI Components**: shadcn/ui + custom risk assessment components
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Authentication**: Custom JWT-based (no next-auth)
- **Styling**: IBM Plex fonts, intelligence-grade dark theme

## Architecture

### Directory Structure

```
app/
├── (auth)/                    # Auth routes (login, etc)
├── (dashboard)/               # Main app routes
│   ├── page.tsx              # Dashboard homepage
│   ├── tenders/              # Tender browsing and detail pages
│   ├── suppliers/            # Supplier profiles
│   ├── risk/                 # Risk analysis tools
│   ├── analytics/            # Analytics and reporting
│   ├── investigations/       # Investigation management
│   ├── whistleblower/        # Anonymous reporting
│   ├── ml-status/            # ML model management
│   └── settings/             # User settings
├── layout.tsx                # Root layout
└── not-found.tsx             # 404 handling

components/
├── Sidebar.tsx               # Navigation sidebar
├── Topbar.tsx                # Top bar with search
├── RiskBadge.tsx             # Risk level indicator
├── RiskGauge.tsx             # Circular progress gauge
├── ErrorBoundary.tsx         # Error handling
├── LoadingSkeletons.tsx      # Loading states
├── dashboard/                # Dashboard components
│   ├── TrendChart.tsx
│   ├── TopRiskSuppliersCard.tsx
│   ├── HighRiskTendersTable.tsx
│   └── AIQueryBox.tsx
└── analytics/                # Analytics components
    ├── RiskDistribution.tsx
    ├── CountyAnalysis.tsx
    └── SpendingTrend.tsx

lib/
├── types.ts                  # TypeScript interfaces
├── api.ts                    # API client with interceptors
├── store.ts                  # Zustand stores
└── utils.ts                  # Utility functions

middleware.ts                 # Route protection
```

### Authentication Flow

1. User logs in with email/password
2. API returns JWT token + user data
3. Token stored in Zustand auth store
4. Middleware checks token, redirects to login if missing
5. Auto-refresh on 401 response using axios interceptor
6. Logout clears token and returns to login

**Default Credentials (for demo)**:
- Email: `admin@kcac.go.ke`
- Password: `demo123`

### State Management (Zustand)

```typescript
// Auth store - user data, login/logout
useAuthStore()

// Dashboard store - KPI data
useDashboardStore()

// Tender filters - search, pagination, risk level
useTenderFiltersStore()

// Supplier filters - search, pagination
useSupplierFiltersStore()

// UI store - sidebar open/close
useUIStore()
```

## Design System

### Color Palette (Intelligence-Grade Terminal)

- **Primary**: Acid green `#00ff88` - Safe/Good/Critical priority
- **Danger**: Red `#ef4444` - High risk
- **Warning**: Amber `#f59e0b` - Medium risk
- **Neutral**: Slate gray `#64748b` - Low risk
- **Background**: Near-black `#0a0c0f` - Dark terminal aesthetic
- **Text**: Off-white `#e0e0e0` - High contrast

### Risk Color Mapping

- **Critical** (80+): Acid green - Requires immediate action
- **High** (50-79): Red - Significant risk
- **Medium** (25-49): Amber - Requires attention
- **Low** (0-24): Slate gray - Monitor

### Typography

- **Sans**: IBM Plex Sans - Prose and UI labels
- **Mono**: IBM Plex Mono - Numbers, codes, technical data

## API Integration

The `lib/api.ts` provides a complete API client:

```typescript
// Auth
authApi.login(email, password)
authApi.logout()
authApi.me()

// Tenders
tendersApi.list(filters)
tendersApi.get(id)
tendersApi.getRiskFactors(id)

// Suppliers
suppliersApi.list(filters)
suppliersApi.get(id)
suppliersApi.getRelationships(id)

// Risk Analysis
riskApi.checkPrice(params)
riskApi.analyzeSpecs(text)

// Whistleblower
whistleblowerApi.submit(report)

// Investigations
investigationsApi.list()
investigationsApi.update(id, status)
```

## Key Features

### Dashboard
- Real-time KPI summary (total tenders, flagged count, savings identified, avg risk)
- Risk trend chart showing monthly risk evolution
- Top risk suppliers table with ghost probability
- High-risk tenders alert table
- AI query box for natural language questions

### Tender Intelligence
- Browse all tenders with filters (risk, county, category)
- Detailed tender view with:
  - Risk factors breakdown
  - Supplier analysis
  - Price benchmarking
  - Document uploads
  - Investigation notes
  - AI summary

### Supplier Analysis
- Supplier risk profiles with ghost company detection
- Company age, director count, registration validation
- Relationship mapping to other entities
- Historical tender participation
- Flag for further investigation

### Risk Assessment
- **Price Benchmark**: Compare estimated price to historical benchmarks
- **Specification Analysis**: Detect brand restrictions and restrictiveness scores
- **County Overview**: Regional risk comparison

### Investigations (Admin/Investigator)
- Manage active investigation cases
- Track whistleblower reports with credibility scores
- Case status workflow
- Export case packages

### Whistleblower Portal
- Anonymous allegation submission
- 8 allegation types (price inflation, ghost supplier, bid rigging, etc)
- AI triage and credibility assessment
- Encryption and anonymity guarantees
- Secure email contact option

### ML Model Dashboard (Admin)
- Monitor 8 ML models (XGBoost, Isolation Forest, spaCy NER, etc)
- Train/retrain models with progress tracking
- Spending forecast by entity
- Model performance metrics

### Analytics
- Comprehensive reporting with time range + county filters
- KPI cards with delta indicators
- Spending trends (budgeted vs actual vs flagged)
- Risk distribution pie chart
- County performance comparison
- Key findings summary

## Error Handling

- **Error Boundary**: Catches React component errors
- **404 Page**: Custom not-found experience
- **API Errors**: Handled with user-friendly messages
- **Loading States**: Skeleton screens during data fetching
- **Form Validation**: Client-side with error messages

## Security Features

- JWT authentication with auto-refresh
- Middleware-based route protection
- Role-based access control (admin, investigator, viewer)
- Password hashing (bcrypt-ready in backend)
- Secure session management
- No PII collection in whistleblower portal
- Encrypted communication indicators

## Performance Optimizations

- Code splitting by route
- Image optimization
- Font optimization (Google Fonts)
- Responsive design (mobile-first)
- SWR for client data caching
- Debounced search inputs

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Running Locally

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Open browser
open http://localhost:3000
```

## Deployment

Deploy to Vercel with GitHub integration:

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

## Future Enhancements

- Webhook notifications for high-risk tenders
- Email alerts and weekly digests
- Advanced graph analytics for relationship mapping
- Bulk data import from government sources
- API for external integrations
- Custom report builder
- Mobile app for investigators

## Documentation

- **Types**: See `lib/types.ts` for complete API schema
- **API**: See `lib/api.ts` for all API methods
- **Components**: Each component has JSDoc comments
- **Utilities**: Helper functions in `lib/utils.ts`

## Support

For issues or questions, open a GitHub issue or contact the development team.

---

Built with precision for Kenya's procurement integrity.
