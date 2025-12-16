import { test as base } from '@playwright/test'

// Define custom fixtures if needed
export const test = base.extend({
  // Add custom fixtures here
})

export { expect } from '@playwright/test'
