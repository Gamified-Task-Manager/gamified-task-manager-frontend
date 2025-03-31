describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the homepage with heading and buttons', () => {
    cy.contains('Welcome to the App!').should('be.visible');
    cy.contains('Login').should('be.visible');
    cy.contains('Sign Up').should('be.visible');
  });

  it('opens the login modal when clicking Login', () => {
    cy.contains('button', 'Login').click({ force: true });
    cy.get('[data-testid="login-modal"]', { timeout: 6000 }).should('exist');
    cy.get('[data-testid="login-modal"]').contains('Log In').should('be.visible');
  });
  
  it('opens the signup modal when clicking Sign Up', () => {
    cy.contains('Sign Up').click();
    cy.get('[data-testid="signup-modal"]').should('be.visible');
  });
});
