/// <reference types="cypress" />

// High-level smoke test that walks through the key user flows added in this sprint.
// Uses the UI just like a real user; API & Supabase requests are intercepted/mocked
// to keep the test deterministic and fast.

describe('Full InsightFlow user journey', () => {
  beforeEach(() => {
    // intercept Supabase auth for login shortcut
    cy.intercept('POST', '**/auth/v1/token', { fixture: 'auth_success.json' }).as('login');
    // intercept initial market correlations query
    cy.intercept('GET', '**/rest/v1/market_correlations*', { fixture: 'market_correlations.json' });
  });

  it('logs in, generates PineScript, toggles dev-mode & sees status panel', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('demo@user.com');
    cy.get('input[name="password"]').type('password{enter}');
    cy.wait('@login');

    // Navigate to PineScript generator page
    cy.visit('/pine-script-generator');
    cy.contains('Pine Script AI Generator');

    // Fill prompt & generate
    cy.get('textarea').first().type('Create simple EMA crossover strategy');
    cy.contains('Generate Pine Script').click();

    // Loading spinner then code tab becomes active
    cy.contains('Generated Pine Script', { timeout: 20000 });

    // Copy & open buttons present
    cy.contains('Copy');
    cy.contains('Open in TradingView');

    // Dev-mode toggle
    cy.contains('Dev-Mode: OFF').click();
    cy.contains('Dev-Mode: ON');

    // System Status panel should now be visible
    cy.contains('System Status');
  });
}); 