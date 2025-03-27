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






















describe('template spec', () => {
  /**it('passes', () => {
    cy.visit('/')
  })*/

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


  











































































 /**it("Devrait permettre la connexion avec les bonnes informations", () => {
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

  it("Devrait créer un message avec succès", () => {
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
      expect(getResponse.body).to.have.property("user"); 
    });

  });

  it("Devrait récupérer la liste des événements", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:3000/api/events",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
    });
  });

  it("Devrait créer un événement avec succès", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/events",
      body: {
        event_name: "Conférence Tech",
        event_place: "Centre des Congrès",
        event_category: "Conférence",
        event_date: "2025-04-15T10:00:00Z",
        event_description: "Une conférence sur les dernières avancées en IA.",
        event_organizer: "Tech Group",
        event_id: "E008",
        event_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNH1CAaIgi-XGu5v_TVT8sSAGlKlN0pvQgKQ&s",
        admin_id: "A001",
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("event_name", "Conférence Tech");
      expect(response.body).to.have.property("event_place", "Centre des Congrès");
      expect(response.body).to.have.property("event_category", "Conférence");
    });
  });

  it.only("Devrait récupérer un événement par ID", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:3000/api/events/E008", // Assure-toi que cet ID existe en base
    }).then((response) => {
      expect(response.status).to.eq(200); // Correction : 200 au lieu de 201
      expect(response.body).to.have.property("event_name", "Conférence Tech");
      expect(response.body).to.have.property("event_place", "Centre des Congrès");
      expect(response.body).to.have.property("event_category", "Conférence");
      expect(response.body).to.have.property("event_description", "Une conférence sur les dernières avancées en IA.");
      expect(response.body).to.have.property("event_organizer", "Tech Group");
      expect(response.body).to.have.property("event_id", "E008"); // Vérifier que c'est bien le bon ID
      expect(response.body).to.have.property("event_image", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNH1CAaIgi-XGu5v_TVT8sSAGlKlN0pvQgKQ&s");
      expect(response.body).to.have.property("admin_id", "A001");
    });
  });
  */
  


});


