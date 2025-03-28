describe("API - Récupération d'un message par ID", () => {
    const apiUrl = "http://localhost:3000/api/contact";
    const messageId = "M64fe8dfc724c4b3fb710b1998deb22b3"

    it("Devrait retourner une erreur si l'ID du message n'existe pas", () => {
        cy.request({
            method: "GET",
            url: `${apiUrl}/fakeMessageId123`, // ID inexistant
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body.error).to.eq("Message not found");
        });
    });

    it("Devrait récupérer un message existant", () => {

        cy.request({
            method: "GET",
            url: `${apiUrl}/${messageId}`,
        }).then((getResponse) => {
            expect(getResponse.status).to.eq(200);
            expect(getResponse.body).to.have.property("message_id", messageId);
            expect(getResponse.body).to.have.property("message_subject", "Problème technique");
            expect(getResponse.body).to.have.property("message_content", "J'ai un problème avec l'application.");
            expect(getResponse.body).to.have.property("user");
        });
    });

    it("Devrait retourner une erreur serveur en cas de problème", () => {
        cy.request({
            method: "GET",
            url: `${apiUrl}/errorTest`,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(500);
            expect(response.body.error).to.eq("Repository erro");
        });
    })

    
});




