describe('template spec', () => {
  it('passes', () => {
    cy.visit('/')
  })

  it("Devrait créer un utilisateur avec succès", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/signup",
      body: {
        name: "John Doe",
        email: `john${Date.now()}@example.com`, 
        password: "StrongPass123!",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq("Inscription réussie.");
    })
  })


 it("Devrait permettre la connexion avec les bonnes informations", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/login",
      body: { email: "john2@example.com", password: "StrongPass123!" }, // Doit être un utilisateur valide
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq("Connexion réussie.");
      expect(response.body.user).to.have.property("name");
      expect(response.body.user).to.have.property("email", "john2@example.com");
    });
  })

  it.only("Devrait créer un message avec succès", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/contact",
      body: {
        user_id: "df8d7b82-640a-4de1-9815-3f3e2063c30c",
        subject: "Problème technique",
        message: "J'ai un problème avec l'application.",
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("message_id");
      expect(response.body).to.have.property("message_subject", "Problème technique");
      expect(response.body).to.have.property("message_content", "J'ai un problème avec l'application.");
    });

    cy.request({
      method: "GET",
      url: "http://localhost:3000/api/contact/M64fe8dfc724c4b3fb710b1998deb22b3",
    }).then((getResponse) => {
      expect(getResponse.status).to.eq(200);
      expect(getResponse.body).to.have.property("message_id", "M64fe8dfc724c4b3fb710b1998deb22b3");
      expect(getResponse.body).to.have.property("message_subject", "Problème technique");
      expect(getResponse.body).to.have.property("message_content", "J'ai un problème avec l'application.");
      expect(getResponse.body).to.have.property("user"); // Vérifie que l'utilisateur est inclus
    });
  });


});


