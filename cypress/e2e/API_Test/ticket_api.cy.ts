it("Devrait récupérer tous les tickets vendus", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:3000/api/tickets",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("count").that.is.a("number");
    });
  });
  
  it("Devrait récupérer les tickets filtrés par event_id", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:3000/api/tickets?id=E001",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.tickets).to.be.an("array");
      response.body.tickets.forEach((ticket: any) => {
        expect(ticket).to.have.property("event_id", "E001");
      });
    });
  });
  
  it("Devrait récupérer les tickets filtrés par type et statut", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:3000/api/tickets?type=VIP&status=AVAILABLE",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.tickets).to.be.an("array");
      response.body.tickets.forEach((ticket: any) => {
        expect(ticket).to.have.property("ticket_type", "VIP");
        expect(ticket).to.have.property("ticket_status", "AVAILABLE");
      });
    });

    
  });
  