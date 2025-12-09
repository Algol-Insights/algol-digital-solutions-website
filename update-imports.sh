#!/bin/bash

# Update @algol/ui imports to local path
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's|from "@algol/ui"|from "@/components/ui-lib"|g'
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | xargs sed -i "s|from '@algol/ui'|from '@/components/ui-lib'|g"

# Update @algol/lib imports to local path
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's|from "@algol/lib"|from "@/lib/shared"|g'
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | xargs sed -i "s|from '@algol/lib'|from '@/lib/shared'|g"

echo "Import paths updated successfully!"
