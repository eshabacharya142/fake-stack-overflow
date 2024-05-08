describe('Register Page', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    })
    
    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    })


    it('Register Page - Menu buttons for guest user', () => {
        cy.visit('http://localhost:3000');
        cy.get('#sideBarNav').should('contain', 'Questions');
        cy.get('#sideBarNav').should('contain', 'Tags');
        cy.get('#sideBarNav').should('contain', 'Login');
        cy.get('#sideBarNav').should('contain', 'Register');
    })

    it('Register Page - New user registers', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Register').click();
        cy.get('#formFirstNameInput').type('Harry');
        cy.get('#formLastNameInput').type('Styles');
        cy.get('#formUsernameInput').type('harry');
        cy.get('#formPasswordInput').type('1234');
        cy.get('#formEmailInput').type('harry@test.com');
        cy.get('.form_postBtn').click();
        cy.get('.form_postBtn').should('contain', 'Login');
    })

    it('Register Page - New user registers as admin', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Register').click();
        cy.get('#formFirstNameInput').type('Zayn');
        cy.get('#formLastNameInput').type('Malik');
        cy.get('#formUsernameInput').type('zayn_admin');
        cy.get('#formPasswordInput').type('1234');
        cy.get('#formEmailInput').type('zayn@test.com');
        cy.get('div #option2').check();
        cy.get('.form_postBtn').click();
        cy.get('.form_postBtn').should('contain', 'Login');
    })

    it('Register Page - Fields empty', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Register').click();
        cy.get('.form_postBtn').click();
        cy.contains('First Name cannot be empty');
        cy.contains('Last Name cannot be empty');
        cy.contains('Username cannot be empty');
        cy.contains('Password cannot be empty');
        cy.contains('Email cannot be empty');
    })

    it('Register Page - New user registration fails', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Register').click();
        cy.get('#formFirstNameInput').type('Harry');
        cy.get('#formLastNameInput').type('Styles');
        cy.get('#formUsernameInput').type('diamond');
        cy.get('#formPasswordInput').type('1234');
        cy.get('#formEmailInput').type('harry@test.com');
        cy.get('.form_postBtn').click();
        cy.contains('Please choose a different username.');
    })

    it('Register Page - New user registration as admin fails', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Register').click();
        cy.get('#formFirstNameInput').type('Zayn');
        cy.get('#formLastNameInput').type('Malik');
        cy.get('#formUsernameInput').type('queen');
        cy.get('#formPasswordInput').type('1234');
        cy.get('#formEmailInput').type('zayn@test.com');
        cy.get('div #option2').check();
        cy.get('.form_postBtn').click();
        cy.contains('Please choose a different username.');
    })

    it('Register Page - New user registers and logs in', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Register').click();
        cy.get('#formFirstNameInput').type('Taylor');
        cy.get('#formLastNameInput').type('Swift');
        cy.get('#formUsernameInput').type('tswift');
        cy.get('#formPasswordInput').type('1234');
        cy.get('#formEmailInput').type('tswift13@test.com');
        cy.get('.form_postBtn').click();
        cy.get('.form_postBtn').should('contain', 'Login');
        cy.get('#formUsernameInput').type('tswift');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Quick question about storage on android');
    })

})