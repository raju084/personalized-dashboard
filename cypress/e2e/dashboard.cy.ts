describe('Personalized Content Dashboard E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the header and main personalized feed title', () => {
    cy.contains('Pulse').should('be.visible');
    cy.contains('Personalized Feed').should('be.visible');
  });

  it('performs debounced search filtering correctly', () => {
    cy.get('#dashboard-search-input')
      .type('Quantum')
      .should('have.value', 'Quantum');

    // Wait for debounced fetch
    cy.wait(400);
    cy.contains('Quantum Leap').should('be.visible');
  });

  it('toggles favorites when bookmarking content cards', () => {
    cy.get('button[title="Favorite"]').first().click();
    cy.contains('Favorites').click();
    cy.url().should('include', '/favorites');
    cy.contains('Favorites Collection').should('be.visible');
  });

  it('opens and closes settings modal', () => {
    cy.get('button[title="Settings"]').first().click();
    cy.contains('Content Category Preferences').should('be.visible');
    cy.contains('Save Preferences').click();
  });
});
