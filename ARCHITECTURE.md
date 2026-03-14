# Application Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Next.js 16 Frontend                 │
├─────────────────────────────────────────────────────┤
│  Page Components (App Router)                       │
│  ├─ /login (Public)                                │
│  ├─ /register (Admin Only)                         │
│  ├─ /public/whistleblower (Public)                 │
│  ├─ /dashboard/* (Protected)                       │
│  │  ├─ /county-risk                                │
│  │  ├─ /risk                                       │
│  │  ├─ /whistleblower                              │
│  │  └─ ... other pages                             │
│  └─ /settings                                      │
├─────────────────────────────────────────────────────┤
│  State Management                                   │
│  ├─ TanStack Query (Server State)                  │
│  ├─ Zustand Store (Client State)                   │
│  └─ Form State (react-hook-form)                   │
├─────────────────────────────────────────────────────┤
│  Components Layer                                   │
│  ├─ UI Components (shadcn/ui)                      │
│  ├─ Forms (LoginForm, RegisterForm, etc.)          │
│  ├─ Layout (Sidebar, Topbar)                       │
│  └─ Custom (RiskGauge, RiskBadge, etc.)            │
├─────────────────────────────────────────────────────┤
│  Data Layer                                        │
│  ├─ lib/schemas/ (Zod Validation)                  │
│  ├─ lib/services/ (Business Logic)                 │
│  ├─ lib/queries/ (TanStack Query Hooks)            │
│  ├─ lib/api (HTTP Client)                          │
│  └─ lib/store (Zustand)                            │
├─────────────────────────────────────────────────────┤
│  Backend API (External)                            │
│  └─ REST endpoints for auth, data, etc.            │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow Architecture

### 1. Form Submission Flow

```
User Input
    ↓
[Component] - renders form
    ↓
[react-hook-form] - manages form state
    ↓
[Zod Schema] - validates data on submit
    ↓
[Query Hook] - useMutation from TanStack Query
    ↓
[Service Layer] - calls API function
    ↓
[HTTP Client] - axios/fetch to backend
    ↓
[API Response] - JSON from server
    ↓
[Error/Success] - component handles result
    ↓
[Cache Update] - TanStack Query updates cache
    ↓
[UI Update] - component re-renders
```

### 2. Data Fetching Flow

```
Component Mounts
    ↓
[useQuery Hook] - from TanStack Query
    ↓
[Service Layer] - fetches data
    ↓
[HTTP Client] - GET request to backend
    ↓
[Cache Check] - TanStack Query checks cache
    ↓
[Loading State] - if not in cache, show loading
    ↓
[Data Received] - response from API
    ↓
[Cache Stored] - TanStack Query caches result
    ↓
[UI Renders] - with fetched data
    ↓
[Background Updates] - refetch if stale
```

### 3. Authentication Flow

```
Login Page
    ↓
[LoginForm] - user enters credentials
    ↓
[authQueries.login()] - useMutation
    ↓
[authService.login()] - calls API
    ↓
[API Response] - returns user + token
    ↓
[setAuth()] - updates Zustand store
    ↓
[useRouter.push()] - redirect to dashboard
    ↓
[Protected Routes] - user can access
    ↓
[Token in Headers] - auth header on requests
```

---

## Folder Structure

```
app/
├── layout.tsx                    # Root layout with QueryProvider
├── globals.css                   # Tailwind + theme
├── public/
│   └── whistleblower/
│       └── page.tsx             # Public portal (no auth)
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx             # Admin user creation
└── (dashboard)/
    ├── layout.tsx               # Dashboard layout with sidebar
    ├── page.tsx                 # Dashboard home
    ├── county-risk/
    │   └── page.tsx             # County risk overview
    ├── risk/
    │   └── page.tsx             # Risk analysis tools
    ├── whistleblower/
    │   └── page.tsx             # Authenticated whistleblower
    ├── settings/
    │   └── page.tsx
    └── ... other routes

components/
├── QueryProvider.tsx            # TanStack Query wrapper
├── Sidebar.tsx                  # Navigation (sticky on desktop)
├── Topbar.tsx
├── ui/                          # shadcn components
│   ├── button.tsx
│   ├── card.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   └── ... etc
├── forms/                       # Custom form components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── WhistleblowerForm.tsx
└── ... other components

lib/
├── api/                         # HTTP client
│   ├── auth.ts
│   ├── whistleblower.ts
│   └── index.ts
├── schemas/                     # Zod validation schemas
│   ├── auth.ts
│   ├── whistleblower.ts
│   ├── settings.ts
│   └── index.ts
├── services/                    # Business logic layer
│   ├── authService.ts
│   ├── whistleblowerService.ts
│   └── index.ts
├── queries/                     # TanStack Query hooks
│   ├── authQueries.ts
│   ├── whistleblowerQueries.ts
│   └── index.ts
├── store/                       # Zustand client state
│   └── index.ts
├── types/                       # TypeScript types
│   └── index.ts
├── utils.ts                     # Utility functions
└── hooks/                       # Custom hooks

public/
└── ... static assets

IMPLEMENTATION_NOTES.md           # Phase 2 changes summary
FORM_USAGE_GUIDE.md              # Form component guide
ARCHITECTURE.md                  # This file
```

---

## Key Technologies

### Frontend Framework
- **Next.js 16**: Full-stack React framework
- **React 19.2**: Latest React with Server Components
- **TypeScript**: Type-safe development

### State Management
- **TanStack Query v5**: Server state management
  - Handles data fetching, caching, synchronization
  - Automatic refetching and invalidation
  - Loading/error/success states built-in
  
- **Zustand**: Client state management
  - Authentication state
  - UI state (sidebar open/close, theme)
  - User preferences

### Forms & Validation
- **react-hook-form**: Form state management
  - Minimal re-renders
  - Easy to integrate with validation
  - Performance optimized
  
- **Zod**: Runtime type checking & validation
  - Schema-first validation
  - Type inference from schemas
  - Custom error messages

### UI & Styling
- **shadcn/ui**: High-quality React components
  - Built on Radix UI primitives
  - Fully customizable
  - Dark mode support
  
- **Tailwind CSS v4**: Utility-first CSS
  - Rapid UI development
  - Responsive design
  - Custom theme configuration

### Charts & Visualization
- **Recharts**: React charting library
  - Composable components
  - Responsive charts
  - Multiple chart types

### HTTP & API
- **Axios**: Promise-based HTTP client
  - Request/response interceptors
  - Error handling
  - Automatic serialization

---

## Authentication & Authorization

### Protected Routes
```
(auth)/ routes  → Public (no auth required)
(dashboard)/ routes → Protected (auth required)
/public/ routes → Public (no auth required)
```

### Role-Based Access
```
viewer       → Read-only access to dashboards
investigator → Full access + investigations
admin        → Full system access + user management
```

### Implementation
- Zustand store: `useAuthStore`
- Actions: `login`, `logout`, `setAuth`
- Middleware: Dashboard layout redirects unauthenticated users

---

## Error Handling

### Form Validation Errors
- Handled by Zod schemas
- Displayed via `<FormMessage />` component
- Field-level and form-level validation

### API Errors
- Try/catch in service layer
- Error state in components
- User-friendly error messages
- Loading states during requests

### Query Errors
- TanStack Query retry logic
- Error boundaries (recommended to add)
- Fallback UI for failed loads

---

## Performance Optimizations

### Image Optimization
- Next.js Image component (when needed)
- Lazy loading
- Responsive sizing

### Code Splitting
- App Router automatic code splitting
- Dynamic imports for heavy components
- Route-based splitting

### Caching Strategy
- TanStack Query: 5-minute cache
- Stale-while-revalidate pattern
- Smart invalidation on mutations

### Component Optimization
- React.memo for expensive components
- useCallback for handlers
- Proper dependency arrays

---

## Development Workflow

### Adding a New Feature

1. **Create Schema** (lib/schemas/feature.ts)
   ```ts
   export const featureSchema = z.object({...})
   export type FeatureInput = z.infer<typeof featureSchema>
   ```

2. **Create Service** (lib/services/featureService.ts)
   ```ts
   export const featureService = {
     submit: (input: FeatureInput) => featureApi.submit(input)
   }
   ```

3. **Create Queries** (lib/queries/featureQueries.ts)
   ```ts
   export const featureQueries = {
     submit: () => useMutation({
       mutationFn: (input) => featureService.submit(input)
     })
   }
   ```

4. **Create Form** (components/forms/FeatureForm.tsx)
   ```ts
   export function FeatureForm() {
     const form = useForm({ resolver: zodResolver(featureSchema) })
     const mutation = featureQueries.submit()
     // ... form component
   }
   ```

5. **Create Page** (app/(dashboard)/feature/page.tsx)
   ```ts
   export default function FeaturePage() {
     return <FeatureForm />
   }
   ```

---

## Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```
NEXT_PUBLIC_API_URL=https://api.production.com
# Other vars as needed
```

### Server Requirements
- Node.js 18+
- 512MB RAM minimum
- No additional services required

---

## Monitoring & Debugging

### Console Logging
- Use `console.log("[v0] ...")` for debugging
- Framework logs available in browser DevTools
- Network tab for API requests

### Error Tracking
- Implement Sentry or similar for production
- Error boundaries for component errors
- API error logging

### Performance Monitoring
- Lighthouse for build quality
- Browser DevTools Performance tab
- TanStack Query DevTools (in development)

---

## Security Considerations

### Authentication
- HTTP-only cookies for tokens (if applicable)
- Secure storage of sensitive data
- CSRF protection on mutations

### Input Validation
- Client-side validation with Zod
- Always validate on server too
- Sanitize user inputs

### API Communication
- HTTPS only in production
- Request authentication headers
- Rate limiting (backend responsibility)

### Data Protection
- Whistleblower anonymity
- User data encryption (backend)
- Access logging (backend)

---

## Testing Strategy

### Unit Tests (Recommended)
- Test schemas with Zod
- Test utility functions
- Test service layer logic

### Integration Tests
- Test forms with react-testing-library
- Test API interactions
- Test error handling

### E2E Tests
- Critical user flows
- Authentication flows
- Data submission flows

---

## API Contract Example

### Login Endpoint
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { user: User, token: string }
Errors: 401 Unauthorized, 400 Bad Request
```

### Register Endpoint
```
POST /api/auth/register
Body: {
  email: string
  password: string
  full_name: string
  role: 'viewer' | 'investigator' | 'admin'
  organization?: string
}
Response: { user: User, message: string }
Errors: 400 Bad Request, 409 Conflict
```

### Whistleblower Submit
```
POST /api/whistleblower/submit
Body: WhistleblowerInput
Response: { report_id: string, credibility_score: number }
Errors: 400 Bad Request, 429 Too Many Requests
```

---

## Future Enhancements

- [ ] Real-time data updates with WebSockets
- [ ] Advanced filtering and search
- [ ] Report scheduling and automation
- [ ] Email notifications
- [ ] PDF/Excel export
- [ ] Dark/light mode toggle
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API documentation (Swagger)
- [ ] CI/CD pipeline

---

## Getting Help

1. Check FORM_USAGE_GUIDE.md for form implementation
2. Check IMPLEMENTATION_NOTES.md for Phase 2 changes
3. Review existing components for patterns
4. Check TypeScript types for API contracts
5. Check lib/schemas for validation rules

---

## Summary

This architecture provides:
- ✅ Type-safe development with TypeScript
- ✅ Clean separation of concerns
- ✅ Scalable form handling
- ✅ Efficient data fetching
- ✅ Beautiful, accessible UI
- ✅ Easy to test and maintain
- ✅ Production-ready patterns
- ✅ Performance optimized
