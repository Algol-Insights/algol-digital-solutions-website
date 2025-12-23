-- CreateEnum
CREATE TYPE "ABTestStatus" AS ENUM ('DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ABTestVariant" AS ENUM ('CONTROL', 'VARIANT_A', 'VARIANT_B', 'VARIANT_C');

-- CreateTable
CREATE TABLE "ab_tests" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ABTestStatus" NOT NULL DEFAULT 'DRAFT',
    "testingMetric" TEXT NOT NULL,
    "hypothesis" TEXT,
    "controlName" TEXT NOT NULL DEFAULT 'Control',
    "controlCouponId" TEXT,
    "variantAName" TEXT NOT NULL DEFAULT 'Variant A',
    "variantACouponId" TEXT,
    "variantBName" TEXT NOT NULL DEFAULT 'Variant B',
    "variantBCouponId" TEXT,
    "variantCName" TEXT NOT NULL DEFAULT 'Variant C',
    "variantCCouponId" TEXT,
    "controlTraffic" INTEGER NOT NULL DEFAULT 25,
    "variantATraffic" INTEGER NOT NULL DEFAULT 25,
    "variantBTraffic" INTEGER NOT NULL DEFAULT 25,
    "variantCTraffic" INTEGER NOT NULL DEFAULT 25,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "winnerVariant" TEXT,
    "controlOpens" INTEGER NOT NULL DEFAULT 0,
    "variantAOpens" INTEGER NOT NULL DEFAULT 0,
    "variantBOpens" INTEGER NOT NULL DEFAULT 0,
    "variantCOpens" INTEGER NOT NULL DEFAULT 0,
    "controlClicks" INTEGER NOT NULL DEFAULT 0,
    "variantAClicks" INTEGER NOT NULL DEFAULT 0,
    "variantBClicks" INTEGER NOT NULL DEFAULT 0,
    "variantCClicks" INTEGER NOT NULL DEFAULT 0,
    "controlConversions" INTEGER NOT NULL DEFAULT 0,
    "variantAConversions" INTEGER NOT NULL DEFAULT 0,
    "variantBConversions" INTEGER NOT NULL DEFAULT 0,
    "variantCConversions" INTEGER NOT NULL DEFAULT 0,
    "confidenceLevel" DOUBLE PRECISION NOT NULL DEFAULT 0.95,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ab_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ab_test_emails" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "variant" "ABTestVariant" NOT NULL,
    "opened" BOOLEAN NOT NULL DEFAULT false,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ab_test_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotional_calendar" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT 'blue',
    "reminderDays" INTEGER NOT NULL DEFAULT 0,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotional_calendar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ab_tests_campaignId_idx" ON "ab_tests"("campaignId");

-- CreateIndex
CREATE INDEX "ab_tests_status_idx" ON "ab_tests"("status");

-- CreateIndex
CREATE INDEX "ab_tests_startDate_idx" ON "ab_tests"("startDate");

-- CreateIndex
CREATE INDEX "ab_test_emails_testId_idx" ON "ab_test_emails"("testId");

-- CreateIndex
CREATE INDEX "ab_test_emails_email_idx" ON "ab_test_emails"("email");

-- CreateIndex
CREATE INDEX "ab_test_emails_variant_idx" ON "ab_test_emails"("variant");

-- CreateIndex
CREATE INDEX "promotional_calendar_campaignId_idx" ON "promotional_calendar"("campaignId");

-- CreateIndex
CREATE INDEX "promotional_calendar_date_idx" ON "promotional_calendar"("date");

-- CreateIndex
CREATE INDEX "promotional_calendar_eventType_idx" ON "promotional_calendar"("eventType");

-- AddForeignKey
ALTER TABLE "ab_tests" ADD CONSTRAINT "ab_tests_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ab_tests" ADD CONSTRAINT "ab_tests_controlCouponId_fkey" FOREIGN KEY ("controlCouponId") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ab_tests" ADD CONSTRAINT "ab_tests_variantACouponId_fkey" FOREIGN KEY ("variantACouponId") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ab_tests" ADD CONSTRAINT "ab_tests_variantBCouponId_fkey" FOREIGN KEY ("variantBCouponId") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ab_tests" ADD CONSTRAINT "ab_tests_variantCCouponId_fkey" FOREIGN KEY ("variantCCouponId") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ab_test_emails" ADD CONSTRAINT "ab_test_emails_testId_fkey" FOREIGN KEY ("testId") REFERENCES "ab_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotional_calendar" ADD CONSTRAINT "promotional_calendar_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
