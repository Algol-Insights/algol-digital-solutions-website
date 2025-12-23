-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "leadTime" INTEGER NOT NULL,
    "minOrderQuantity" INTEGER NOT NULL,
    "costPerUnit" DOUBLE PRECISION NOT NULL,
    "maxOrderQuantity" INTEGER,
    "preferredCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_suppliers" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "supplierSku" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "leadTime" INTEGER,
    "preferred" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_velocities" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "dailyVelocity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weeklyVelocity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyVelocity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "varianceDailyDemand" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_velocities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_recommendations" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "recommendedStock" INTEGER NOT NULL,
    "minStock" INTEGER NOT NULL,
    "maxStock" INTEGER NOT NULL,
    "safetyStock" INTEGER NOT NULL,
    "reorderPoint" INTEGER NOT NULL,
    "forecastedVelocity" DOUBLE PRECISION NOT NULL,
    "leadTimeVariance" INTEGER,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.95,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appliedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reorder_tasks" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reorderPoint" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "orderedAt" TIMESTAMP(3),
    "expectedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reorder_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dead_stock_alerts" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "daysWithoutSale" INTEGER NOT NULL,
    "lastSaleDate" TIMESTAMP(3),
    "currentStock" INTEGER NOT NULL,
    "estimatedValue" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "action" TEXT,
    "actionAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dead_stock_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "suppliers_active_idx" ON "suppliers"("active");

-- CreateIndex
CREATE INDEX "suppliers_name_idx" ON "suppliers"("name");

-- CreateIndex
CREATE INDEX "product_suppliers_productId_idx" ON "product_suppliers"("productId");

-- CreateIndex
CREATE INDEX "product_suppliers_supplierId_idx" ON "product_suppliers"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "product_suppliers_productId_supplierId_key" ON "product_suppliers"("productId", "supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_velocities_productId_key" ON "sales_velocities"("productId");

-- CreateIndex
CREATE INDEX "sales_velocities_productId_idx" ON "sales_velocities"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_recommendations_productId_key" ON "stock_recommendations"("productId");

-- CreateIndex
CREATE INDEX "stock_recommendations_productId_idx" ON "stock_recommendations"("productId");

-- CreateIndex
CREATE INDEX "stock_recommendations_appliedAt_idx" ON "stock_recommendations"("appliedAt");

-- CreateIndex
CREATE INDEX "reorder_tasks_productId_idx" ON "reorder_tasks"("productId");

-- CreateIndex
CREATE INDEX "reorder_tasks_status_idx" ON "reorder_tasks"("status");

-- CreateIndex
CREATE INDEX "reorder_tasks_createdAt_idx" ON "reorder_tasks"("createdAt");

-- CreateIndex
CREATE INDEX "reorder_tasks_supplierId_idx" ON "reorder_tasks"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "dead_stock_alerts_productId_key" ON "dead_stock_alerts"("productId");

-- CreateIndex
CREATE INDEX "dead_stock_alerts_status_idx" ON "dead_stock_alerts"("status");

-- CreateIndex
CREATE INDEX "dead_stock_alerts_productId_idx" ON "dead_stock_alerts"("productId");

-- CreateIndex
CREATE INDEX "dead_stock_alerts_createdAt_idx" ON "dead_stock_alerts"("createdAt");

-- AddForeignKey
ALTER TABLE "product_suppliers" ADD CONSTRAINT "product_suppliers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_suppliers" ADD CONSTRAINT "product_suppliers_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_velocities" ADD CONSTRAINT "sales_velocities_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_recommendations" ADD CONSTRAINT "stock_recommendations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reorder_tasks" ADD CONSTRAINT "reorder_tasks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reorder_tasks" ADD CONSTRAINT "reorder_tasks_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dead_stock_alerts" ADD CONSTRAINT "dead_stock_alerts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
