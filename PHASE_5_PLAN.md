# Phase 5: Advanced Analytics & Reporting - Plan

## Goals
- Deliver revenue forecasting and performance analytics dashboards for admin.
- Provide cohort, retention, and acquisition insights with exportable reports.
- Maintain parity with Phase 4 quality (auth, tests, docs, responsive UI).

## Scope (MVP)
1) Revenue Dashboard
- KPIs: MRR, ARR (derived), total revenue, AOV, conversion rate (if data available)
- Time-series: revenue by day/week/month; YOY/ MOM deltas
- Segments: revenue by customer segment (VIP/LOYAL/etc.)

2) Product Performance
- Metrics: velocity (units/day), GMV, margin (if cost available), refund rate
- Top/bottom performers by period
- Filters: category, date range, active/onSale flags

3) Retention & Cohorts
- Cohorts by signup month
- Metrics: retention %, revenue per cohort, repeat rate, churn signals
- Frequency/recency distribution (RFM-lite)

4) Reports & Export
- CSV export per widget/table
- Scheduled export (stretch) or manual export links

## Data & Queries
- Use Prisma aggregated queries for orders/order_items.
- Add helper in lib/analytics (to be created) for time-bucketed series.
- Consider materialized views later; start with live queries + caching layer if needed.

## API Endpoints (planned)
- GET /api/admin/analytics/revenue?startDate&endDate&interval=day|week|month
- GET /api/admin/analytics/products?startDate&endDate&categoryId&limit
- GET /api/admin/analytics/cohorts?startDate&endDate&interval=month
- GET /api/admin/analytics/segments?startDate&endDate

## Frontend (planned)
- Pages under /admin/analytics with tabs: Revenue, Products, Cohorts.
- Charts: line (revenue), bar (products), stacked bar (segments), table exports.
- Reuse existing card components; add chart component wrappers (likely chart.js or tremor/shadcn-lite if available; else simple SVG sparklines).

## Testing Strategy
- Unit: aggregation helpers (mock data).
- Integration: API endpoints (filters, intervals, empty states, auth).
- UI: rendering of charts/tables, filter interactions, export buttons.

## Timeline
- Day 1-2: Data helpers + revenue endpoint
- Day 3: Product analytics endpoint + UI
- Day 4: Cohorts endpoint + UI
- Day 5: Polish, tests, docs

## Risks / Mitigations
- Large datasets → add pagination/limit + date filters, consider caching.
- Missing cost data → gate margin metrics; default to GMV only.
- Auth consistency → reuse admin guard.

## Deliverables
- Analytics helper library
- 3-4 admin analytics API endpoints
- Admin analytics pages with charts/tables
- CSV export on key widgets
- 40+ tests covering helpers, APIs, and UI
- Documentation update in ADMIN_PHASES and new README section
