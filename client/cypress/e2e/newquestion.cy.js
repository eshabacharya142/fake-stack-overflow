describe('New Question Form', () => {

    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    })
    
    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    })
    
    it('Ask a Question creates and displays in All Questions - titles', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('t1 t2 javascript');
        cy.contains('Post Question').click();

        cy.contains('Fake Stack Overflow');
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('5 questions');
        cy.contains('kate asked 0 seconds ago');
        cy.get('.postTitle').should('contain', 'Test Question 1');
        cy.get('.postStats').should('contain', '0 answers');
        cy.get('.postStats').should('contain', '0 views');
    })

    it('Ask a Question creates and displays in All Questions - tags, check unanswered', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('t1 t2 javascript');
        cy.contains('Post Question').click();

        cy.contains('t1');
        cy.contains('t2');
        cy.contains('javascript');

        cy.contains('Unanswered').click();
        cy.get('.postTitle').should('have.length', 1);
        cy.contains('1 question');
    })

    it('Ask a Question creates and displays in All Questions with necessary tags', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('t1 t2');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        cy.contains('android-studio');
        cy.contains('t1');
        cy.contains('t2');
    })

    it('Ask a Question with empty title shows error', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Ask a Question').click();
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();
        cy.contains('Title cannot be empty');
    })

    it('Ask a Question with long title shows error', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();
        cy.contains('Title cannot be more than 100 characters');
    })

    it('Ask a Question with empty text shows error', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();
        cy.contains('Question text cannot be empty');
    })

    it('Ask a Question with more than 5 tags shows error', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('t1 t2 t3 t4 t5 t6');
        cy.contains('Post Question').click();
        cy.contains('Cannot have more than 5 tags');
    })

    it('Ask a Question with a long new tag', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('t1 t2 t3t4t5t6t7t8t9t3t4t5t6t7t8t9');
        cy.contains('Post Question').click();
        cy.contains('New tag length cannot be more than 20');
    })

    it('create a new question with a new tag and finds the question through tag', () => {
        // add a question with tags
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question A');
        cy.get('#formTextInput').type('Test Question A Text');
        cy.get('#formTagInput').type('test1-tag1 react');
        cy.contains('Post Question').click();

        // clicks tags
        cy.contains('Tags').click();
        cy.contains('test1-tag1').click();
        cy.contains('1 questions');
        cy.contains('Test Question A');

        cy.contains('Tags').click();
        cy.contains('react').click();
        cy.contains('2 questions');
        cy.contains('Test Question A');
        cy.contains('Programmatically navigate using React router');
    })

    it('Ask a Question creates and accepts only 1 tag for all the repeated tags', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
        cy.contains('Tags').click();
        cy.contains('7 Tags');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('test-tag test-tag test-tag');
        cy.contains('Post Question').click();
        cy.contains('test-tag').should('have.length',1);
        cy.contains('Tags').click();
        cy.contains('8 Tags');
        cy.contains('test-tag').click();
        cy.contains('1 questions');
    })
})