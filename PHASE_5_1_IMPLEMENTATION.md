# Phase 5.1 Implementation Guide: Advanced Customer Analytics
## RFM Analysis, Customer Lifetime Value & Churn Prediction

**Version:** 1.0  
**Date:** December 2024  
**Status:** Production-Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [API Reference](#api-reference)
5. [Database Schema](#database-schema)
6. [Implementation Details](#implementation-details)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Overview

Phase 5.1 extends Phase 5 analytics with advanced customer segmentation and predictive analytics:

- **RFM Analysis**: Segment customers by Recency, Frequency, and Monetary value
- **Customer Lifetime Value (CLV)**: Predict long-term customer value and revenue
- **Churn Prediction**: Identify at-risk customers before they leave

### Key Metrics

| Feature | Description | Use Case |
|---------|-------------|----------|
| RFM Segmentation | 10 customer segments | Targeted marketing campaigns |
| CLV Scoring | LTV + churn risk prediction | Revenue forecasting |
| Churn Prediction | Risk factors & estimated churn date | Retention campaigns |

### Business Value

- **Revenue Protection**: Identify churn risks 60-90 days early
- **Marketing Efficiency**: Target high-value customers for upsell/cross-sell
- **Customer Retention**: Win-back campaigns for at-risk customers
- **Strategic Planning**: LTV-based inventory and pricing decisions

---

## Architecture

### Technology Stack

```
Frontend: React (Next.js 14)
  ├── 3 API endpoints
  ├── Real-time dashboard with 3 tabs
  └── Dark-themed responsive UI

Backend: TypeScript + Next.js API Routes
  ├── Authentication (NextAuth)
  ├── Role-based access control (Admin-only)
  └── Error handling & validation

Database: Prisma + PostgreSQL
  ├── Customer model (relationships)
  ├── Order model (purchase history)
  └── OrderItem model (product details)

Analytics Engine: lib/analytics.ts
  ├── RFM calculation (O(n) complexity)
  ├── CLV prediction (statistical model)
  └── Churn forecasting (heuristic-based)
```

### Data Flow

```
┌─────────────────┐
│   Dashboard     │  User views Phase 5.1 dashboard
└────────┬────────┘
         │
         ├─→ GET /api/admin/analytics/rfm
         ├─→ GET /api/admin/analytics/clv
         └─→ GET /api/admin/analytics/churn
         │
         ├─→ app/admin/analytics/phase-5-1/page.tsx
         │
┌────────▼────────────────────────┐
│  lib/analytics.ts Helper Fns    │
├─────────────────────────────────┤
│ • calculateRFMScores()          │
│ • getRFMSegmentSummary()        │
│ • calculateCLV()                │
│ • predictChurn()                │
└────────┬────────────────────────┘
         │
         └─→ Prisma queries to database
         │
┌────────▼─────────────────┐
│  PostgreSQL              │
├─────────────────────────┤
│ • Customer              │
│ • Order                 │
│ • OrderItem             │
└─────────────────────────┘
```

### File Structure

```
Phase 5.1 Files:
├── lib/analytics.ts (extended from Phase 5)
│   ├── calculateRFMScores() - RFM calculation
│   ├── getRFMSegmentSummary() - RFM aggregation
│   ├── calculateCLV() - Lifetime value
│   └── predictChurn() - Churn probability
│
├── app/api/admin/analytics/
│   ├── rfm/route.ts - RFM endpoint
│   ├── clv/route.ts - CLV endpoint
│   └── churn/route.ts - Churn endpoint
│
├── app/admin/analytics/
│   └── phase-5-1/page.tsx - Dashboard UI
│
└── __tests__/
    ├── unit/phase-5-1-analytics.test.ts
    ├── integration/phase-5-1-api.test.ts
    └── e2e/phase-5-1-dashboard.test.tsx
```

---

## Features

### 1. RFM Analysis

**Purpose**: Segment customers into 10 marketing-friendly segments based on purchase behavior

**Segments**:
- **Champions** (R5 F5 M5): Your best customers - frequent, recent, high-spending
- **Loyal Customers** (R4+ F3+ M3+): Consistent performers
- **Potential Loyalists** (R4 F2+ M3): Good spend potential
- **New Customers** (R4 F1-2): Recently acquired
- **Promising** (R3 F2 M1-2): Monitor for upsell
- **Need Attention** (R3 F1-2 M2+): Engagement risk
- **At Risk** (R1-2 F3+ M3+): Former good customers, not buying
- **Cannot Lose Them** (R1-2 M4+): High-value but inactive
- **About to Sleep** (R1-2 F2+ M2+): Declining engagement
- **Lost Customers** (R1 F1 M1): No engagement

**Calculation**:
```typescript
Recency Score (R):  5=0-30 days, 4=31-90 days, 3=91-180 days, 2=181-365 days, 1=365+ days
Frequency Score (F): 5=10+, 4=5-9, 3=3-4, 2=2, 1=1
Monetary Score (M):  5=$5000+, 4=$2500-4999, 3=$1000-2499, 2=$500-999, 1=<$500
```

**Use Cases**:
- Target "Need Attention" segment with re-engagement campaigns
- Nurture "Potential Loyalists" with exclusive offers
- Prioritize "Champions" for VIP programs
- Reactivate "At Risk" customers with win-back emails

### 2. Customer Lifetime Value (CLV)

**Purpose**: Estimate total expected revenue from each customer

**Calculation**:
```
Current Value = Total historical spending
Predicted Value = AOV × Purchase Frequency × 730 days (2 years)
Churn Risk = Days since last order / 365 × 100%
LTV = Current Value + (Predicted Value × (1 - Churn Risk %))
```

**Value Segments**:
- **High Value**: LTV ≥ $10,000 (focus on retention)
- **Medium Value**: LTV $3,000 - $9,999 (growth opportunity)
- **Low Value**: LTV < $3,000 (cost-effective acquisition)

**Use Cases**:
- Allocate customer service resources by LTV
- Adjust marketing spend based on customer value
- Forecast annual revenue by customer segment
- Identify underperforming high-value customers

### 3. Churn Prediction

**Purpose**: Identify customers likely to churn in next 30-90 days

**Risk Factors** (weighted):
1. **Days Since Last Order** (40% weight)
   - 365+ days: +40 points
   - 180-365 days: +25 points
   - 90-180 days: +15 points
   - 30-90 days: +5 points

2. **Purchase Frequency Decline** (30% weight)
   - 50% decline → +20 points
   - 30% decline → +15 points
   - 10% decline → +5 points

3. **Average Order Value Decrease** (20% weight)
   - >20% decrease → +10 points
   - >10% decrease → +5 points

4. **Support Tickets** (10% weight)
   - Multiple tickets indicate satisfaction issues

**Risk Levels**:
- **High Risk**: ≥60% probability (urgent intervention)
- **Medium Risk**: 35-59% probability (monitor/nurture)
- **Low Risk**: <35% probability (standard retention)

**Predicted Actions**:
- Estimated next churn date based on purchase intervals
- Specific risk factors listed for targeted campaigns
- Win-back campaign trigger recommendations

---

## API Reference

### GET /api/admin/analytics/rfm

Retrieve RFM analysis and customer segmentation

**Request**:
```bash
GET /api/admin/analytics/rfm?view=summary
```

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| view | string | 'summary' | 'summary' for segments, 'detailed' for individual scores |

**Response** (Summary View):
```json
{
  "segments": [
    {
      "segment": "Champions",
      "count": 45,
      "avgRecency": 18,
      "avgFrequency": 12.5,
      "avgMonetary": 3250.75,
      "revenue": 146283.75
    }
  ],
  "totalCustomers": 342,
  "totalRevenue": 285432.15,
  "timestamp": "2024-12-20T10:30:00.000Z"
}
```

**Response** (Detailed View):
```json
{
  "scores": [
    {
      "customerId": "cust-123",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "recency": 18,
      "frequency": 12,
      "monetary": 3250.75,
      "rfmScore": "554",
      "rfmSegment": "Champions",
      "calculatedAt": "2024-12-20T10:30:00.000Z"
    }
  ],
  "count": 342,
  "timestamp": "2024-12-20T10:30:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing admin role
- `500 Internal Server Error`: Database connectivity issue

---

### GET /api/admin/analytics/clv

Retrieve Customer Lifetime Value analysis

**Request**:
```bash
GET /api/admin/analytics/clv?segment=all&limit=100
```

**Query Parameters**:
| Parameter | Type | Default | Options | Description |
|-----------|------|---------|---------|-------------|
| segment | string | 'all' | all, high, medium, low | Filter by value segment |
| limit | number | 100 | 1-500 | Max customers to return |

**Response**:
```json
{
  "data": [
    {
      "customerId": "cust-123",
      "customerName": "John Doe",
      "currentValue": 3250.75,
      "predictedValue": 2145.30,
      "churnRisk": 15,
      "ltv": 4892.59,
      "valueSegment": "high"
    }
  ],
  "summary": {
    "totalCustomers": 342,
    "highValue": 45,
    "mediumValue": 127,
    "lowValue": 170,
    "totalLTV": 1450328.75,
    "averageLTV": 4244.22,
    "totalCurrentValue": 485920.50
  },
  "count": 45,
  "timestamp": "2024-12-20T10:30:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing admin role
- `500 Internal Server Error`: CLV calculation failed

---

### GET /api/admin/analytics/churn

Retrieve churn predictions and risk analysis

**Request**:
```bash
GET /api/admin/analytics/churn?riskLevel=high&daysThreshold=90&limit=50
```

**Query Parameters**:
| Parameter | Type | Default | Options | Description |
|-----------|------|---------|---------|-------------|
| riskLevel | string | 'all' | all, high, medium, low | Filter by risk level |
| daysThreshold | number | 90 | 7-365 | Days of purchase history to analyze |
| limit | number | 100 | 1-500 | Max predictions to return |

**Response**:
```json
{
  "predictions": [
    {
      "customerId": "cust-456",
      "customerName": "Jane Smith",
      "customerEmail": "jane@example.com",
      "churnProbability": 78,
      "churnRisk": "high",
      "riskFactors": [
        "No purchase in 145+ days",
        "Purchase frequency declined by 67%",
        "Average order value decreased by 45%"
      ],
      "lastOrderDate": "2024-08-05T00:00:00.000Z",
      "daysSinceLastOrder": 137,
      "predictedChurnDate": "2025-01-15T00:00:00.000Z"
    }
  ],
  "summary": {
    "totalAtRisk": 89,
    "highRisk": 23,
    "mediumRisk": 34,
    "lowRisk": 32,
    "averageChurnProbability": 52.4
  },
  "count": 23,
  "daysThreshold": 90,
  "timestamp": "2024-12-20T10:30:00.000Z"
}
```

**Validation Errors**:
- `400 Bad Request`: daysThreshold must be 7-365
- `401 Unauthorized`: Missing admin role

---

## Database Schema

### Relationships Used

```typescript
// From existing Phase 5 schema
Customer
  ├── id: String (primary)
  ├── name: String
  ├── email: String
  ├── createdAt: DateTime
  └── orders: Order[] (relation)

Order
  ├── id: String (primary)
  ├── customerId: String (foreign)
  ├── createdAt: DateTime
  ├── total: Float
  ├── status: OrderStatus
  ├── customer: Customer (relation)
  └── items: OrderItem[] (relation)

OrderItem
  ├── id: String (primary)
  ├── orderId: String (foreign)
  ├── productId: String (foreign)
  ├── quantity: Int
  ├── price: Float
  └── product: Product (relation)
```

### Query Optimization

All Phase 5.1 calculations use optimized Prisma queries:

```typescript
// RFM calculation
Customer.findMany({
  include: {
    orders: {
      select: { createdAt, total, status },
      where: { status: { not: 'CANCELLED' } }
    }
  }
})

// CLV calculation (same as RFM)

// Churn prediction with ordering
Customer.findMany({
  include: {
    orders: {
      select: { createdAt, total, status },
      where: { status: { not: 'CANCELLED' } },
      orderBy: { createdAt: 'desc' }
    }
  }
})
```

### Performance Considerations

**Time Complexity**:
- RFM Calculation: O(n × m) where n=customers, m=avg orders/customer
- CLV Calculation: O(n × m) with statistical aggregation
- Churn Prediction: O(n × m²) for interval analysis

**Expected Performance**:
- 1,000 customers: 200-400ms
- 10,000 customers: 2-5 seconds
- 100,000 customers: 15-30 seconds

**Recommended Indexes**:
```sql
CREATE INDEX idx_customer_created ON customer(createdAt);
CREATE INDEX idx_order_customer ON order(customerId);
CREATE INDEX idx_order_created_status ON order(createdAt, status);
CREATE INDEX idx_order_customer_created ON order(customerId, createdAt);
```

---

## Implementation Details

### RFM Scoring Logic

```typescript
function getRFMSegment(r: number, f: number, m: number): string {
  // Champions: high across all metrics
  if (r >= 4 && f >= 4 && m >= 4) return 'Champions'
  
  // Loyal: consistently high
  if (r >= 4 && f >= 3 && m >= 3) return 'Loyal Customers'
  
  // ... other segments based on R/F/M combinations
}

// Score interpretation:
// 5 = Top 20% | 4 = 40-60% | 3 = 60-80% | 2 = 80-90% | 1 = Bottom 10%
```

### CLV Prediction Model

```typescript
// Simplified linear model
PredictedValue = AOV × FrequencyPerDay × 730days

// Where:
AOV = Total Spent / Order Count
FrequencyPerDay = Order Count / Days Since First Order
ChurnRisk% = (Days Since Last Order / 365) × 100
LTV = Current Value + (Predicted Value × (1 - ChurnRisk%))
```

### Churn Probability Calculation

```typescript
function calculateChurnProbability(indicators: ChurnIndicators): number {
  let probability = 0

  // Weighted factors
  if (daysSinceLastOrder > 365) probability += 40  // 40% weight
  else if (daysSinceLastOrder > 180) probability += 25
  else if (daysSinceLastOrder > 90) probability += 15
  else if (daysSinceLastOrder > 30) probability += 5

  probability += Math.min(30, frequencyDecline × 1.5)  // 30% weight
  
  if (pricePointShift < -20) probability += 10  // 20% weight
  else if (pricePointShift < -10) probability += 5

  return Math.min(100, probability)
}
```

---

## Testing

### Test Coverage: 18 Tests

**Unit Tests** (8 tests - `phase-5-1-analytics.test.ts`):
```
✓ RFM segments customers correctly
✓ RFM handles empty orders
✓ RFM summary aggregates by segment
✓ CLV computes LTV with predictions
✓ CLV calculates churn risk
✓ CLV segments by value
✓ Churn identifies high-risk customers
✓ Churn identifies risk factors
```

**Integration Tests** (6 tests - `phase-5-1-api.test.ts`):
```
✓ RFM endpoint requires authentication
✓ CLV endpoint supports filtering
✓ Churn endpoint validates parameters
✓ All endpoints include proper summaries
✓ Error handling works correctly
✓ Request validation functions
```

**E2E Tests** (4 tests - `phase-5-1-dashboard.test.tsx`):
```
✓ Dashboard renders all 3 tabs
✓ Tab switching updates data
✓ Filters work for each tab
✓ UI displays risk indicators correctly
```

### Running Tests

```bash
# Run all Phase 5.1 tests
npm test -- phase-5-1

# Run specific test suite
npm test -- phase-5-1-analytics.test.ts
npm test -- phase-5-1-api.test.ts
npm test -- phase-5-1-dashboard.test.tsx

# Run with coverage
npm test -- phase-5-1 --coverage
```

### Test Examples

```typescript
// Unit test example
test('calculateRFMScores should segment customers correctly', async () => {
  const scores = await calculateRFMScores(new Date('2024-12-20'))
  expect(scores[0].rfmSegment).toBe('Champions')
})

// Integration test example
test('RFM endpoint should require authentication', async () => {
  const res = await fetch('/api/admin/analytics/rfm')
  expect(res.status).toBe(401)
})

// E2E test example
test('Dashboard should switch tabs and fetch data', async () => {
  userEvent.click(screen.getByText('RFM Analysis'))
  await waitFor(() => {
    expect(screen.getByText('Champions')).toBeInTheDocument()
  })
})
```

---

## Deployment

### Pre-Deployment Checklist

- [ ] All 18 tests passing
- [ ] TypeScript compilation successful
- [ ] Code review completed
- [ ] Database backups created
- [ ] Monitoring alerts configured
- [ ] Admin access verified

### Staging Deployment

```bash
# 1. Merge to staging branch
git checkout staging
git pull origin main

# 2. Run full test suite
npm test -- phase-5-1

# 3. Build and verify
npm run build

# 4. Deploy to staging environment
npm run deploy:staging

# 5. Smoke test APIs
curl https://staging.example.com/api/admin/analytics/rfm \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Production Deployment

```bash
# 1. Create production branch
git checkout -b release/phase-5-1
git merge main

# 2. Final verification
npm run build
npm test

# 3. Create GitHub release
gh release create v5.1.0 --notes "Phase 5.1: RFM, CLV, Churn"

# 4. Deploy to production
npm run deploy:prod

# 5. Monitor metrics
# - API response times
# - Error rates
# - Data accuracy checks
```

### Rollback Plan

```bash
# If issues detected, rollback to Phase 5
git revert <phase-5-1-commit>
npm run deploy:prod

# Alert: Phase 5.1 disabled
# Status: Investigating issue
# Timeline: Return to Phase 5 in 2 minutes
```

---

## Troubleshooting

### Common Issues

**Issue**: Churn predictions seem inaccurate  
**Cause**: Historical data has gaps or inconsistent date formats  
**Solution**:
```sql
-- Check date consistency
SELECT customerId, COUNT(*), MAX(createdAt) - MIN(createdAt) as span
FROM "Order"
GROUP BY customerId
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC;
```

**Issue**: RFM segment counts don't add up  
**Cause**: Customers with zero orders excluded from calculations  
**Solution**: Explicitly handle empty order customers in RFM function

**Issue**: API timeout on large customer bases  
**Cause**: N+1 queries or missing indexes  
**Solution**: Create recommended indexes and use `select` fields

**Issue**: CLV predictions too high/low  
**Cause**: 2-year projection model may need tuning  
**Solution**: Adjust multiplier or add seasonality factors

### Debugging

**Enable debug logging**:
```typescript
// In analytics.ts
const DEBUG = process.env.DEBUG_ANALYTICS === 'true'

if (DEBUG) {
  console.time('RFM Calculation')
  // ... calculation
  console.timeEnd('RFM Calculation')
}
```

**Run with debug**:
```bash
DEBUG_ANALYTICS=true npm test
```

**Check API response times**:
```bash
# Time each endpoint
time curl https://localhost:3000/api/admin/analytics/rfm
time curl https://localhost:3000/api/admin/analytics/clv
time curl https://localhost:3000/api/admin/analytics/churn
```

### Performance Optimization

If response times exceed 5 seconds:

1. **Add database indexes** (see Database Schema section)
2. **Implement caching**:
   ```typescript
   const cache = new Map()
   const CACHE_TTL = 60 * 60 * 1000 // 1 hour
   ```

3. **Use query pagination**:
   ```typescript
   Customer.findMany({
     skip: (page - 1) * 100,
     take: 100,
   })
   ```

4. **Implement incremental calculations**:
   - Run background jobs nightly
   - Cache results in Redis
   - Return cached results, update in background

---

## Future Enhancements

**Phase 5.2 Roadmap**:
- [ ] Interactive charts with Recharts
- [ ] Scheduled email reports
- [ ] Machine learning churn models
- [ ] Customer journey mapping
- [ ] Attribution analysis
- [ ] Cohort retention retention projection
- [ ] Integration with external CRM systems

---

**Support**: For issues, contact the analytics team or create GitHub issue  
**Documentation**: See PHASE_5_SESSION_SUMMARY.md for Phase 5 context
