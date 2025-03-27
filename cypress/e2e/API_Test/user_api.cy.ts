describe('template spec', () => {
    
    it("Devrait récupérer la liste des utilisateurs avec pagination", () => {
        cy.request({
          method: "GET",
          url: "http://localhost:3000/api/users?page=1&pageSize=5",
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an("array");
          expect(response.body.length).to.be.at.most(5);
        });
      });
      
      it("Devrait créer un nouvel utilisateur", () => {
        cy.request({
          method: "POST",
          url: "http://localhost:3000/api/users",
          body: {
            user_name: "John Doe",
            user_email: "john.doe@example.com",
            user_password: "SecurePassword123",
          },
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property("user_name", "John Doe");
          expect(response.body).to.have.property("user_email", "john.doe@example.com");
        });
      });
    
      it("Devrait retourner une erreur si les champs obligatoires sont manquants", () => {
        cy.request({
          method: "POST",
          url: "http://localhost:3000/api/users",
          body: {
            user_name: "Jane Doe", 
          },
          failOnStatusCode: false, 
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body).to.have.property("error", "Missing required fields");
        });
      });
      
      

});