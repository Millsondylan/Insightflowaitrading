import { test, expect } from '@lovable/test';

// Strategy generation + backtesting end-to-end

test.describe('AI Strategy Generation & Backtesting', () => {
  test('User can generate strategy for BTC/USDT and view results', async ({ page, supabase }) => {
    await page.loginAsDemoUser(); // custom helper configured in lovable presets

    // Navigate to Strategy Builder
    await page.click('nav >> text=Strategy');

    // Select market pair and timeframe
    await page.selectOption('select[name="pair"]', 'BTC/USDT');
    await page.selectOption('select[name="timeframe"]', '1h');

    // Trigger AI generation
    await page.click('button:has-text("Generate Strategy")');

    // Wait for AI completion indicator
    await page.waitForSelector('[data-testid="generation-done"]', { timeout: 60_000 });
    await expect(page.locator('[data-testid="strategy-card"]')).toContainText('BTC/USDT');

    // Trigger backtest
    await page.click('button:has-text("Backtest")');
    await page.waitForSelector('[data-testid="backtest-complete"]', { timeout: 120_000 });

    // Validate results visible
    await expect(page.locator('[data-testid="strategy-metrics"]')).toContainText('%');

    // Database assertions
    await expect(supabase).toHaveInserted('strategies', { pair: 'BTC/USDT' });
    await expect(supabase).toHaveInserted('backtests', { pair: 'BTC/USDT' });
  });
}); 