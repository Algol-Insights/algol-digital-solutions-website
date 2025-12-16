import { test, expect } from './fixtures'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Algol Digital Solutions/)
  })

  test('should display hero banner', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('[data-testid="hero-banner"]').first()
    await expect(hero).toBeVisible()
  })

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Products')
    await expect(page).toHaveURL(/\/products/)
  })
})

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.locator('text=Sign In')).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth/login')
    await page.click('button[type="submit"]')
    // Add assertions for validation errors
  })
})

test.describe('Product Search', () => {
  test('should search for products', async ({ page }) => {
    await page.goto('/products')
    await page.fill('[placeholder*="Search"]', 'laptop')
    await page.keyboard.press('Enter')
    await expect(page.locator('.product-card').first()).toBeVisible()
  })
})

test.describe('Shopping Cart', () => {
  test('should add product to cart', async ({ page }) => {
    await page.goto('/products')
    await page.click('.product-card').first()
    await page.click('text=Add to Cart')
    await expect(page.locator('text=Added to cart')).toBeVisible()
  })
})
