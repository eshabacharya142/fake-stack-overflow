import LoginPage from "../../src/components/main/userLoginPage";
import { login } from "../../src/services/userService";

it('mounts', () => {
    cy.mount(<LoginPage/>)
    cy.get('#formUsernameInput')
    cy.get('#formPasswordInput')
})

it('shows username inputted by user', () => {
    cy.mount(<LoginPage/>)
    cy.get('#formUsernameInput').should('have.value', '')
    cy.get('#formUsernameInput').type('johndoe')
    cy.get('#formUsernameInput').should('have.value', 'johndoe')
})

it('shows password inputted by user', () => {
    cy.mount(<LoginPage/>)
    cy.get('#formPasswordInput').should('have.value', '')
    cy.get('#formPasswordInput').type('1234')
    cy.get('#formPasswordInput').should('have.value', '1234')
})

it('shows error message when inputs are empty', () => {
    cy.mount(<LoginPage/>)
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Username cannot be empty')
    cy.get('div .pwd_error').contains('Password cannot be empty')
})

it('login is called when button clicked', () => {
    const loginSpy = cy.spy(login)
    cy.stub(LoginPage, 'login').callsFake(loginSpy)
    cy.mount(<LoginPage/>)
    cy.get('#formUsernameInput').type('johndoewrong')
    cy.get('#formPasswordInput').type('1234')
    cy.get('.form_postBtn').click().then(() => {
        expect(loginSpy).to.be.calledOnce;
    })
})

it('handleQuestion is called when Login is clicked', () => {
    cy.stub(LoginPage,'login').resolves({username: 'johndoe', password: "1234"})
    const handleQuestionsSpy = cy.spy().as('handleQuestionsSpy')
    cy.mount(<LoginPage handleQuestions={handleQuestionsSpy} />)
    cy.get('#formUsernameInput').type('johndoe')
    cy.get('#formPasswordInput').type('1234')
    cy.get('.form_postBtn').click().then(() => {
        expect(handleQuestionsSpy).to.be.calledOnce;
    })
})

it('fetchUserProfile is called when Login is clicked', () => {
    cy.stub(LoginPage,'login').resolves({username: 'johndoe', password: "1234"})
    const handleQuestionsSpy = cy.spy().as('handleQuestionsSpy')
    const fetchUserProfileSpy = cy.spy().as('fetchUserProfileSpy')
    cy.mount(<LoginPage handleQuestions={handleQuestionsSpy} fetchUserProfile={fetchUserProfileSpy} />)
    cy.get('#formUsernameInput').type('johndoe')
    cy.get('#formPasswordInput').type('1234')
    cy.get('.form_postBtn').click().then(() => {
        expect(fetchUserProfileSpy).to.be.calledOnce;
    })
})

it('login a user successfully when all fields are filled', () => {
    cy.stub(LoginPage,'login').resolves({username: 'johndoe', password: "1234"})
    const handleQuestionsSpy = cy.spy().as('handleQuestionsSpy')
    const fetchUserProfileSpy = cy.spy().as('fetchUserProfileSpy')
    cy.mount(<LoginPage handleQuestions={handleQuestionsSpy} fetchUserProfile={fetchUserProfileSpy} />)
    cy.get('#formUsernameInput').type('johndoe')
    cy.get('#formPasswordInput').type('1234')
    cy.get('.form_postBtn').click()
})

it('login user successful for invalid credentials', () => {
    cy.stub(LoginPage, 'login').resolves(false)
    cy.mount(<LoginPage />)
    cy.get('#formUsernameInput').type('invalid_username')
    cy.get('#formPasswordInput').type('invalid_password')
    cy.get('.form_postBtn').click()
    cy.contains('.loginError', 'Please enter valid credentials.')
});