/// <reference types="cypress" />

describe('Tasks Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    // Mock login
    cy.intercept('POST', '**/session', {
      statusCode: 200,
      body: {
        data: {
          attributes: {
            email: 'test@example.com',
            username: 'testuser',
            token: 'mock-token-123',
            points: 0
          }
        }
      }
    }).as('loginRequest');

    // Initial empty task list
    cy.intercept('GET', '**/tasks', {
      statusCode: 200,
      body: {
        data: []
      }
    }).as('getTasks');

    cy.visit('/');
    cy.contains('button', 'Login').click();
    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.contains('button', 'Log In').click();

    cy.wait('@loginRequest');
    cy.wait('@getTasks');
  });

  it('adds a new task', () => {
    cy.intercept('POST', '**/tasks', {
      statusCode: 201,
      body: {
        data: {
          id: '1',
          type: 'task',
          attributes: {
            name: 'New Cypress Task',
            description: '',
            status: 'pending',
            priority: 'low',
            due_date: '',
            notes: '',
            attachment_url: ''
          }
        }
      }
    }).as('createTask');

    cy.get('input[placeholder="Task Name *"]').type('New Cypress Task');
    cy.contains('button', 'Add Task').click();
    cy.wait('@createTask');

    cy.contains('New Cypress Task').should('exist');
  });

  it('opens and edits task via modal', () => {
    cy.intercept('POST', '**/tasks', {
      statusCode: 201,
      body: {
        data: {
          id: '2',
          type: 'task',
          attributes: {
            name: 'Modal Test Task',
            description: '',
            status: 'pending',
            priority: 'low',
            due_date: '',
            notes: '',
            attachment_url: ''
          }
        }
      }
    }).as('createTask');
  
    cy.intercept('PATCH', '**/tasks/2', {
      statusCode: 200,
      body: {
        data: {
          id: '2',
          type: 'task',
          attributes: {
            name: 'Updated Task',
            description: '',
            status: 'pending',
            priority: 'low',
            due_date: '',
            notes: '',
            attachment_url: ''
          }
        }
      }
    }).as('updateTask');
  
    cy.get('input[placeholder="Task Name *"]').type('Modal Test Task');
    cy.contains('button', 'Add Task').click();
    cy.wait('@createTask');
  
    cy.contains('Modal Test Task').click();
  
    // 👇 Scope to modal only to avoid multiple inputs
    cy.get('[role="dialog"]').within(() => {
      cy.get('input[placeholder="Task Name *"]').clear().type('Updated Task');
      cy.contains('button', 'Update Task').click();
    });
  
    cy.wait('@updateTask');
    cy.contains('Updated Task').should('exist');
  });  

  it('clears completed tasks', () => {
    // Stub the GET request to preload a completed task
    cy.intercept('GET', '**/tasks', {
      statusCode: 200,
      body: {
        data: [
          {
            id: '99',
            type: 'task',
            attributes: {
              name: 'Completed Task',
              description: '',
              status: 'completed',
              priority: 'low',
              due_date: '',
              notes: '',
              attachment_url: ''
            }
          }
        ]
      }
    }).as('getTasks');
  
    // Reload page to re-trigger GET with completed task
    cy.visit('/');
    cy.contains('button', 'Login').click();
    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.contains('button', 'Log In').click();
    cy.wait('@loginRequest');
    cy.wait('@getTasks');
  
    // Intercept DELETE request
    cy.intercept('DELETE', '**/tasks/99', {
      statusCode: 200,
      body: { message: 'Task deleted successfully' }
    }).as('deleteTask');
  
    // Use the test id to scope to completed column
    cy.get('[data-testid="completed-column"]').within(() => {
      cy.contains('Completed Task').should('exist');
      cy.contains('Clear Completed').click();
    });
  
    cy.on('window:confirm', () => true);
    cy.wait('@deleteTask');
    cy.contains('Completed Task').should('not.exist');
  });
  


  it('sorts tasks by dropdown selection', () => {
    cy.get('select#sortBy').select('Priority');
    cy.window().then((win) => {
      const storedSort = win.localStorage.getItem('taskSortBy');
      expect(storedSort).to.eq('priority');
    });
  });

  it('toggles sound preference', () => {
    cy.get('input[type="checkbox"]').check({ force: true });
    cy.window().then((win) => {
      const soundOn = JSON.parse(win.localStorage.getItem('soundOn') || 'false');
      expect(soundOn).to.eq(true);
    });
  });
});
