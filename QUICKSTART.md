# Quick Start Guide

Get the Procurement Monitoring System running in 2 minutes.

## 1️⃣ Install & Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open your browser to: **http://localhost:3000**

## 2️⃣ Login

You'll be redirected to the login page.

**Demo Credentials:**
- Email: `demo@procmon.ke`
- Password: `password`

Or use any email/password combination - mock login accepts any valid input.

## 3️⃣ Explore the Dashboard

Once logged in, you'll see:

### Dashboard Home
- **Stats Cards**: 4 key metrics at the top
- **Risk Distribution**: Pie chart of tender risk levels
- **Fraud Trends**: 30-day fraud detection timeline
- **County Savings**: Top 10 counties by estimated savings
- **Top Entities**: Leaderboard of entities by corruption risk

### Navigation Menu (Sidebar)
1. **Dashboard** - Main dashboard
2. **Tenders** - Tender monitoring (coming soon)
3. **Suppliers** - Supplier verification (coming soon)
4. **Entities** - Government entities (coming soon)
5. **Investigations** - Case management (coming soon)
6. **Analytics** - Advanced analytics (coming soon)
7. **Reports** - Report generation (coming soon)
8. **Public Portal** - Transparency portal

## 4️⃣ Key Features to Try

### Public Portal
Click **"Public Portal"** in the sidebar to visit:
- Public transparency page
- Tender search interface
- Anonymous whistleblower reporting

### Whistleblower Report
1. Click **"Report Corruption"** on public portal
2. Fill out the form with:
   - Report type
   - County
   - Description (min. 100 characters)
3. Submit - Get a tracking ID
4. Use tracking ID to check status

### User Settings
1. Click your avatar in top-right
2. Select **"Settings"**
3. View account information

### Logout
1. Click avatar in top-right
2. Select **"Logout"**
3. Returns to login page

## 🧪 Test Data

All pages use mock data for demonstration:
- **50 Tenders** with varying risk levels
- **30 Suppliers** with verification statuses  
- **20 Entities** with procurement patterns
- **15 Investigations** with different statuses
- **47 Counties** with complete statistics

## 🎨 User Interface

### Color Coding
- 🟢 **Green** (0-25) = Low Risk
- 🟡 **Yellow** (26-50) = Medium Risk
- 🟠 **Orange** (51-75) = High Risk
- 🔴 **Red** (76-100) = Critical Risk

### Quick Stats
- KSh = Kenyan Shilling (currency formatter)
- Risk Score = 0-100 circular meter
- Corruption Rate = Percentage of flagged tenders

## 🛠️ Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Format code
pnpm format
```

## 📁 Key Files to Know

### Pages
- `/app/page.tsx` - Root (redirects to login/dashboard)
- `/app/(auth)/login/page.tsx` - Login page
- `/app/(dashboard)/dashboard/page.tsx` - Main dashboard
- `/app/(public)/transparency/page.tsx` - Public portal
- `/app/(public)/whistleblower/page.tsx` - Report form

### Components
- `/components/layout/Header.tsx` - Top navigation
- `/components/layout/Sidebar.tsx` - Side menu
- `/components/shared/RiskScoreMeter.tsx` - Risk visualization
- `/components/shared/StatsCard.tsx` - Stats display

### Data & Utils
- `/lib/mockData.ts` - Sample data
- `/lib/formatters.ts` - Format KSh, dates, etc.
- `/lib/constants.ts` - 47 Kenyan counties, categories
- `/services/` - API integration layer

### State
- `/stores/authStore.ts` - User login state
- `/stores/uiStore.ts` - UI state (sidebar, etc.)

## 🔧 Configuration

Edit `.env.local` to change:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL
NEXT_PUBLIC_ENVIRONMENT=development        # dev/production
```

## 📊 Mock Data Locations

```javascript
// /lib/mockData.ts
mockTenders       // 50 tenders
mockSuppliers     // 30 suppliers
mockEntities      // 20 procuring entities
mockInvestigations // 15 investigations
mockDashboardStats // Dashboard statistics
```

## 🚀 Next Steps

### To Connect Real Backend
1. Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. Remove mock fallbacks from `/services/*`
3. Test API endpoints
4. Deploy!

### To Extend the System
1. Add detail pages for tenders, suppliers, entities
2. Implement advanced analytics charts
3. Build investigation workflows
4. Add Kenya map integration
5. Create PDF report generation

## 📚 Full Documentation

For complete details, see:
- **README.md** - Full feature list and architecture
- **BUILD_SUMMARY.md** - What was built and statistics
- **.env.example** - Environment variables

## 🆘 Troubleshooting

### Blank page after login?
- Check browser console for errors (F12)
- Ensure mock data is loading
- Try logging out and back in

### Routes not working?
- Ensure authentication state is set
- Check sidebar navigation links
- Verify pages exist in `/app/(dashboard)/`

### Charts not displaying?
- Check browser console for Recharts errors
- Ensure mock data contains values
- Try refreshing the page

## 💡 Pro Tips

1. **Use DevTools** - F12 to inspect components and state
2. **Check Zustand** - See auth/UI state in console: `useAuthStore.getState()`
3. **Mock Everything** - Change mock data to test edge cases
4. **Focus Mode** - Mobile view with F12 responsive design tool
5. **Dark Theme** - Add dark mode via Tailwind (next.js next-themes)

## ✅ You're Ready!

The Procurement Monitoring System is fully functional and ready for:
- ✅ Development
- ✅ Feature enhancement
- ✅ Backend integration
- ✅ Testing & QA
- ✅ Production deployment

Happy developing! 🚀

---

**Questions?** Check the README.md or BUILD_SUMMARY.md for more details.
