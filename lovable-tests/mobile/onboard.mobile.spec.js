import { mobileTest as test, expect } from '@lovable/test';
import { faker } from '@faker-js/faker';

// Expo mobile onboarding flow

test.describe('Mobile Onboarding Flow', () => {
  test('Fresh install shows onboarding and completes flow', async ({ device, supabase }) => {
    const email = faker.internet.email().toLowerCase();
    const password = 'Lovable123!';

    // Launch app
    await device.launchApp();

    // Tap sign up button
    await device.tap('Sign Up');

    // Fill credentials
    await device.typeText('Email', email);
    await device.typeText('Password', password);

    await device.tap('Create Account');

    // Ensure onboarding screen visible
    await expect(device.element('Onboarding')).toBeVisible();

    // Swipe through intro slides
    for (let i = 0; i < 3; i++) {
      await device.swipeLeft();
    }

    await device.tap('Get Started');

    // Dashboard should be visible
    await expect(device.element('Dashboard')).toBeVisible();

    // Supabase assertion
    await expect(supabase).toHaveInserted('profiles', { email });
  });
}); 