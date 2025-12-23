#!/bin/bash

# Fix all route files with old params signature
find app/api -name "route.ts" -type f | while read file; do
  # Replace { params }: { params: { ... } } with { params }: { params: Promise<{ ... }> }
  sed -i 's/{ params }: { params: {/{ params }: { params: Promise<{/g' "$file"
  
  # Fix closing brace - add closing > before } }
  sed -i 's/} } )/} }> )/g' "$file"
  sed -i 's/} })/} }> )/g' "$file"
  
  # Add awaiting params at the start of functions that have params
  sed -i '/const { params }/! s/try {/try {\n    const { id, slug, email, customerId } = await params/g' "$file" 2>/dev/null || true
done

echo "Fixed params signatures"
