describe('Reservation Flow', () => {
  beforeEach(() => {
    // Se connecter avant chaque test
    cy.visit('/login');
    cy.get('input[name="email"]').type('harentsoa@gmail.com');
    cy.get('input[name="password"]').type('harentsoa');
    cy.get('button[type="submit"]').click();
    
    // Attendre que la connexion soit terminée
    cy.url().should('include', '/dashboard/profile');
  });

  it('should navigate to events page', () => {
    // Cliquer sur le lien des événements
    cy.get('a').contains('Événements').click();
    
    // Vérifier que nous sommes sur la page des événements
    cy.url().should('include', '/events');
  });

  it('should view event details', () => {
    // Naviguer vers la page des événements
    cy.visit('/events');
    
    // Attendre que les événements soient chargés
    cy.get('.grid').should('be.visible');
    
    // Cliquer sur le premier événement
    cy.get('.grid > div').first().click();
    
    // Vérifier que nous sommes sur la page de détails de l'événement
    cy.url().should('include', '/events/');
  });

  it('should make a reservation', () => {
    // Naviguer vers la page des événements
    cy.visit('/events');
    
    // Attendre que les événements soient chargés
    cy.get('.grid').should('be.visible');
    
    // Cliquer sur le premier événement
    cy.get('.grid > div').first().click();
    
    // Attendre que la page de détails soit chargée
    cy.url().should('include', '/events/');
    
    // Cliquer sur le bouton de réservation
    cy.get('button').contains('Réserver maintenant').click();
    
    // Vérifier que nous sommes sur la page de réservation
    cy.url().should('include', '/dashboard/reservations');
    
    // Sélectionner un type de billet
    cy.get('select').first().select('EARLY_BIRD');
    
    // Définir la quantité de billets
    cy.get('input[type="number"]').clear().type('2');
    
    // Cliquer sur le bouton de confirmation
    cy.get('button').contains('Passer à la confirmation').click();
    
    // Vérifier que nous sommes sur la page de confirmation
    cy.get('h1').contains('Confirmation de réservation').should('be.visible');
    
    // Confirmer la réservation
    cy.get('button').contains('Confirmer la réservation').click();
    
    // Vérifier que la réservation est confirmée
    cy.get('h1').contains('Réservation confirmée').should('be.visible');
  });

  it('should view reservations in dashboard', () => {
    // Naviguer vers le tableau de bord
    cy.visit('/dashboard');
    
    // Cliquer sur le lien des réservations
    cy.get('a').contains('Mes Réservations').click();
    
    // Vérifier que nous sommes sur la page des réservations
    cy.url().should('include', '/dashboard/reservations');
    
    // Vérifier que les réservations sont affichées
    cy.get('table').should('be.visible');
  });
}); 