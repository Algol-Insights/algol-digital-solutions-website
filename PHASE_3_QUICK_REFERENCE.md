# Phase 3 Quick Reference Guide

## What's New

### 1. Order Detail Page (`/admin/orders/[id]`)
**Features:**
- Complete order information with customer details
- Visual timeline showing order progress
- Status update controls
- Order items with product details
- Shipping address display
- Payment information

**How to Use:**
1. Go to Orders Dashboard (`/admin/orders`)
2. Click the eye icon next to any order
3. View timeline, update status, or modify details

### 2. Order Export (`/admin/orders`)
**Formats Supported:**
- CSV (Excel compatible)
- JSON (for integrations)

**How to Use:**
1. Go to Orders Dashboard
2. Set filters (optional: status, date range, search)
3. Click "CSV" or "JSON" button
4. File automatically downloads

**What's Exported:**
- Order number, customer info, status
- Payment details, amounts
- Order dates, delivery dates
- Item count

### 3. Search History
**Features:**
- Automatically tracks recent searches
- Max 10 searches stored locally
- Quick access to previous searches

**How to Use:**
1. Click in the search box
2. Dropdown shows last 10 searches
3. Click a search to reuse it

### 4. Bulk Operations
**Supported Actions:**
- Mark as Processing
- Mark as Shipped
- Mark as Delivered
- Cancel Orders

**How to Use:**
1. Check checkboxes next to orders
2. Select bulk action from dropdown
3. Updates applied immediately

## API Endpoints

### List Orders
```bash
GET /api/admin/orders?page=1&limit=20&status=SHIPPED&search=john&startDate=2024-01-01&endDate=2024-01-31
```
**Query Params:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `status` - Filter by status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- `search` - Search by order#, customer name, or email
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

**Response:**
```json
{
  "orders": [...],
  "summary": {
    "totalOrders": 100,
    "totalRevenue": 50000,
    "pending": 10,
    "processing": 5,
    "shipped": 20,
    "delivered": 60,
    "cancelled": 5
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Get Order Detail
```bash
GET /api/admin/orders/[orderId]
```

### Update Order
```bash
PUT /api/admin/orders/[orderId]
Content-Type: application/json

{
  "status": "SHIPPED",
  "paymentStatus": "PAID",
  "estimatedDelivery": "2024-01-20"
}
```

### Bulk Update
```bash
POST /api/admin/orders/bulk
Content-Type: application/json

{
  "ids": ["order-1", "order-2", "order-3"],
  "status": "SHIPPED"
}
```

### Export Orders
```bash
GET /api/admin/orders/export?format=csv&status=DELIVERED&startDate=2024-01-01

# Returns CSV file for download
# Also supports: ?format=json
```

## Database Model

```prisma
model Order {
  id                String
  orderNumber       String        @unique
  customerId        String?
  status            OrderStatus   // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  paymentStatus     PaymentStatus // PENDING, PAID, FAILED, REFUNDED
  subtotal          Float
  tax               Float
  shipping          Float
  total             Float
  shippingAddress   String?       // JSON
  estimatedDelivery DateTime?
  deliveredAt       DateTime?
  createdAt         DateTime
  updatedAt         DateTime
  orderItems        OrderItem[]
  customer          Customer?
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

## Status Workflow

```
PENDING ──→ PROCESSING ──→ SHIPPED ──→ DELIVERED
   ↓            ↓             ↓
   ├──→ CANCELLED (any state)
   ├──→ PROCESSING (from PENDING)
   └──→ SHIPPED (from PROCESSING)
```

## Testing

Run order tests:
```bash
npm run test -- orders.test.ts
```

**Test Coverage:**
- List API with all filters
- Detail API with updates
- Bulk operations
- Permission checks
- Data validation
- Status workflows
- Error handling

## Features by Phase

### Phase 2 (Completed) ✅
- Product inventory management
- Low-stock surfacing
- Stock alerts

### Phase 3 (Completed) ✅
- **Order Management Dashboard** - List, filter, sort orders
- **Order Detail Page** - View complete order with timeline
- **Bulk Operations** - Update multiple orders at once
- **CSV/JSON Export** - Download order data
- **Search History** - Quick access to previous searches
- **Comprehensive Tests** - 30+ test cases

### Phase 4 (Upcoming)
- Order notifications
- Return/refund management
- Fulfillment automation

## Common Tasks

### Find Orders by Customer
1. Use search box: type customer name or email
2. Orders matching customer appear immediately

### Export Monthly Report
1. Set start date to 1st of month
2. Set end date to last day of month
3. Click "CSV" to download

### Track Order Status
1. Open order detail page
2. View timeline showing all status changes
3. See estimated delivery date

### Bulk Update Status
1. Filter orders (e.g., all "PROCESSING")
2. Select checkboxes for desired orders
3. Choose bulk action (e.g., "Mark as Shipped")
4. Confirm - updates applied immediately

### Monitor Order Metrics
1. Dashboard shows real-time metrics:
   - Total orders
   - Total revenue
   - Processing count
   - Delivered count

## Troubleshooting

**Orders not showing?**
- Check filter status (ensure "All Status" selected)
- Try clearing search box
- Verify date range

**Export file empty?**
- Ensure orders match current filters
- Check date range is correct

**Search history not working?**
- Searches are stored in browser localStorage
- Clearing browser data will reset history
- History is per-browser (not synced)

**Status update failing?**
- Verify you have admin role
- Check network connection
- Try page refresh

## Performance Tips

- Use filters to narrow results (improves load time)
- Set date range to reduce data volume
- Export data periodically instead of loading all orders
- Search history keeps you efficient

## Security Notes

- Admin role required for all operations
- Search history stored locally (not on server)
- All API endpoints require authentication
- Status values are validated (whitelist)
- Orders are filtered by user permissions

---

**Questions?** Check the main documentation or review Phase 3 completion guide.
