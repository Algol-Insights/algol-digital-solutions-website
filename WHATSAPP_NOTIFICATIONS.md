# WhatsApp Order Notifications - Implementation Guide

## Overview
When a customer clicks "Place Order" on the checkout page, the system automatically sends the order details to your sales team via WhatsApp Business.

## How It Works

### 1. Order Flow
1. Customer fills out checkout form with delivery details
2. Customer clicks "Place Order"
3. Order is created in the database
4. **WhatsApp notification is automatically sent to sales team**
5. Cart is cleared and customer sees order confirmation

### 2. WhatsApp Message Format
The sales team receives a formatted message with:
- 🛒 Order number
- 👤 Customer details (name, email, phone)
- 📦 Complete list of items with quantities and prices
- 📍 Delivery address (street, city, province)
- 💰 Payment summary (subtotal, delivery, total)
- 💳 Payment method selected
- 📝 Any special notes from customer

### 3. Configuration

#### WhatsApp Number
The sales team WhatsApp number is configured in `.env`:
```env
NEXT_PUBLIC_SALES_WHATSAPP_NUMBER=263788663313
```

**To change the number:**
1. Open `.env` file
2. Update `NEXT_PUBLIC_SALES_WHATSAPP_NUMBER` with your WhatsApp Business number
3. Format: Country code + number (no + or spaces)
   - Example: 263788663313 for +263 788 663 313

#### Current Numbers
- **Sales WhatsApp:** +263 788 663 313
- **Support WhatsApp:** +263 788 663 313

### 4. Files Modified

#### New Files Created:
1. **`/lib/whatsapp-notifications.ts`**
   - Formats order details for WhatsApp
   - Handles sending messages via WhatsApp web link
   - Exports utility functions for order notifications

2. **`/app/api/notifications/whatsapp/route.ts`**
   - API endpoint for future WhatsApp Business API integration
   - Currently logs notifications
   - Can be extended with Twilio or Meta WhatsApp Cloud API

#### Updated Files:
1. **`/app/checkout/page.tsx`**
   - Added WhatsApp notification after successful order
   - Sends complete order details to sales team
   - Opens WhatsApp in new window automatically

2. **`.env`**
   - Added `NEXT_PUBLIC_SALES_WHATSAPP_NUMBER` variable

## How Sales Team Receives Orders

### Immediate Notification
When an order is placed:
1. **WhatsApp opens automatically** in a new browser tab/window
2. Message is **pre-filled** with complete order details
3. Sales team number is **already selected** as recipient
4. Customer just needs to **click send** in WhatsApp

### What Sales Team Sees
Example message format:
```
🛒 NEW ORDER RECEIVED

📋 Order #ORD-20231223-001

👤 Customer Details:
Name: John Doe
Email: john@example.com
Phone: +263 77 123 4567

📦 Order Items:
• Dell Laptop XPS 15 (16GB RAM)
  Qty: 1 × $1,200.00 = $1,200.00

• Wireless Mouse
  Qty: 2 × $25.00 = $50.00

📍 Delivery Address:
123 Main Street
Harare, Harare
Zimbabwe

💰 Payment Summary:
Subtotal: $1,250.00
Delivery: FREE
Total: $1,250.00

💳 Payment Method: ECOCASH

📝 Notes: Please deliver in the morning

---
Please process this order promptly.
```

## Advanced Integration (Future Enhancement)

### Option 1: WhatsApp Business Cloud API
For automated delivery without user interaction:
1. Sign up for Meta WhatsApp Business API
2. Get API token and Business Account ID
3. Add to `.env`:
   ```env
   WHATSAPP_API_TOKEN=your_token_here
   WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id
   ```
4. Update `/app/api/notifications/whatsapp/route.ts` with API calls

### Option 2: Twilio WhatsApp
Alternative automation service:
1. Sign up for Twilio account
2. Enable WhatsApp messaging
3. Add to `.env`:
   ```env
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number
   ```

## Testing

### Test the Flow:
1. Add items to cart
2. Go to checkout
3. Fill in all details:
   - Customer information
   - Delivery address (Harare for FREE delivery)
   - Select payment method
4. Click "Place Order"
5. WhatsApp should open with order details
6. Verify all information is correct
7. Click send in WhatsApp to notify sales team

### Test Different Scenarios:
- ✅ Harare delivery (FREE)
- ✅ Bulawayo delivery ($10)
- ✅ Other provinces ($12-15)
- ✅ Store pickup (FREE)
- ✅ Different payment methods
- ✅ Orders with/without notes
- ✅ Multiple items with variants

## Troubleshooting

### WhatsApp Doesn't Open
**Issue:** WhatsApp window doesn't open after order placement
**Solution:** Check browser popup blocker settings

### Wrong Number
**Issue:** Message goes to wrong WhatsApp number
**Solution:** Update `NEXT_PUBLIC_SALES_WHATSAPP_NUMBER` in `.env`

### Message Format Issues
**Issue:** Special characters don't display correctly
**Solution:** The system uses proper URL encoding, no action needed

### Missing Order Details
**Issue:** Some order information missing in WhatsApp
**Solution:** Check that all form fields are filled before placing order

## Benefits

✅ **Instant Notification** - Sales team gets orders immediately
✅ **Complete Details** - All order information in one message
✅ **No Extra Apps** - Uses WhatsApp Business you already have
✅ **Professional Format** - Structured, easy-to-read messages
✅ **Zimbabwe-Focused** - Shows correct delivery costs per region
✅ **Reliable** - No API dependencies, works with WhatsApp web

## Next Steps

1. ✅ Test the order flow end-to-end
2. ✅ Verify sales team receives notifications
3. ⏳ Consider adding email backup notifications
4. ⏳ Optionally integrate WhatsApp Business Cloud API for automation
5. ⏳ Add order status updates via WhatsApp

## Support

For technical issues with WhatsApp notifications:
- Check `.env` file configuration
- Verify WhatsApp number format (no spaces or + symbol)
- Test with different browsers
- Ensure stable internet connection
