# Backend Implementation Guide

## Technology Stack Recommendations

### Framework
- **Python**: FastAPI (modern, fast, great for async)
- **Node.js**: Express.js or NestJS
- **Go**: Gin or Echo (if performance is critical)

### Database
- **PostgreSQL** (recommended): Excellent for complex queries, JSON support
- **MongoDB**: If you need flexible schema for compliance docs
- **Redis**: For caching and session management

### ML/AI Stack
- **XGBoost**: Risk scoring model
- **Isolation Forest**: Price anomaly detection
- **Doc2Vec**: Collusion detection via bid similarity
- **LSTM**: Spending forecasts
- **scikit-learn**: Supporting algorithms

---

## Project Structure (Python/FastAPI)

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app setup
│   ├── config.py                  # Environment config
│   ├── dependencies.py            # Shared dependencies
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py            # /api/auth/* endpoints
│   │   │   ├── tenders.py         # /api/tenders/* endpoints
│   │   │   ├── suppliers.py       # /api/suppliers/* endpoints
│   │   │   ├── dashboard.py       # /api/dashboard/* endpoints
│   │   │   ├── analyze.py         # /api/analyze/* endpoints
│   │   │   ├── whistleblower.py   # /api/whistleblower/* endpoints
│   │   │   └── ml.py              # /api/ml/* endpoints
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                # User ORM model
│   │   ├── tender.py              # Tender ORM model
│   │   ├── supplier.py            # Supplier ORM model
│   │   ├── whistleblower.py       # WhistleblowerReport ORM model
│   │   └── ...
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py                # Pydantic schemas for auth
│   │   ├── tender.py              # Pydantic schemas for tenders
│   │   ├── supplier.py            # Pydantic schemas for suppliers
│   │   └── ...
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py        # Auth business logic
│   │   ├── tender_service.py      # Tender business logic
│   │   ├── risk_service.py        # Risk analysis business logic
│   │   ├── ml_service.py          # ML operations
│   │   └── whistleblower_service.py
│   │
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── models.py              # ML model definitions
│   │   ├── price_anomaly.py       # Price anomaly detection
│   │   ├── risk_scoring.py        # XGBoost risk model
│   │   ├── collusion_detector.py  # Bid rigging detection
│   │   └── spending_forecast.py   # LSTM forecasting
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   ├── session.py             # Database session management
│   │   └── init_db.py             # Database initialization
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── logging.py             # Logging setup
│   │   ├── security.py            # Password hashing, JWT
│   │   ├── validators.py          # Input validation helpers
│   │   └── error_handlers.py      # Custom exception handling
│   │
│   └── middleware/
│       ├── __init__.py
│       ├── auth.py                # JWT verification middleware
│       ├── cors.py                # CORS configuration
│       └── rate_limit.py          # Rate limiting
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py                # Pytest fixtures
│   ├── unit/
│   │   ├── test_auth.py
│   │   ├── test_tenders.py
│   │   └── ...
│   └── integration/
│       ├── test_auth_flow.py
│       └── ...
│
├── migrations/                    # Alembic migrations
│   └── versions/
│
├── requirements.txt
├── .env.example
└── README.md
```

---

## FastAPI Setup Example

```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZIPMiddleware
from app.api.v1 import (
    auth, tenders, suppliers, dashboard, analyze, whistleblower, ml
)
from app.middleware.rate_limit import RateLimitMiddleware
from app.utils.logging import setup_logging

setup_logging()

