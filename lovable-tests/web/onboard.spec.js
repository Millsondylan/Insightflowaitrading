import { test, expect } from '@lovable/test';
import { faker } from '@faker-js/faker';

// Web onboarding flow covering signup and initial user preferences

test.describe('Web Onboarding Flow', () => {
  test('New user can sign-up and finish onboarding', async ({ page, supabase }) => {
    const email = faker.internet.email().toLowerCase();
    const password = 'Lovable123!';

    // Visit homepage and start sign-up
    await page.goto('/');
    await page.click('text=Sign Up');

    // Fill sign-up form
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button:has-text("Create account")');

    // Wait for redirect to onboarding wizard
    await expect(page).toHaveURL(/onboarding/);

    // Progress through onboarding steps (simplified)
    for (let step = 0; step < 5; step++) {
      await page.click('button:has-text("Next")');
    }

    // Finish onboarding
    await page.click('button:has-text("Finish")');
    await expect(page).toHaveURL('/dashboard');

    // Supabase side-effect assertion
    await expect(supabase)
      .toHaveInserted('profiles', {
        email,
        onboarding_completed: true
      });
  });
}); 