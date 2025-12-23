# Phase 7: Inventory Automation

## Overview
Phase 7 implements intelligent inventory management with automated reordering, forecasting, SKU generation, supplier management, and dead stock detection.

## Architecture

### Current State
- **Product Model**: Has `sku`, `stock`, `inStock` fields
- **ProductVariant Model**: Has `sku`, `stock`, `inStock` fields  
- **InventoryLog Model**: Tracks all stock changes with reason
- **Inventory Page**: Real-time dashboard with bulk adjustments

### New Models Needed

#### 1. Supplier Model
```prisma
model Supplier {
  id                 String   @id @default(cuid())
  name               String
  email              String
  phone              String?
  address            String?
  leadTime           Int      // Days to deliver
  minOrderQuantity   Int      // Minimum order units
  costPerUnit        Float    // Wholesale cost
  maxOrderQuantity   Int?     // Max units per order
  preferredCategories String[] // Categories they supply
  active             Boolean  @default(true)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  productSuppliers   ProductSupplier[]
  reorders           ReorderTask[]
  
  @@map("suppliers")
}
```

#### 2. ProductSupplier Mapping
```prisma
model ProductSupplier {
  id          String   @id @default(cuid())
  productId   String
  supplierId  String
  supplierSku String
  cost        Float    // Cost from this supplier
  leadTime    Int?     // Override supplier default
  preferred   Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  supplier    Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)
  
  @@unique([productId, supplierId])
  @@index([productId])
  @@map("product_suppliers")
}
```

#### 3. SalesVelocity Model (for forecasting)
```prisma
model SalesVelocity {
  id          String   @id @default(cuid())
  productId   String
  period      String   // "daily", "weekly", "monthly"
  unitsPerPeriod Float
  lastUpdated DateTime @default(now())
  
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([productId, period])
  @@map("sales_velocities")
}
```

#### 4. StockRecommendation Model
```prisma
model StockRecommendation {
  id                    String   @id @default(cuid())
  productId             String
  recommendedStock      Int
  minStock              Int
  maxStock              Int
  safetyStock           Int
  reorderPoint          Int
  forecastedVelocity    Float
  leadTimeVariance      Int?
  confidence            Float    @default(0.95)
  generatedAt           DateTime @default(now())
  appliedAt             DateTime?
  
  product               Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([productId])
  @@map("stock_recommendations")
}
```

#### 5. ReorderTask Model
```prisma
model ReorderTask {
  id            String   @id @default(cuid())
  productId     String
  supplierId    String?
  quantity      Int
  status        String   // "PENDING", "ORDERED", "RECEIVED", "CANCELLED"
  reorderPoint  Int
  reason        String   // "LOW_STOCK", "SCHEDULED", "MANUAL"
  orderedAt     DateTime?
  expectedAt    DateTime?
  receivedAt    DateTime?
  cost          Float?
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  product       Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  supplier      Supplier? @relation(fields: [supplierId], references: [id])
  
  @@index([productId])
  @@index([status])
  @@index([createdAt])
  @@map("reorder_tasks")
}
```

#### 6. DeadStockAlert Model
```prisma
model DeadStockAlert {
  id              String   @id @default(cuid())
  productId       String
  daysWithoutSale Int
  lastSaleDate    DateTime?
  currentStock    Int
  estimatedValue  Float
  status          String   // "ACTIVE", "REVIEWED", "ARCHIVED", "DELISTED"
  action          String?  // "DISCOUNT", "BUNDLE", "CLEARANCE", "RETURN", "DONATE"
  actionAt        DateTime?
  notes           String?
  createdAt       DateTime @default(now())
  
  product         Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([productId])
  @@index([status])
  @@map("dead_stock_alerts")
}
```

## Components

### 1. **Supplier Management Interface** (`/admin/suppliers`)
- Supplier list with CRUD operations
- Supplier detail page with product mappings
- Bulk supplier import from CSV
- Supplier performance metrics (on-time delivery, quality)

### 2. **Auto-Reorder Settings** (`/admin/inventory/auto-reorder`)
- Low-stock threshold configuration per product
- Automatic trigger configuration
- Reorder task dashboard
- Order history and fulfillment tracking

### 3. **Inventory Forecasting Dashboard** (`/admin/inventory/forecasting`)
- Sales velocity trends (daily/weekly/monthly)
- Forecast projections (30/60/90 days)
- Stock level recommendations
- Safety stock calculations

### 4. **Dead Stock Detection** (`/admin/inventory/dead-stock`)
- Products with no sales for X days
- Batch action workflows (discount, bundle, clearance)
- Clearance value tracking
- Historical dead stock archiving

### 5. **Stock Recommendations Panel**
- Auto-generated recommendations per product
- Min/max/safety/reorder point calculations
- Apply recommendations to products
- Override capability with reason logging

## API Endpoints

### Supplier Management
- `POST /api/admin/suppliers` - Create supplier
- `GET /api/admin/suppliers` - List suppliers with filters
- `GET /api/admin/suppliers/:id` - Get supplier details
- `PUT /api/admin/suppliers/:id` - Update supplier
- `DELETE /api/admin/suppliers/:id` - Delete supplier
- `POST /api/admin/suppliers/:id/products` - Link product to supplier

