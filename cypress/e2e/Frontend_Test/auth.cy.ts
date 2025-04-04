describe('Authentication Flow', () => {
  beforeEach(() => {
    // Visiter la page d'accueil avant chaque test
    cy.visit('/');
  });

  it('should navigate to login page', () => {
    // Cliquer sur le bouton de connexion dans la navbar
    cy.get('a').contains('Connecter').click();
    
    // Vérifier que nous sommes sur la page de connexion
    cy.url().should('include', '/login');
  });

  it('should login successfully with valid credentials', () => {
    // Naviguer vers la page de connexion
    cy.visit('/login');
    
    // Remplir le formulaire de connexion
    cy.get('input[name="email"]').type('harentsoa@gmail.com');
    cy.get('input[name="password"]').type('harentsoa');
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();
    
    // Vérifier que nous sommes redirigés vers la page du profil
    cy.url().should('include', '/dashboard/profile');
    
    // Vérifier que l'utilisateur est connecté (par exemple, le bouton de déconnexion est visible)
    cy.get('a').should('not.contain', 'Connecter');
  });

  it('should show error message with invalid credentials', () => {
    // Naviguer vers la page de connexion
    cy.visit('/login');
    
    // Remplir le formulaire avec des identifiants invalides
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();
    
    // Vérifier que le message d'erreur est affiché
    cy.get('.text-red-500').should('be.visible');
  });

  it('should navigate to signup page', () => {
    // Cliquer sur le bouton d'inscription dans la navbar
    cy.get('a').contains('Inscription').click();
    
    // Vérifier que nous sommes sur la page d'inscription
    cy.url().should('include', '/signup');
  });

  it('should signup successfully with valid information', () => {
    // Naviguer vers la page d'inscription
    cy.visit('/signup');
    
    // Générer un email unique pour éviter les conflits
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    // Remplir le formulaire d'inscription
    cy.get('input[placeholder="John Doe"]').type('Test User');
    cy.get('input[placeholder="john.doe@gmail.com"]').type(uniqueEmail);
    cy.get('input[placeholder="votre mot de passe"]').type('password123');
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();
    
    // Vérifier que nous sommes redirigés vers la page du profil
    cy.url().should('include', '/dashboard/profile');
    
    // Vérifier que l'utilisateur est connecté
    cy.get('a').should('not.contain', 'Connecter');
  });

  it('should logout successfully', () => {
    // Se connecter d'abord
    cy.visit('/login');
    cy.get('input[name="email"]').type('harentsoa@gmail.com');
    cy.get('input[name="password"]').type('harentsoa');
    cy.get('button[type="submit"]').click();
    
    // Attendre que la connexion soit terminée
    cy.url().should('include', '/dashboard/profile');
    
    // Cliquer sur le bouton de déconnexion
    cy.get('a').contains('Déconnexion').click();
    
    // Vérifier que nous sommes déconnectés (le bouton de connexion est visible)
    cy.get('a').contains('Connexion').should('be.visible');
  });
}); 