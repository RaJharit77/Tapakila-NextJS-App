/// <reference types="cypress" />

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<Element>;
      logout(): Chainable<Element>;
      makeReservation(eventId: string, ticketType: string, count: number): Chainable<Element>;
      cancelReservation(ticketType: string, count: number): Chainable<Element>;
      updateProfile(firstName: string, lastName: string, phone: string): Chainable<Element>;
      changePassword(currentPassword: string, newPassword: string): Chainable<Element>;
    }
  }
}

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should("include", "/dashboard/profile");
});

Cypress.Commands.add("logout", () => {
  cy.get("a").contains("Déconnexion").click();
  cy.get("a").contains("Connexion").should("be.visible");
});

Cypress.Commands.add(
  "makeReservation",
  (eventId: string, ticketType: string, count: number) => {
    cy.visit(`/events/${eventId}`);
    cy.get("button").contains("Réserver maintenant").click();
    cy.url().should("include", "/dashboard/reservations");
    cy.get("select").first().select(ticketType);
    cy.get('input[type="number"]').clear().type(count.toString());
    cy.get("button").contains("Passer à la confirmation").click();
    cy.get("button").contains("Confirmer la réservation").click();
    cy.get("h1").contains("Réservation confirmée").should("be.visible");
  }
);

Cypress.Commands.add(
  "cancelReservation",
  (ticketType: string, count: number) => {
    cy.visit("/dashboard/reservations");
    cy.get("select").first().select(ticketType);
    cy.get('input[type="number"]').clear().type(count.toString());
    cy.get("button").contains("Annuler").click();
    cy.get(".toast-success").should("be.visible");
  }
);

Cypress.Commands.add(
  "updateProfile",
  (firstName: string, lastName: string, phone: string) => {
    cy.visit("/dashboard/profile");
    cy.get('input[name="firstName"]').clear().type(firstName);
    cy.get('input[name="lastName"]').clear().type(lastName);
    cy.get('input[name="phone"]').clear().type(phone);
    cy.get('button[type="submit"]').click();
    cy.get(".toast-success").should("be.visible");
  }
);

Cypress.Commands.add(
  "changePassword",
  (currentPassword: string, newPassword: string) => {
    cy.visit("/dashboard/profile");
    cy.get("button").contains("Changer le mot de passe").click();
    cy.get('input[name="currentPassword"]').type(currentPassword);
    cy.get('input[name="newPassword"]').type(newPassword);
    cy.get('input[name="confirmPassword"]').type(newPassword);
    cy.get("button").contains("Confirmer").click();
    cy.get(".toast-success").should("be.visible");
  }
);