app = FastAPI(
    title="Kenya Procurement Anti-Corruption API",
    version="1.0.0",
    description="AI-powered procurement monitoring system"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compression
app.add_middleware(GZIPMiddleware, minimum_size=1000)

# Rate limiting
app.add_middleware(RateLimitMiddleware)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tenders.router, prefix="/api/tenders", tags=["tenders"])
app.include_router(suppliers.router, prefix="/api/suppliers", tags=["suppliers"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(analyze.router, prefix="/api/analyze", tags=["analyze"])
app.include_router(whistleblower.router, prefix="/api/whistleblower", tags=["whistleblower"])
app.include_router(ml.router, prefix="/api/ml", tags=["ml"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}
```

---

## Authentication Implementation

```python
# app/utils/security.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"])
SECRET_KEY = "your-secret-key-min-32-chars"
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=1)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

```python
# app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import LoginRequest, UserResponse
from app.utils.security import hash_password, verify_password, create_access_token
from app.database.session import get_db
from app.models.user import User

router = APIRouter()

@router.post("/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }
```

---

## Database Models Example

```python
# app/models/tender.py
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class Tender(Base):
    __tablename__ = "tenders"
    
    id = Column(String, primary_key=True)
    reference_number = Column(String, unique=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    category = Column(String, index=True)
    county = Column(String, index=True)
    estimated_value = Column(Float)
    procurement_method = Column(String)
    status = Column(String)
    submission_deadline = Column(DateTime)
    entity_id = Column(String, ForeignKey("procuring_entities.id"))
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    entity = relationship("ProcuringEntity", back_populates="tenders")
    risk_score = relationship("TenderRiskScore", uselist=False, back_populates="tender")
    bids = relationship("TenderBid", back_populates="tender")
    
    # Indexes
    __table_args__ = (
        Index('idx_county_risk', 'county'),
        Index('idx_created_date', 'created_at'),
    )
```

---

## Risk Analysis Service

```python
# app/services/risk_service.py
from app.ml.risk_scoring import XGBoostRiskScorer
from app.ml.price_anomaly import PriceAnomalyDetector
from app.ml.collusion_detector import CollusionDetector

class RiskAnalysisService:
    def __init__(self):
        self.risk_scorer = XGBoostRiskScorer()
        self.price_detector = PriceAnomalyDetector()
        self.collusion_detector = CollusionDetector()
    
    async def analyze_tender_risk(self, tender_id: str, use_ai: bool = True):
        tender = await self._get_tender(tender_id)
        
        # Get component scores
        price_score = await self.price_detector.analyze(tender)
        spec_score = await self._analyze_specifications(tender)
        supplier_score = await self._analyze_suppliers(tender)
        entity_score = await self._analyze_entity(tender)
        
        # ML risk prediction
        if use_ai:
            ai_score = self.risk_scorer.predict({
                "price_deviation": price_score,
                "spec_restrictiveness": spec_score,
                "supplier_risk": supplier_score,
                "entity_history": entity_score,
            })
        else:
            ai_score = (price_score + spec_score + supplier_score + entity_score) / 4
        
        return {
            "total_score": ai_score,
            "risk_level": self._get_risk_level(ai_score),
            "price_score": price_score,
            "spec_score": spec_score,
            "supplier_score": supplier_score,
            "entity_history_score": entity_score,
            "flags": await self._generate_flags(tender, ai_score),
            "ai_analysis": await self._generate_analysis(tender, ai_score),
            "recommended_action": self._recommend_action(ai_score),
        }
```

---

## Testing Example

```python
# tests/test_auth.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.user import User
from app.database.session import SessionLocal

client = TestClient(app)

@pytest.fixture
def test_user(db):
    user = User(
        id="test_user",
        email="test@example.com",
        password_hash="...",
        full_name="Test User",
        role="investigator"
    )
    db.add(user)
    db.commit()
    return user

def test_login_success(test_user):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_credentials():
    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
```

---

## Database Migration (Alembic)

```bash
# Initialize migrations
alembic init migrations

# Create a migration
alembic revision --autogenerate -m "Add tender table"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## Environment Configuration

```python
# app/config.py
from pydantic import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:pass@localhost/db"
    JWT_SECRET: str
    JWT_EXPIRY: int = 3600
    REDIS_URL: str = "redis://localhost:6379"
    LOG_LEVEL: str = "info"
    CORS_ORIGINS: list = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

---

## Error Handling

```python
# app/utils/error_handlers.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

def setup_error_handlers(app: FastAPI):
    @app.exception_handler(IntegrityError)
    async def integrity_error_handler(request: Request, exc: IntegrityError):
        return JSONResponse(
            status_code=409,
            content={"detail": "Resource already exists"}
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )
```

---

## Logging Setup

```python
# app/utils/logging.py
import logging
from app.config import settings

def setup_logging():
    logging.basicConfig(
        level=settings.LOG_LEVEL.upper(),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    return logging.getLogger(__name__)

logger = setup_logging()
```

---

## Performance Optimization Tips

### Database Optimization
1. Create indexes on frequently filtered columns (county, risk_level, created_at)
2. Use database views for complex queries
3. Implement connection pooling (min 5, max 20)
4. Use read replicas for heavy queries
5. Archive old data (>1 year) to separate table

### Caching Strategy
1. Cache county risk overview (updated hourly)
2. Cache top 10 risk suppliers (updated daily)
3. Use Redis for session management
4. TTL: 1 hour for most queries, 24 hours for static data

### API Optimization
1. Implement pagination (never fetch all records)
2. Use database query selection (select only needed fields)
3. Compress responses (gzip)
4. Implement request timeout (30 seconds)
5. Add database query timeout (30 seconds)

---

## Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL/TLS certificates installed
- [ ] CORS origins configured
- [ ] Rate limiting configured
- [ ] Logging enabled
- [ ] Monitoring/alerting set up
- [ ] Backup strategy implemented
- [ ] Load testing completed
- [ ] Security audit completed
- [ ] Documentation updated

---

## Monitoring & Observability

```python
# app/middleware/logging.py
from fastapi import Request
from time import time
import logging

logger = logging.getLogger(__name__)

async def log_request_middleware(request: Request, call_next):
    start = time()
    response = await call_next(request)
    duration = time() - start
    
    logger.info(
        f"{request.method} {request.url.path} - Status: {response.status_code} - Duration: {duration:.3f}s"
    )
    return response
```

---

## Key Dependencies (requirements.txt)

```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
alembic==1.13.1
psycopg2-binary==2.9.9
pydantic==2.5.0
python-jose==3.3.0
passlib==1.7.4
python-multipart==0.0.6
xgboost==2.0.3
scikit-learn==1.3.2
pandas==2.1.3
numpy==1.26.3
redis==5.0.1
gensim==4.3.2
pytest==7.4.3
pytest-asyncio==0.21.1
```

This implementation guide provides a solid foundation for building the backend API. Adjust technologies and patterns based on your team's expertise and specific requirements.
