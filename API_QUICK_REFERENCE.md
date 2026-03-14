# API Quick Reference - Kenya Procurement System

## Endpoint Summary Table

| Module | Method | Endpoint | Auth | Purpose |
|--------|--------|----------|------|---------|
| **Auth** | POST | `/api/auth/login` | ❌ | User login |
| | POST | `/api/auth/register` | ✅ | Register new user |
| | GET | `/api/auth/me` | ✅ | Get current user |
| | POST | `/api/auth/logout` | ✅ | Logout |
| **Tenders** | GET | `/api/tenders` | ✅ | List tenders (paginated) |
| | GET | `/api/tenders/{id}` | ✅ | Get tender details |
| | POST | `/api/tenders/{id}/analyze-risk` | ✅ | AI risk analysis |
| | GET | `/api/tenders/{id}/investigation-package` | ✅ | Get investigation doc |
| | GET | `/api/tenders/{id}/collusion-analysis` | ✅ | Analyze bid rigging |
| **Suppliers** | GET | `/api/suppliers` | ✅ | List suppliers |
| | GET | `/api/suppliers/{id}` | ✅ | Get supplier details |
| **Dashboard** | GET | `/api/dashboard/stats` | ✅ | Dashboard metrics |
| | GET | `/api/dashboard/heatmap` | ✅ | County risk heatmap |
| | GET | `/api/dashboard/top-risk-suppliers` | ✅ | Top risk suppliers |
| | POST | `/api/dashboard/ai-query` | ✅ | Natural language query |
| **Risk Analysis** | POST | `/api/analyze/price-check` | ✅ | Price benchmark |
| | POST | `/api/analyze/specifications` | ✅ | Spec analysis |
| | GET | `/api/analyze/county-risk` | ✅ | County risk overview |
| **Whistleblower** | POST | `/api/whistleblower/submit` | ❌ | Submit report (public) |
| | GET | `/api/whistleblower/reports` | ✅ | List reports (admin) |
| **ML Models** | GET | `/api/ml/status` | ✅ | Model training status |
| | POST | `/api/ml/train/xgboost-synthetic` | ✅ | Train XGBoost |
| | POST | `/api/ml/train/price-anomaly` | ✅ | Train price model |
| | POST | `/api/ml/train/collusion-vectorizer` | ✅ | Train collusion model |
| | GET | `/api/ml/spending-forecast/{entity_id}` | ✅ | Get spending forecast |

**Legend:** ✅ = Authentication Required | ❌ = Public Access

---

## Common Request/Response Patterns

### Pagination
```
Query: ?page=1&limit=20
Response: { items: [], total: 100, page: 1, limit: 20, pages: 5 }
```

### Filtering
```
Query: ?county=Nairobi&risk_level=high&min_value=1000000
```

### Sorting
```
Query: ?sort_by=risk_score&sort_order=desc
```

### JWT Authentication
```
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Frontend Usage Examples

### Using TanStack Query Hook (in form component)
```typescript
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/lib/services/authService'

const { mutate: login } = useMutation({
  mutationFn: authService.login,
  onSuccess: (data) => {
    // Handle successful login
    router.push('/')
  },
})
```

### Using Service Function
```typescript
import { whistleblowerService } from '@/lib/services/whistleblowerService'

const response = await whistleblowerService.submit({
  allegation_type: 'Ghost supplier',
  description: '...',
  contact_preference: 'none'
})
```

### Fetching Data
```typescript
import { tendersApi } from '@/lib/api'

