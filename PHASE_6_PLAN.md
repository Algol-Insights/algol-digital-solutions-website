# Phase 6: Marketing & Promotions - Implementation Plan

**Status**: 🚧 In Progress  
**Start Date**: December 2024  
**Estimated Duration**: 1-2 weeks

---

## Overview

Phase 6 transforms basic coupon functionality into a complete marketing and promotions platform with campaign management, targeting, A/B testing, and promotional calendar.

---

## Current State

### Existing Infrastructure
- ✅ Coupon model in Prisma schema (PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING)
- ✅ Basic CRUD API endpoints (`/api/admin/coupons`)
- ✅ Coupon validation endpoint (`/api/coupons/validate`)

### Missing Components
- ❌ Admin UI for coupon management
- ❌ Campaign builder with customer targeting
- ❌ A/B testing framework
- ❌ Discount rules engine
- ❌ Promotional calendar
- ❌ Email campaign integration
- ❌ Bulk operations
- ❌ Performance analytics

---

## Implementation Roadmap

### 6.1: Enhanced Coupon Management
**Goal**: Build complete admin UI for coupon CRUD with advanced features

**Features**:
- Coupon dashboard (list, search, filter)
- Create/edit coupon form with validation
- Bulk operations (activate, deactivate, delete, extend dates)
- Usage analytics per coupon
- Duplicate coupon functionality
- Import/export coupons (CSV)

**Files to Create**:
- `app/admin/coupons/page.tsx` - Coupon dashboard
- `app/admin/coupons/[id]/page.tsx` - Edit coupon page
- `app/admin/coupons/new/page.tsx` - Create coupon page
- `components/coupon-form.tsx` - Reusable coupon form
- `lib/coupons.ts` - Coupon helper functions

**API Enhancements**:
- Add filtering to GET `/api/admin/coupons` (by type, active, date range)
- Add bulk operations endpoint POST `/api/admin/coupons/bulk`
- Add analytics endpoint GET `/api/admin/coupons/[id]/analytics`

---

### 6.2: Campaign Builder
**Goal**: Create marketing campaigns with customer targeting

**Features**:
- Campaign CRUD (name, description, dates, budget)
- Customer targeting (by segment, LTV, RFM score, purchase history)
- Multi-coupon campaigns (assign multiple coupons to one campaign)
- Campaign performance tracking (redemptions, revenue, ROI)
- Campaign templates (seasonal, product launch, win-back, etc.)

**Database Schema Updates**:
```prisma
model Campaign {
  id          String   @id @default(cuid())
  name        String
  description String?
  type        CampaignType
  startDate   DateTime
  endDate     DateTime
  budget      Float?
  status      CampaignStatus @default(DRAFT)
  
  // Targeting
  targetSegments String[] // RFM segments
  minLTV         Float?
  maxLTV         Float?
  
  // Performance
  impressions    Int @default(0)
  clicks         Int @default(0)
  conversions    Int @default(0)
  revenue        Float @default(0)
  
  coupons     CampaignCoupon[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("campaigns")
}

model CampaignCoupon {
  id         String   @id @default(cuid())
  campaignId String
  couponId   String
  campaign   Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  coupon     Coupon   @relation(fields: [couponId], references: [id], onDelete: Cascade)
  
  @@unique([campaignId, couponId])
  @@map("campaign_coupons")
}

enum CampaignType {
  SEASONAL
  PRODUCT_LAUNCH
  WIN_BACK
  LOYALTY
  ACQUISITION
  RETENTION
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  ACTIVE
  PAUSED
  COMPLETED
  CANCELLED
}
```

**Files to Create**:
- `app/admin/campaigns/page.tsx` - Campaign dashboard
- `app/admin/campaigns/new/page.tsx` - Campaign builder
- `app/admin/campaigns/[id]/page.tsx` - Campaign detail/edit
- `app/api/admin/campaigns/route.ts` - Campaign CRUD
- `app/api/admin/campaigns/[id]/route.ts` - Single campaign ops
- `lib/campaigns.ts` - Campaign helper functions

