describe('Profile Page', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    })
    
    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    })


    it('Profile Page - User logs in and clicks profile', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Quick question about storage on android');
        cy.contains('Profile').click();
        cy.get('#showFirstNameInput').should('contain', 'First Name: Kate');
        cy.get('#showLastNameInput').should('contain', 'Last Name: Sharma');
        cy.get('#showUsernameInput').should('contain', 'Username: kate');
        cy.get('#showEmailInput').should('contain', 'Email: kate@test.com');
        cy.get('#showUserRole').should('contain', 'Role: REGISTERED');
    })

    it('Profile Page - Admin logs in and clicks profile', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('queen');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Quick question about storage on android');
        cy.contains('Profile').click();
        cy.get('#showFirstNameInput').should('contain', 'First Name: Queen');
        cy.get('#showLastNameInput').should('contain', 'Last Name: Charlotte');
        cy.get('#showUsernameInput').should('contain', 'Username: queen');
        cy.get('#showEmailInput').should('contain', 'Email: cherry@test.com');
        cy.get('#showUserRole').should('contain', 'Role: ADMIN');
    })
})