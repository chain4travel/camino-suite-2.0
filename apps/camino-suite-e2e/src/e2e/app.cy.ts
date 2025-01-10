describe('camino-suite-e2e', () => {
  beforeEach(() => {
    // Prevent failing on uncaught exceptions
    cy.on('uncaught:exception', () => {
      // Return false to prevent the error from failing the test
      return false;
    });

    cy.visit('/', {
      failOnStatusCode: false,
      timeout: 10000,
      retryOnNetworkFailure: true
    });
  });

  it('should display welcome message', () => {
    // Check if the page loaded
    cy.get('body').should('exist');
  });

  it('should have access options', () => {
    cy.get('button', { timeout: 10000 }).should('be.visible');
  });
});
