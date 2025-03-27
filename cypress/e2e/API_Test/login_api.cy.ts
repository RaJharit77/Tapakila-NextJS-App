describe("API - Connexion utilisateur", () => {
    const apiUrl = "http://localhost:3000/api/auth/login"; 
  
    it("Devrait retourner une erreur si l'email ou le mot de passe est manquant", () => {
      cy.request({
        method: "POST",
        url: apiUrl,
        body: { email: "john@example.com" }, 
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq("Email et mot de passe requis.");
      });
    });
  
    it("Devrait refuser une connexion avec un mauvais email ou mot de passe", () => {
      cy.request({
        method: "POST",
        url: apiUrl,
        body: { email: "wrong@example.com", password: "WrongPass123!" },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message).to.eq("Email ou mot de passe incorrect.");
      });
    });
  
    it("Devrait permettre la connexion avec les bonnes informations", () => {
      cy.request({
        method: "POST",
        url: apiUrl,
        body: { email: "john2@example.com", password: "StrongPass123!" }, 
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq("Connexion réussie.");
        expect(response.body.user).to.have.property("name");
        expect(response.body.user).to.have.property("email", "john2@example.com");
      });
    });
  
    it("Devrait retourner une erreur en cas de problème serveur", () => {
      cy.request({
        method: "POST",
        url: apiUrl,
        body: { email: "error@example.com", password: "ErrorPass123!" },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body.message).to.eq("Erreur lors de la connexion.");
      });
    });
  });
  