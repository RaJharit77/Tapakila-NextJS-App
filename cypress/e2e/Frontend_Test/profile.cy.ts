describe('Profile Modification Flow', () => {
  beforeEach(() => {
    // Se connecter avant chaque test
    cy.visit('/login');
    cy.get('input[name="email"]').type('harentsoa@gmail.com');
    cy.get('input[name="password"]').type('harentsoa');
    cy.get('button[type="submit"]').click();
    
    // Attendre que la connexion soit terminée
    cy.url().should('include', '/dashboard/profile');
  });

  it('should navigate to profile page', () => {
    // Naviguer vers le tableau de bord
    cy.visit('/dashboard');
    
    // Cliquer sur le lien du profil
    cy.get('a').contains('Mon Profil').click();
    
    // Vérifier que nous sommes sur la page du profil
    cy.url().should('include', '/dashboard/profile');
  });

  it('should update profile information', () => {
    // Naviguer vers la page du profil
    cy.visit('/dashboard/profile');
    
    // Attendre que le formulaire soit chargé
    cy.get('form').should('be.visible');
    
    // Modifier les informations du profil
    cy.get('input[name="firstName"]').clear().type('John');
    cy.get('input[name="lastName"]').clear().type('Doe');
    cy.get('input[name="phone"]').clear().type('0123456789');
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();
    
    // Vérifier que le message de succès est affiché
    cy.get('.toast-success').should('be.visible');
    
    // Vérifier que les nouvelles informations sont affichées
    cy.get('input[name="firstName"]').should('have.value', 'John');
    cy.get('input[name="lastName"]').should('have.value', 'Doe');
    cy.get('input[name="phone"]').should('have.value', '0123456789');
  });

  it('should update password', () => {
    // Naviguer vers la page du profil
    cy.visit('/dashboard/profile');
    
    // Attendre que le formulaire soit chargé
    cy.get('form').should('be.visible');
    
    // Cliquer sur le bouton de changement de mot de passe
    cy.get('button').contains('Changer le mot de passe').click();
    
    // Remplir le formulaire de changement de mot de passe
    cy.get('input[name="currentPassword"]').type('harentsoa');
    cy.get('input[name="newPassword"]').type('newpassword123');
    cy.get('input[name="confirmPassword"]').type('newpassword123');
    
    // Soumettre le formulaire
    cy.get('button').contains('Confirmer').click();
    
    // Vérifier que le message de succès est affiché
    cy.get('.toast-success').should('be.visible');
  });

  it('should handle validation errors', () => {
    // Naviguer vers la page du profil
    cy.visit('/dashboard/profile');
    
    // Attendre que le formulaire soit chargé
    cy.get('form').should('be.visible');
    
    // Tenter de soumettre le formulaire avec des données invalides
    cy.get('input[name="firstName"]').clear();
    cy.get('input[name="lastName"]').clear();
    cy.get('input[name="phone"]').clear().type('123'); // Numéro de téléphone trop court
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();
    
    // Vérifier que les messages d'erreur sont affichés
    cy.get('.text-red-500').should('be.visible');
    cy.get('form').should('contain', 'Le prénom est requis');
    cy.get('form').should('contain', 'Le nom est requis');
    cy.get('form').should('contain', 'Le numéro de téléphone doit contenir 10 chiffres');
  });

  it('should handle server errors gracefully', () => {
    // Naviguer vers la page du profil
    cy.visit('/dashboard/profile');
    
    // Attendre que le formulaire soit chargé
    cy.get('form').should('be.visible');
    
    // Simuler une erreur serveur
    cy.intercept('PUT', '/api/users/profile', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('updateProfile');
    
    // Modifier les informations du profil
    cy.get('input[name="firstName"]').clear().type('John');
    cy.get('input[name="lastName"]').clear().type('Doe');
    cy.get('input[name="phone"]').clear().type('0123456789');
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();
    
    // Vérifier que le message d'erreur est affiché
    cy.get('.toast-error').should('be.visible');
    cy.get('form').should('contain', 'Une erreur est survenue lors de la mise à jour du profil');
  });
}); 