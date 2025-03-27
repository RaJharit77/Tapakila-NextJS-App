describe('template spec', () => {

    
    it("Devrait récupérer un utilisateur par ID", () => {
        cy.request({
          method: "GET",
          url: "http://localhost:3000/api/users/USR1234",
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property("user_id", "USR1234");
        });
      });
    
      
      

});