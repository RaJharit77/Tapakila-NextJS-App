describe('Reservation Cancellation Flow', () => {
  beforeEach(() => {
    // Se connecter avant chaque test
    cy.visit('/login');
    cy.get('input[name="email"]').type('harentsoa@gmail.com');
    cy.get('input[name="password"]').type('harentsoa');
    cy.get('button[type="submit"]').click();
    
    // Attendre que la connexion soit terminée
    cy.url().should('include', '/dashboard/profile');
  });

  it('should navigate to reservations page', () => {
    // Naviguer vers le tableau de bord
    cy.visit('/dashboard');
    
    // Cliquer sur le lien des réservations
    cy.get('a').contains('Mes Réservations').click();
    
    // Vérifier que nous sommes sur la page des réservations
    cy.url().should('include', '/dashboard/reservations');
  });

  it('should cancel a reservation', () => {
    // Naviguer vers la page des réservations
    cy.visit('/dashboard/reservations');
    
    // Attendre que les réservations soient chargées
    cy.get('table').should('be.visible');
    
    // Sélectionner un type de billet
    cy.get('select').first().select('EARLY_BIRD');
    
    // Définir la quantité de billets à annuler
    cy.get('input[type="number"]').clear().type('1');
    
    // Cliquer sur le bouton d'annulation
    cy.get('button').contains('Annuler').click();
    
    // Vérifier que le message de confirmation est affiché
    cy.get('.toast-success').should('be.visible');
  });

  it('should show cancellation confirmation dialog', () => {
    // Naviguer vers la page des réservations
    cy.visit('/dashboard/reservations');
    
    // Attendre que les réservations soient chargées
    cy.get('table').should('be.visible');
    
    // Sélectionner un type de billet
    cy.get('select').first().select('EARLY_BIRD');
    
    // Définir la quantité de billets à annuler
    cy.get('input[type="number"]').clear().type('1');
    
    // Cliquer sur le bouton d'annulation
    cy.get('button').contains('Annuler').click();
    
    // Vérifier que le message de confirmation est affiché
    cy.get('.toast-success').should('be.visible');
  });

  it('should handle cancellation error gracefully', () => {
    // Naviguer vers la page des réservations
    cy.visit('/dashboard/reservations');
    
    // Attendre que les réservations soient chargées
    cy.get('table').should('be.visible');
    
    // Simuler une erreur lors de l'annulation
    cy.intercept('POST', '/api/tickets/cancel', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('cancelReservation');
    
    // Sélectionner un type de billet
    cy.get('select').first().select('EARLY_BIRD');
    
    // Définir la quantité de billets à annuler
    cy.get('input[type="number"]').clear().type('1');
    
    // Cliquer sur le bouton d'annulation
    cy.get('button').contains('Annuler').click();
    
    // Vérifier que le message d'erreur est affiché
    cy.get('.toast-error').should('be.visible');
  });
}); 