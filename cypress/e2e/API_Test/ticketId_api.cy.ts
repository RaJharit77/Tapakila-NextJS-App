describe('template spec', () => {
    it("Devrait récupérer un ticket par ID", () => {
        cy.request({
          method: "GET",
          url: "http://localhost:3000/api/tickets/TKT12345", // Remplace par un ID valide
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property("ticket_id", "TKT12345");
          expect(response.body).to.have.property("user").that.is.an("object"); 
        });
      });
    
      it("Devrait retourner une erreur si le ticket n'existe pas", () => {
        cy.request({
          method: "GET",
          url: "http://localhost:3000/api/tickets/TKT_DOES_NOT_EXIST",
          failOnStatusCode: false, 
        }).then((response) => {
          expect(response.status).to.eq(500);
          expect(response.body).to.have.property("error", "Repository Error");
        });
      });
      

});