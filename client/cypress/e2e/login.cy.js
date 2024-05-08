describe('Login Page', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    })
    
    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    })


    it('Login Page - Menu buttons for guest user', () => {
        cy.visit('http://localhost:3000');
        cy.get('#sideBarNav').should('contain', 'Questions');
        cy.get('#sideBarNav').should('contain', 'Tags');
        cy.get('#sideBarNav').should('contain', 'Login');
        cy.get('#sideBarNav').should('contain', 'Register');
    })

    it('Login Page - User logs in', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Quick question about storage on android');
    })

    it('Login Page - Password empty', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('.form_postBtn').click();
        cy.contains('Password cannot be empty');
    })

    it('Login Page - Username empty', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Username cannot be empty');
    })

    it('Login Page - Menu buttons change for logged in user', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Quick question about storage on android');
        cy.get('#sideBarNav').should('contain', 'Questions');
        cy.get('#sideBarNav').should('contain', 'Tags');
        cy.get('#sideBarNav').should('contain', 'Profile');
        cy.get('#sideBarNav').should('contain', 'Logout');
    })

    it('Login Page - User login fails', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('12345');
        cy.get('.form_postBtn').click();
        cy.contains('Please enter valid credentials.');
    })

    it('Login Page - User logs in and logs out', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Quick question about storage on android');
        cy.contains('Logout').click();
        cy.get('#sideBarNav').should('contain', 'Questions');
        cy.get('#sideBarNav').should('contain', 'Tags');
        cy.get('#sideBarNav').should('contain', 'Login');
        cy.get('#sideBarNav').should('contain', 'Register');
    })
})
