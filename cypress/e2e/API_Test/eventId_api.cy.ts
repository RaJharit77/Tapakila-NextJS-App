describe("API - Récupération d'un événement spécifique", () => {
    const apiUrl = "http://localhost:3000/api/events"; 
  
   
    it("Devrait récupérer un événement par ID", () => {
        cy.request({
          method: "GET",
          url: "http://localhost:3000/api/events/E008", 
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property("event_name", "Conférence Tech");
          expect(response.body).to.have.property("event_place", "Centre des Congrès");
          expect(response.body).to.have.property("event_category", "Conférence");
          expect(response.body).to.have.property("event_description", "Une conférence sur les dernières avancées en IA.");
          expect(response.body).to.have.property("event_organizer", "Tech Group");
          expect(response.body).to.have.property("event_id", "E008"); 
          expect(response.body).to.have.property("event_image", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNH1CAaIgi-XGu5v_TVT8sSAGlKlN0pvQgKQ&s");
          expect(response.body).to.have.property("admin_id", "A001");
        });
  });
  
  it.only("Devrait modifier un événement existant", () => {
    const eventId = "E001"; 
    const updatedEventData = {
      event_name: "LOLI",
    };

    cy.request({
      method: "PUT",
      url: `${apiUrl}/${eventId}`, 
      body: updatedEventData,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.eq(200);
    });
  });


});