const tenders = await tendersApi.list({
  county: 'Nairobi',
  risk_level: 'high',
  page: 1,
  limit: 20
})
```

---

## Required Database Tables

### users
- id, email, password_hash, full_name, role, organization, created_at

### tenders
- id, reference_number, title, description, category, county, estimated_value, procurement_method, status, submission_deadline, entity_id, created_at

### suppliers
- id, name, registration_number, county, company_age_days, tax_filings_count, risk_score, ghost_probability, contracts_won, total_value_won

### tender_risk_scores
- tender_id, total_score, risk_level, price_score, supplier_score, spec_score, contract_value_score, entity_history_score, ai_analysis, recommended_action, analyzed_at

### whistleblower_reports
- id, report_id, allegation_type, tender_reference, entity_name, description, evidence_description, contact_preference, credibility_score, urgency, triage_summary, is_credible, date_submitted, reviewed_by, reviewed_at

### tender_bids
- id, tender_id, supplier_id, supplier_name, amount, is_winner, deviation_from_lowest, similarity_score, bid_date

### directors
- id, supplier_id, name, id_number, other_companies_linked

---

## Status Codes

| Code | Meaning | When to Use |
|------|---------|------------|
| 200 | OK | Successful GET/POST/PUT/DELETE |
| 201 | Created | Resource created (POST) |
| 202 | Accepted | Async job (training) accepted |
| 400 | Bad Request | Invalid input validation failed |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (email exists) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Unhandled exception |

---

## Development Checklist

### Before Building Backend

- [ ] Review API_ENDPOINTS.md for all endpoints
- [ ] Create database schema for all tables
- [ ] Set up authentication (JWT with refresh tokens)
- [ ] Implement input validation for all endpoints
- [ ] Add CORS headers for frontend domain
- [ ] Set up error handling middleware
- [ ] Add request logging
- [ ] Implement rate limiting
- [ ] Add database indexing for search/filter performance
- [ ] Create test data/fixtures
- [ ] Document any deviations from spec

### Testing Endpoints

- [ ] Test all endpoints with Postman/Insomnia
- [ ] Verify authentication flow
- [ ] Test pagination with edge cases (page=0, limit=0)
- [ ] Test filters with invalid values
- [ ] Test sorting on all fields
- [ ] Verify error messages are clear
- [ ] Test with large datasets
- [ ] Load testing (1000+ requests/min)
- [ ] Security testing (SQL injection, XSS)

### Deployment

- [ ] Set environment variables (DB_URL, JWT_SECRET, etc.)
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring/alerting
- [ ] Enable request logging
- [ ] Test with production data
- [ ] Create backup strategy
- [ ] Document API for support team

---

## Common Issues & Solutions

### Issue: "Invalid token" error
**Solution:** Token expired or incorrect format. Implement refresh token flow.

### Issue: Pagination not working
**Solution:** Ensure `page` starts at 1, not 0. Check total count calculation.

### Issue: Filters returning no results
**Solution:** Verify filter field names match database columns. Case-sensitive?

### Issue: Risk analysis taking too long
**Solution:** AI analysis is expensive. Add background job queue (Celery/RQ).

### Issue: Rate limiting too strict
**Solution:** Adjust rate limits per role. Admins might need higher limits.

---

## Frontend-Backend Sync

When adding new features:

1. **Add to Frontend Services** (`lib/services/`)
2. **Add to API Client** (`lib/api.ts`)
3. **Create Zod Schema** (`lib/schemas/`)
4. **Create Form Component** (`components/forms/`)
5. **Create React Query Hook** (`lib/queries/`)
6. **Implement Backend Endpoint**
7. **Test Integration**

---

## Performance Optimization

### Frontend Optimizations
- Use TanStack Query caching for frequently accessed data
- Implement pagination (never fetch all records)
- Use select/omit in queries to reduce payload size

### Backend Optimizations
- Index tender fields: county, risk_level, created_at
- Index supplier fields: risk_score, ghost_probability
- Cache county risk overview (updated hourly)
- Implement database query timeout (30 seconds)
- Use connection pooling (min 5, max 20 connections)

### Network Optimizations
- Gzip response compression
- CDN for static files
- HTTP/2 server push
- Request timeout: 30 seconds
- Response timeout: 60 seconds

---

## Example cURL Commands

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "investigator@example.com",
    "password": "password"
  }'
```

### List Tenders
```bash
curl -X GET "http://localhost:8000/api/tenders?county=Nairobi&risk_level=high&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Submit Whistleblower Report
```bash
curl -X POST http://localhost:8000/api/whistleblower/submit \
  -H "Content-Type: application/json" \
  -d '{
    "allegation_type": "Ghost supplier",
    "description": "The supplier appears to be a shell company...",
    "contact_preference": "none"
  }'
```

### Analyze Risk
```bash
curl -X POST "http://localhost:8000/api/tenders/tender_001/analyze-risk?use_ai=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Environment Variables Required

```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/procurement_db
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRY=3600
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
```

---

## Support

For questions or issues with the API specification, refer to:
1. API_ENDPOINTS.md (detailed documentation)
2. IMPLEMENTATION_NOTES.md (technical details)
3. QUICK_START.md (quick start guide)