---

### 6.3: Discount Rules Engine
**Goal**: Advanced discount logic beyond simple coupons

**Features**:
- Stacking rules (can coupons be combined?)
- Product-specific discounts (by category, tag, SKU)
- Tiered discounts (spend $100 get 10%, $200 get 15%)
- Buy X Get Y free
- Volume discounts (buy 3+ items, get 20% off)
- Time-based discounts (happy hour, flash sales)
- Cart-level vs product-level discounts
- Priority ordering (which discount applies first)

**Database Schema Updates**:
```prisma
model DiscountRule {
  id          String   @id @default(cuid())
  name        String
  description String?
  type        DiscountRuleType
  priority    Int      @default(0) // Higher = applied first
  
  // Conditions
  conditions  Json     // { minQuantity, categories, products, customerSegments }
  
  // Actions
  discountType   DiscountType
  discountValue  Float
  maxDiscount    Float?
  
  // Constraints
  canStack       Boolean @default(false)
  excludeProducts String[] // Product IDs to exclude
  
  isActive    Boolean  @default(true)
  validFrom   DateTime
  validUntil  DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([isActive, validFrom, validUntil])
  @@map("discount_rules")
}

enum DiscountRuleType {
  CART_TOTAL
  PRODUCT_SPECIFIC
  CATEGORY_SPECIFIC
  TIERED
  BUY_X_GET_Y
  VOLUME
  TIME_BASED
}

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_SHIPPING
  FREE_PRODUCT
}
```

**Files to Create**:
- `app/admin/discount-rules/page.tsx` - Rules dashboard
- `app/admin/discount-rules/new/page.tsx` - Rule builder
- `app/api/admin/discount-rules/route.ts` - Rules CRUD
- `lib/discount-engine.ts` - Discount calculation logic

---

### 6.4: A/B Testing Framework
**Goal**: Test different promotional strategies

**Features**:
- Create A/B test experiments (2+ variants)
- Random variant assignment to customers
- Track conversion rates per variant
- Statistical significance calculation
- Automatic winner selection
- Test coupon codes, discount amounts, messaging

**Database Schema Updates**:
```prisma
model ABTest {
  id          String   @id @default(cuid())
  name        String
  description String?
  type        ABTestType
  status      ABTestStatus @default(DRAFT)
  
  startDate   DateTime
  endDate     DateTime
  
  // Results
  totalParticipants Int @default(0)
  winningVariant    String?
  
  variants    ABTestVariant[]
  assignments ABTestAssignment[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("ab_tests")
}

model ABTestVariant {
  id          String   @id @default(cuid())
  testId      String
  name        String   // "Control", "Variant A", etc.
  description String?
  
  // Configuration
  config      Json     // { couponCode, discountAmount, etc. }
  
  // Metrics
  participants Int @default(0)
  conversions  Int @default(0)
  revenue      Float @default(0)
  
  test        ABTest   @relation(fields: [testId], references: [id], onDelete: Cascade)
  
  @@map("ab_test_variants")
}

model ABTestAssignment {
  id         String   @id @default(cuid())
  testId     String
  customerId String
  variantId  String
  assignedAt DateTime @default(now())
  converted  Boolean  @default(false)
  
  test       ABTest   @relation(fields: [testId], references: [id], onDelete: Cascade)
  
  @@unique([testId, customerId])
  @@index([customerId])
  @@map("ab_test_assignments")
}

enum ABTestType {
  COUPON_CODE
  DISCOUNT_AMOUNT
  MESSAGING
  TIMING
}

enum ABTestStatus {
  DRAFT
  RUNNING
  PAUSED
  COMPLETED
  CANCELLED
}
```

