/// <reference types="cypress" />

describe('Auth Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('logs in a user successfully and fetches tasks', () => {
    //Intercept the GET /tasks to prevent 401 error after redirect
    cy.intercept('GET', '**/tasks', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Mock Task 1' },
        { id: 2, title: 'Mock Task 2' }
      ]
    }).as('getTasks');

    // Intercept the POST /session login request
    cy.intercept('POST', '**/session', {
      statusCode: 200,
      body: {
        data: {
          attributes: {
            email: 'test@example.com',
            username: 'testuser',
            token: 'mock-token-123'
          }
        },
        token: 'mock-token-123'
      }
    }).as('loginRequest');

    // Click Login button
    cy.contains('button', 'Login').click();

    // Fill out the login form
    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.contains('button', 'Log In').click();

    // Wait for the login POST
    cy.wait('@loginRequest');

    // Assert user info saved in localStorage
    cy.window().then((win) => {
      const user = JSON.parse(win.localStorage.getItem('user') || '{}');
      expect(user.token).to.eq('mock-token-123');
      expect(user.email).to.eq('test@example.com');
    });

    //Wait for tasks fetch
    cy.wait('@getTasks');

    // Assert login modal closed
    cy.get('[data-testid="login-modal"]').should('not.exist');

    // Optionally assert we’re on the /tasks page
    cy.url().should('include', '/tasks');
  });
});
