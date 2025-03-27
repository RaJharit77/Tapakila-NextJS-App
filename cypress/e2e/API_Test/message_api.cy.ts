describe("API - Gestion des messages", () => {
    const apiUrl = "http://localhost:3000/api/contact"; 
    const userId = "df8d7b82-640a-4de1-9815-3f3e2063c30c";
  
    it("Devrait retourner une erreur si le sujet ou le message est manquant", () => {
      cy.request({
        method: "POST",
        url: apiUrl,
        body: { user_id: userId , subject: "" }, 
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq("Tous les champs sont requis.");
      });
    });
  
    it("Devrait créer un message avec succès", () => {
        cy.request({
          method: "POST",
          url: apiUrl,
          body: {
            user_id: userId,
            subject: "Problème technique",
            message: "J'ai un problème avec l'application.",
          },
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property("message_id");
          expect(response.body).to.have.property("message_subject", "Problème technique");
          expect(response.body).to.have.property("message_content", "J'ai un problème avec l'application.");
        });
  
    it("Devrait récupérer une liste de messages", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}?page=1&pageSize=5`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });
  
    it("Devrait retourner une erreur en cas de problème serveur", () => {
      cy.request({
        method: "POST",
        url: apiUrl,
        body: { user_id: "error", subject: "Bug", message: "Test erreur serveur" },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body.error).to.eq("Erreur serveur.");
      });
    });
  });
  

});
  