### Auto-Reorder
- `POST /api/admin/inventory/auto-reorder/trigger` - Trigger reorder check
- `GET /api/admin/inventory/reorder-tasks` - List reorder tasks
- `POST /api/admin/inventory/reorder-tasks` - Create reorder task
- `PUT /api/admin/inventory/reorder-tasks/:id` - Update reorder status
- `DELETE /api/admin/inventory/reorder-tasks/:id` - Cancel reorder

### Forecasting
- `GET /api/admin/inventory/sales-velocity/:productId` - Get sales velocity
- `POST /api/admin/inventory/sales-velocity/calculate` - Calculate velocities
- `GET /api/admin/inventory/recommendations/:productId` - Get stock recommendation
- `POST /api/admin/inventory/recommendations/generate` - Generate all recommendations
- `PUT /api/admin/inventory/recommendations/:productId/apply` - Apply recommendation

### Dead Stock
- `GET /api/admin/inventory/dead-stock` - List dead stock alerts
- `POST /api/admin/inventory/dead-stock/detect` - Run dead stock detection
- `PUT /api/admin/inventory/dead-stock/:id` - Update alert status/action

## Implementation Steps

### Step 1: Prisma Schema & Migration
1. Add Supplier model with product mappings
2. Add SalesVelocity model for historical sales data
3. Add StockRecommendation model for AI-generated suggestions
4. Add ReorderTask model for automation tracking
5. Add DeadStockAlert model for obsolescence detection
6. Create and apply migration

### Step 2: Backend Services
1. **SalesVelocityService**
   - Calculate daily/weekly/monthly sales from OrderItems
   - Update SalesVelocity table
   - Handle missing/sparse data gracefully

2. **StockRecommendationService**
   - Calculate min/max/safety/reorder points using formulas:
     - Reorder Point = (Average Daily Demand × Lead Time) + Safety Stock
     - Safety Stock = Z-score × Std Dev × √Lead Time
     - Economic Order Quantity = √(2 × Annual Demand × Order Cost / Holding Cost)

3. **AutoReorderService**
   - Monitor stock levels
   - Trigger reorders when stock < reorder point
   - Create ReorderTask records
   - Select best supplier by cost/lead time

4. **DeadStockService**
   - Identify products with no sales for 90+ days
   - Calculate inventory value at risk
   - Generate action recommendations
   - Create alerts

### Step 3: API Routes
Create all routes for CRUD operations and business logic

### Step 4: UI Components
1. SupplierList, SupplierForm, SupplierDetail
2. AutoReorderDashboard, ReorderTaskCard
3. ForecastingChart, RecommendationPanel, SalesVelocityChart
4. DeadStockList, DeadStockActionForm

### Step 5: Admin Pages
1. `/admin/suppliers` - Supplier management
2. `/admin/inventory/auto-reorder` - Reorder settings & task management
3. `/admin/inventory/forecasting` - Forecasting & recommendations
4. `/admin/inventory/dead-stock` - Dead stock detection & actions

### Step 6: Testing
- Unit tests for calculation services
- Integration tests for API routes
- End-to-end tests for workflows

## Formulas & Calculations

### Safety Stock
```
Safety Stock = Z × σ × √L
where:
  Z = Service level factor (1.65 for 95% service level)
  σ = Standard deviation of daily demand
  L = Lead time in days
```

### Reorder Point
```
ROP = (D × L) + SS
where:
  D = Average daily demand
  L = Lead time in days
  SS = Safety stock
```

### Economic Order Quantity
```
EOQ = √(2 × D × S / H)
where:
  D = Annual demand in units
  S = Cost per order
  H = Annual holding cost per unit
```

### Demand Forecast (Simple Exponential Smoothing)
```
F(t+1) = α × D(t) + (1-α) × F(t)
where:
  α = Smoothing factor (0.3 typical)
  D(t) = Actual demand at time t
  F(t) = Previous forecast
```

## Database Indexes
- `ReorderTask`: (productId, status), (status, createdAt)
- `SalesVelocity`: (productId, period)
- `StockRecommendation`: (productId)
- `DeadStockAlert`: (status, productId)
- `ProductSupplier`: (productId), (supplierId)

## Configuration Constants
```typescript
// lib/inventory-automation-config.ts
export const INVENTORY_CONFIG = {
  DEAD_STOCK_DAYS: 90,
  SAFETY_SERVICE_LEVEL: 0.95, // Z-score ≈ 1.65
  DEFAULT_REORDER_COST: 50, // $ per order
  DEFAULT_HOLDING_COST: 0.25, // 25% of unit cost per year
  MIN_FORECAST_PERIOD: 30, // days of history needed
  FORECAST_LOOKBACK: 180, // days of history to analyze
  VELOCITY_UPDATE_INTERVAL: 24 * 60 * 60 * 1000, // daily
  REORDER_CHECK_INTERVAL: 60 * 60 * 1000, // hourly
  DEAD_STOCK_CHECK_INTERVAL: 24 * 60 * 60 * 1000, // daily
}
```

## Success Metrics
- Auto-reorder accuracy (correct triggers, no false positives)
- Forecast accuracy (MAPE < 20%)
- Stockout reduction (< 2% of products)
- Inventory turnover improvement (+ 15%)
- Dead stock identification (100% coverage)
- Supplier performance tracking (on-time %, quality %)

## Future Enhancements
- Multi-warehouse inventory allocation
- AI-powered demand forecasting (ML models)
- Supplier optimization (cost, lead time, quality)
- Seasonal demand patterns
- Price elasticity factoring
- Automated reorder approval workflows
- Integration with supplier APIs
- Inventory financing recommendations
