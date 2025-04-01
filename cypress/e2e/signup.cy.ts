/// <reference types="cypress" />

describe('Signup Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('signs up a user successfully and fetches tasks', () => {
    // Intercept GET /tasks after successful signup
    cy.intercept('GET', '**/tasks', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Mock Task A' },
        { id: 2, title: 'Mock Task B' }
      ]
    }).as('getTasks');

    // Intercept POST /users to mock successful signup
    cy.intercept('POST', '**/users', {
      statusCode: 201,
      body: {
        data: {
          attributes: {
            email: 'new@example.com',
            username: 'newuser',
            token: 'mock-signup-token'
          }
        }
      }
    }).as('signupRequest');

    // Step 1: Click the main CTA Sign Up button
    cy.contains('button', 'Sign Up').click();

    // Step 2: Confirm the modal is mounted
    cy.get('[data-testid="signup-modal"]').should('exist');

    // Step 3: Fill out and submit the form within the modal
    cy.get('[data-testid="signup-modal"]').within(() => {
      cy.get('input[placeholder="Username"]').type('newuser');
      cy.get('input[placeholder="Email"]').type('new@example.com');
      cy.get('input[placeholder="Password"]').type('securePassword');
      cy.contains('button', 'Sign Up').click({ force: true });
    });

    // Step 4: Wait for the signup request to complete
    cy.wait('@signupRequest');

    // Step 5: Assert user is stored in localStorage
    cy.window().then((win) => {
      const user = JSON.parse(win.localStorage.getItem('user') || '{}');
      expect(user.username).to.eq('newuser');
      expect(user.token).to.eq('mock-signup-token');
    });

    // Step 6: Wait for the tasks request to simulate redirect
    cy.wait('@getTasks');

    // Step 7: Confirm the modal has closed
    cy.get('[data-testid="signup-modal"]').should('not.exist');

    // Step 8: Confirm we're on the tasks page
    cy.url().should('include', '/tasks');
  });
});
