describe('New Answer Page', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Programmatically navigate using React router').click();
    })
    
    afterEach(() => {
        cy.contains('Logout').click();
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    })

    it('Create new answer should be displayed at the top of the answers page', () => {
        const answers = ["Test Answer 1", "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.", "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router."];
        cy.contains('Answer Question').click();
        cy.get('#answerTextInput').type(answers[0]);
        cy.contains('Post Answer').click();
        cy.get('.answerText').each(($el, index) => {
            cy.wrap($el).should('contain', answers[index]);
        });
        cy.contains('kate');
        cy.contains('0 seconds ago');
    })

    it('Answer is mandatory when creating a new answer', () => {
        cy.contains('Answer Question').click();
        cy.contains('Post Answer').click();
        cy.contains('Answer text cannot be empty');
    })

    it('successfully displays the answer textbox for the new answer page', () => {
        cy.contains('Answer Question').click();
        cy.get('#answerTextInput').should('exist');
    })

    it('successfully displays Answer Text field for the new answer page', () => {
        cy.contains('Answer Question').click();
        cy.contains("Answer Text");
    })

    it('Create new answer should increase the count of the answers on question page', () => {
        cy.contains('2 answers');
        cy.contains('Answer Question').click();
        cy.get('#answerTextInput').type("Test Answer 1");
        cy.contains('Post Answer').click();
        cy.contains('3 answers');
    })

})