#!/bin/bash
# Test script to record a sample sale

# First, we need to get the first product ID
PRODUCT_ID=$(curl -s http://localhost:3007/api/products | jq -r '.data[0].id')

echo "Using product ID: $PRODUCT_ID"

# Now record a test sale
# Note: This requires authentication, so it will likely fail without proper session
# But we'll show the structure

curl -s -X POST http://localhost:3007/api/admin/sales/record \
  -H "Content-Type: application/json" \
  -d "{
    \"items\": [
      {
        \"productId\": \"$PRODUCT_ID\",
        \"quantity\": 2,
        \"unitPrice\": 500
      }
    ],
    \"discount\": 50,
    \"discountType\": \"FIXED\",
    \"paymentMethod\": \"CASH\",
    \"notes\": \"Test sale from script\"
  }" | jq .
