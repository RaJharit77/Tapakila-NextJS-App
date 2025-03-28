describe("API - Inscription utilisateur", () => {
  const apiUrl = "http://localhost:3000/api/signup"; 

  it("Devrait retourner une erreur si un champ est manquant", () => {
    cy.request({
      method: "POST",
      url: apiUrl,
      body: { name: "John Doe", email: "john@example.com" }, 
      failOnStatusCode: false, 
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq("Tous les champs sont requis.");
    });
  });

  it("Devrait créer un utilisateur avec succès", () => {
    cy.request({
      method: "POST",
      url: apiUrl,
      body: {
        name: "John Doe",
        email: `john${Date.now()}@example.com`, 
        password: "StrongPass123!",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq("Inscription réussie.");
    });
  });

  it("Devrait retourner une erreur en cas de problème serveur", () => {
    cy.request({
      method: "POST",
      url: apiUrl,
      body: {
        name: "John Doe",
        email: "invalid-email",
        password: "12345",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body.message).to.eq("Erreur lors de l'inscription.");
    });
  });
});















