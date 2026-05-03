/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

/**
 * E2E flows aligned with KogiQA selector-less interaction (labels / placeholders / roles).
 * The login form uses HTML5 constraint validation (required + type="email").
 */
describe('Login app (http://localhost:4200)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('user input validation', () => {
    it('blocks submit when email and password are empty (native validation)', () => {
      cy.findByRole('button', { name: /^login$/i }).click();

      cy.findByPlaceholderText(/enter your email/i)
        .invoke('prop', 'validity')
        .its('valueMissing')
        .should('be.true');

      cy.findByPlaceholderText(/enter your password/i)
        .invoke('prop', 'validity')
        .its('valueMissing')
        .should('be.true');
    });

    it('reports invalid email format when password is present', () => {
      cy.findByPlaceholderText(/enter your email/i).clear().type('not-a-valid-email');
      cy.findByPlaceholderText(/enter your password/i).clear().type('some-password');

      cy.findByRole('button', { name: /^login$/i }).click();

      cy.findByPlaceholderText(/enter your email/i)
        .invoke('prop', 'validity')
        .its('typeMismatch')
        .should('be.true');
    });

    it('reports missing password when email is valid', () => {
      cy.findByPlaceholderText(/enter your email/i).clear().type('user@example.com');

      cy.findByRole('button', { name: /^login$/i }).click();

      cy.findByPlaceholderText(/enter your password/i)
        .invoke('prop', 'validity')
        .its('valueMissing')
        .should('be.true');
    });

    it('accepts valid email and password for constraint checks', () => {
      cy.findByPlaceholderText(/enter your email/i).clear().type('user@example.com');
      cy.findByPlaceholderText(/enter your password/i).clear().type('Secret123!');

      cy.findByPlaceholderText(/enter your email/i)
        .invoke('prop', 'validity')
        .its('valid')
        .should('be.true');
      cy.findByPlaceholderText(/enter your password/i)
        .invoke('prop', 'validity')
        .its('valid')
        .should('be.true');
    });
  });

  describe('remember me', () => {
    it('toggles remember me via its label', () => {
      cy.findByLabelText(/remember me/i).should('not.be.checked');

      cy.findByLabelText(/remember me/i).check();
      cy.findByLabelText(/remember me/i).should('be.checked');

      cy.findByLabelText(/remember me/i).uncheck();
      cy.findByLabelText(/remember me/i).should('not.be.checked');
    });

    it('does not persist remember me across reload (demo checkbox is not bound to storage)', () => {
      cy.findByLabelText(/remember me/i).check();
      cy.findByLabelText(/remember me/i).should('be.checked');

      cy.reload();

      cy.findByLabelText(/remember me/i).should('not.be.checked');
    });
  });
});