**Files to Create**:
- `app/admin/ab-tests/page.tsx` - A/B test dashboard
- `app/admin/ab-tests/new/page.tsx` - Create test
- `app/admin/ab-tests/[id]/page.tsx` - Test results
- `app/api/admin/ab-tests/route.ts` - Test CRUD
- `lib/ab-testing.ts` - A/B test logic

---

### 6.5: Promotional Calendar
**Goal**: Visual calendar for scheduling and managing promotions

**Features**:
- Month/week/day views
- Drag-and-drop scheduling
- Color-coded by campaign type
- Conflict detection (overlapping campaigns)
- Quick create from calendar
- Filter by campaign status, type
- Export calendar (iCal, CSV)

**Files to Create**:
- `app/admin/calendar/page.tsx` - Promotional calendar
- `components/promotional-calendar.tsx` - Calendar component
- `lib/calendar-utils.ts` - Calendar helpers

---

### 6.6: Email Campaign Integration
**Goal**: Send promotional emails to targeted customers

**Features**:
- Email template builder
- Customer list targeting (from campaigns)
- Schedule email sends
- Track open rates, click rates
- Preview emails before sending
- A/B test email subject lines

**Database Schema Updates**:
```prisma
model EmailCampaign {
  id          String   @id @default(cuid())
  campaignId  String?
  name        String
  subject     String
  content     String   @db.Text
  
  // Targeting
  targetCustomers String[] // Customer IDs
  
  // Scheduling
  scheduledAt DateTime?
  sentAt      DateTime?
  
  // Metrics
  sent        Int @default(0)
  opened      Int @default(0)
  clicked     Int @default(0)
  converted   Int @default(0)
  
  campaign    Campaign? @relation(fields: [campaignId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("email_campaigns")
}
```

**Files to Create**:
- `app/admin/email-campaigns/page.tsx` - Email dashboard
- `app/admin/email-campaigns/new/page.tsx` - Email builder
- `app/api/admin/email-campaigns/route.ts` - Email CRUD
- `lib/email.ts` - Email sending logic

---

## Testing Strategy

### Unit Tests
- Coupon validation logic
- Discount calculation engine
- A/B test assignment logic
- Campaign targeting filters
- Email template rendering

### Integration Tests
- Campaign CRUD operations
- Coupon bulk operations
- Discount rule application
- A/B test variant assignment
- Email sending workflow

### E2E Tests
- Complete campaign creation flow
- Coupon redemption flow
- A/B test setup and monitoring
- Promotional calendar interactions
- Email campaign scheduling

**Target**: 50+ comprehensive tests

---

## Implementation Timeline

| Week | Focus Areas | Deliverables |
|------|-------------|--------------|
| **Week 1** | 6.1, 6.2 | Coupon UI, Campaign builder |
| **Week 2** | 6.3, 6.4 | Discount rules, A/B testing |
| **Week 3** | 6.5, 6.6 | Calendar, Email campaigns |
| **Week 4** | Testing, Polish | All tests passing, documentation |

---

## Success Metrics

- [ ] Complete coupon management UI
- [ ] Campaign builder with targeting
- [ ] Discount rules engine functional
- [ ] A/B testing framework operational
- [ ] Promotional calendar interactive
- [ ] Email campaign integration working
- [ ] 50+ tests passing
- [ ] Full documentation
- [ ] 0 TypeScript errors

---

## Dependencies

**External Services** (Optional):
- Email provider (SendGrid, Mailgun, or AWS SES)
- Analytics service (for campaign tracking)

**Internal Dependencies**:
- Phase 5 analytics (for customer segmentation)
- Customer data (for targeting)
- Order data (for conversion tracking)

---

## Next Steps

1. ✅ Create Phase 6 plan
2. Start with 6.1: Enhanced Coupon Management
3. Build campaign builder (6.2)
4. Implement discount rules (6.3)
5. Add A/B testing (6.4)
6. Create promotional calendar (6.5)
7. Integrate email campaigns (6.6)

---

**Ready to start implementation!** 🚀
