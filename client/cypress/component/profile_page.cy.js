import ProfilePage from "../../src/components/main/userProfilePage";


it('renders loading message when currentUser is null', () => {
    const currentUser = null
    cy.mount(<ProfilePage currentUser={currentUser} />)
    cy.contains('.loading-message', 'Please register or login to view the profile.')
})

it('renders user profile information when currentUser is not null', () => {
    const currentUser = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        role: 'REGISTERED'
    };
    cy.mount(<ProfilePage currentUser={currentUser} />);
    cy.get('#showFirstNameInput').should('contain', 'First Name: John');
    cy.get('#showLastNameInput').should('contain', 'Last Name: Doe');
    cy.get('#showUsernameInput').should('contain', 'Username: johndoe');
    cy.get('#showEmailInput').should('contain', 'Email: john@example.com');
    cy.get('#showUserRole').should('contain', 'Role: REGISTERED');
});