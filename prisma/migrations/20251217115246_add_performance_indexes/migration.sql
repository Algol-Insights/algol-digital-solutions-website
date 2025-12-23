-- CreateIndex
CREATE INDEX "inventory_logs_productId_createdAt_idx" ON "inventory_logs"("productId", "createdAt");

-- CreateIndex
CREATE INDEX "inventory_logs_createdAt_idx" ON "inventory_logs"("createdAt");

-- CreateIndex
CREATE INDEX "orders_customerId_status_idx" ON "orders"("customerId", "status");

-- CreateIndex
CREATE INDEX "orders_status_createdAt_idx" ON "orders"("status", "createdAt");

-- CreateIndex
CREATE INDEX "products_categoryId_active_idx" ON "products"("categoryId", "active");

-- CreateIndex
CREATE INDEX "products_featured_active_idx" ON "products"("featured", "active");

-- CreateIndex
CREATE INDEX "products_price_active_idx" ON "products"("price", "active");

-- CreateIndex
CREATE INDEX "products_createdAt_idx" ON "products"("createdAt");
