import RegisterPage from "../../src/components/main/userRegisterPage";
import { register } from "../../src/services/userService";


it('mounts', () => {
    cy.mount(<RegisterPage/>);
    cy.get('#formFirstNameInput')
    cy.get('#formLastNameInput')
    cy.get('#formUsernameInput')
    cy.get('#formPasswordInput')
    cy.get('#formEmailInput')
    cy.get("#radiobutton")
    cy.get('div #option1');
    cy.get('div #option2');
    cy.get('div #option1').should('be.checked');
});

it('shows first name inputted by user', () => {
    cy.mount(<RegisterPage/>)
    cy.get('#formFirstNameInput').should('have.value', '')
    cy.get('#formFirstNameInput').type('john')
    cy.get('#formFirstNameInput').should('have.value', 'john')
})

it('shows last name inputted by user', () => {
    cy.mount(<RegisterPage/>)
    cy.get('#formLastNameInput').should('have.value', '')
    cy.get('#formLastNameInput').type('doe')
    cy.get('#formLastNameInput').should('have.value', 'doe')
})

it('shows username inputted by user', () => {
    cy.mount(<RegisterPage/>)
    cy.get('#formUsernameInput').should('have.value', '')
    cy.get('#formUsernameInput').type('johndoe')
    cy.get('#formUsernameInput').should('have.value', 'johndoe')
})

it('shows password inputted by user', () => {
    cy.mount(<RegisterPage/>)
    cy.get('#formPasswordInput').should('have.value', '')
    cy.get('#formPasswordInput').type('1234')
    cy.get('#formPasswordInput').should('have.value', '1234')
})

it('shows email inputted by user', () => {
    cy.mount(<RegisterPage/>)
    cy.get('#formEmailInput').should('have.value', '')
    cy.get('#formEmailInput').type('john@test.com')
    cy.get('#formEmailInput').should('have.value', 'john@test.com')
})

it('shows error message when inputs are empty', () => {
    cy.mount(<RegisterPage/>)
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('First Name cannot be empty')
    cy.get('div .input_error').contains('Last Name cannot be empty')
    cy.get('div .input_error').contains('Username cannot be empty')
    cy.get('div .pwd_error').contains('Password cannot be empty')
    cy.get('div .input_error').contains('Email cannot be empty')
})

it('registers a user successfully when all fields are filled', () => {
    const registerSpy = cy.spy(register)
    cy.stub(RegisterPage, 'register').callsFake(registerSpy)
    cy.mount(<RegisterPage/>)
    cy.get('#formFirstNameInput').type('John')
    cy.get('#formLastNameInput').type('Doe')
    cy.get('#formUsernameInput').type('johndoe')
    cy.get('#formPasswordInput').type('password123')
    cy.get('#formEmailInput').type('john.doe@example.com')
    cy.get('.form_postBtn').click().then(() => {
        expect(registerSpy).to.be.calledOnce;
    })
})

it('registers an admin successfully when all fields are filled', () => {
    const registerSpy = cy.spy(register)
    cy.stub(RegisterPage, 'register').callsFake(registerSpy)
    cy.mount(<RegisterPage/>)
    cy.get('#formFirstNameInput').type('John')
    cy.get('#formLastNameInput').type('Doe')
    cy.get('#formUsernameInput').type('johndoe')
    cy.get('#formPasswordInput').type('password123')
    cy.get('#formEmailInput').type('john.doe@example.com')
    cy.get('div #option2').check();
    cy.get('.form_postBtn').click().then(() => {
        expect(registerSpy).to.be.calledOnce;
    })
})

it('handleLogin is called when Register is clicked', () => {
    cy.stub(RegisterPage,'register').resolves({_id: '1', username: 'johndoe'});
    const handleLoginSpy = cy.spy().as('handleLoginSpy')
    cy.mount(<RegisterPage handleLogin={handleLoginSpy} />)
    cy.get('#formFirstNameInput').type('John')
    cy.get('#formLastNameInput').type('Doe')
    cy.get('#formUsernameInput').type('johndoe')
    cy.get('#formPasswordInput').type('password123')
    cy.get('#formEmailInput').type('john.doe@example.com')
    cy.get('.form_postBtn').click().then(() => {
        expect(handleLoginSpy).to.be.calledOnce;
    })
})