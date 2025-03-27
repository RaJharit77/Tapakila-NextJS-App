describe("API - Gestion des événements", () => {
    const apiUrl = "http://localhost:3000/api/events"; 

    it("Devrait récupérer la liste des événements", () => {
      cy.request({
        method: "GET",
        url: apiUrl,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });
  
    it("Devrait retourner une erreur serveur si la récupération des événements échoue", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/errorTest`, 
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body.error).to.eq("Failed to fetch events");
      });
    });
  
    it("Devrait retourner une erreur si des champs obligatoires sont manquants", () => {
      cy.request({
        method: "POST",
        url: apiUrl,
        body: {
          event_name: "Concert Rock",
          event_place: "Stade Paris",
          event_category: "Musique",

        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body.error).to.eq("those field must be filled! ");
      });
    });


    it("Devrait créer un événement avec succès", () => {
        cy.request({
          method: "POST",
          url: apiUrl,
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

  
    it("Devrait retourner une erreur serveur en cas de problème lors de la création d'un événement", () => {
      cy.request({
        method: "POST",
        url: apiUrl,
        body: { event_name: "Bug Event", event_place: "Error Place" },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body.error).to.eq("Repository error");
      });
    });

    
  });
  