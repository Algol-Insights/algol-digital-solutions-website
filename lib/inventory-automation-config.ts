/**
 * Inventory Automation Configuration
 * Constants and parameters for all automated inventory management
 */

export const INVENTORY_AUTOMATION = {
  // Dead Stock Detection
  DEAD_STOCK_DAYS: 90, // Days without sales to mark as dead stock
  
  // Safety Stock Calculation
  SAFETY_SERVICE_LEVEL: 0.95, // 95% service level
  Z_SCORE_95: 1.65, // Z-score for 95% service level
  
  // Reorder Cost & Holding Cost
  DEFAULT_REORDER_COST: 50, // $ per order
  DEFAULT_HOLDING_COST_PERCENT: 0.25, // 25% of unit cost per year
  
  // Forecasting
  MIN_FORECAST_PERIOD: 30, // Minimum days of history to make forecast
  FORECAST_LOOKBACK: 180, // Days of sales history to analyze
  EXPONENTIAL_SMOOTHING_ALPHA: 0.3, // Smoothing factor for forecasting
  
  // Minimum inventory history for reliable recommendations
  MIN_SALES_DATA_POINTS: 15, // Minimum data points needed
  
  // Confidence levels
  DEFAULT_CONFIDENCE: 0.95, // 95% confidence for recommendations
  
  // Job intervals
  VELOCITY_UPDATE_INTERVAL: 24 * 60 * 60 * 1000, // Daily
  REORDER_CHECK_INTERVAL: 60 * 60 * 1000, // Hourly
  DEAD_STOCK_CHECK_INTERVAL: 24 * 60 * 60 * 1000, // Daily
  RECOMMENDATION_REFRESH_INTERVAL: 24 * 60 * 60 * 1000, // Daily
  
  // Thresholds for alerts
  LOW_STOCK_THRESHOLD: 0.3, // 30% of max stock triggers low stock alert
  CRITICAL_STOCK_THRESHOLD: 0.1, // 10% triggers critical alert
  
  // EOQ calculation weights
  MAX_LOOKUP_MONTHS: 6, // Look back 6 months for average demand
  MIN_ORDER_VALUE: 100, // Minimum order value in dollars
  MAX_ORDER_VALUE: 10000, // Maximum order value in dollars
} as const;

export type InventoryAutomationConfig = typeof INVENTORY_AUTOMATION;

/**
 * Calculate Z-score for given service level
 */
export function getZScore(serviceLevel: number): number {
  const zScores: Record<number, number> = {
    0.9: 1.28,
    0.95: 1.65,
    0.97: 1.88,
    0.99: 2.33,
  };
  return zScores[serviceLevel] || zScores[0.95];
}

/**
 * Get safety stock formula components
 * SS = Z × σ × √L
 * Z = service level factor
 * σ = standard deviation of daily demand
 * L = lead time in days
 */
export function calculateSafetyStock(
  zScore: number,
  demandStdDev: number,
  leadTime: number
): number {
  return Math.ceil(zScore * demandStdDev * Math.sqrt(leadTime));
}

/**
 * Get reorder point
 * ROP = (D × L) + SS
 * D = average daily demand
 * L = lead time in days
 * SS = safety stock
 */
export function calculateReorderPoint(
  averageDailyDemand: number,
  leadTime: number,
  safetyStock: number
): number {
  return Math.ceil(averageDailyDemand * leadTime + safetyStock);
}

/**
 * Economic Order Quantity
 * EOQ = √(2 × D × S / H)
 * D = annual demand
 * S = cost per order
 * H = annual holding cost per unit
 */
export function calculateEOQ(
  annualDemand: number,
  orderCost: number,
  holdingCostPerUnit: number
): number {
  if (holdingCostPerUnit <= 0) return Math.ceil(annualDemand / 12); // Default to monthly
  return Math.ceil(Math.sqrt((2 * annualDemand * orderCost) / holdingCostPerUnit));
}

/**
 * Calculate min/max/safety stock levels
 */
export function calculateStockLevels(
  dailyDemand: number,
  demandStdDev: number,
  leadTime: number,
  leadTimeVariance?: number
): {
  minStock: number;
  maxStock: number;
  safetyStock: number;
  reorderPoint: number;
} {
  const zScore = getZScore(INVENTORY_AUTOMATION.SAFETY_SERVICE_LEVEL);
  const effectiveLeadTime = leadTime + (leadTimeVariance || 0);
  
  const safetyStock = calculateSafetyStock(zScore, demandStdDev, effectiveLeadTime);
  const reorderPoint = calculateReorderPoint(dailyDemand, leadTime, safetyStock);
  
  // Max stock = reorder point + EOQ
  const annualDemand = dailyDemand * 365;
  const eoq = calculateEOQ(annualDemand, INVENTORY_AUTOMATION.DEFAULT_REORDER_COST, INVENTORY_AUTOMATION.DEFAULT_HOLDING_COST_PERCENT);
  
  const maxStock = Math.ceil(reorderPoint + eoq);
  const minStock = Math.ceil(reorderPoint / 2);
  
  return { minStock, maxStock, safetyStock, reorderPoint };
}

/**
 * Forecast next demand using exponential smoothing
 * F(t+1) = α × D(t) + (1-α) × F(t)
 */
export function forecastDemand(
  actualDemand: number,
  previousForecast: number,
  alpha: number = INVENTORY_AUTOMATION.EXPONENTIAL_SMOOTHING_ALPHA
): number {
  return alpha * actualDemand + (1 - alpha) * previousForecast;
}

/**
 * Calculate standard deviation of daily demand
 */
export function calculateDemandStdDev(demands: number[]): number {
  if (demands.length === 0) return 0;
  const mean = demands.reduce((a, b) => a + b, 0) / demands.length;
  const variance = demands.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / demands.length;
  return Math.sqrt(variance);
}

/**
 * Estimate dead stock based on:
 * - Days without sales
 * - Current stock level
 * - Unit cost
 */
export function estimateDeadStockValue(
  quantity: number,
  unitCost: number,
  ageInDays: number
): { estimatedValue: number; depreciationRate: number } {
  // Apply linear depreciation: 10% per 30 days old
  const depreciationPeriods = Math.floor(ageInDays / 30);
  const depreciationRate = Math.min(depreciationPeriods * 0.1, 0.9); // Max 90% depreciation
  const currentValue = unitCost * quantity * (1 - depreciationRate);
  
  return {
    estimatedValue: Math.max(0, currentValue),
    depreciationRate,
  };
}
