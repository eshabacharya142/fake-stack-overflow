describe('Answer Page without Login (All Users)', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    })
    
    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    })

    it('Answer Page displays expected header', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('#answersHeader').should('contain', 'Programmatically navigate using React router');
        cy.get('#answersHeader').should('contain', '2 answers');
        cy.get('#answersHeader').should('contain', 'Ask a Question');
        cy.get('#sideBarNav').should('contain', 'Questions');
        cy.get('#sideBarNav').should('contain', 'Tags');
        cy.get('#sideBarNav').should('contain', 'Login');
        cy.get('#sideBarNav').should('contain', 'Register');
    })

    it('Answer Page displays expected question text', () => {
        cy.visit('http://localhost:3000');
        cy.contains('android studio save string shared preference, start activity and load the saved string').click();
        cy.get('#questionBody').should('contain', '122 views');
        cy.get('#questionBody').should('contain', "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.");
        cy.get('#questionBody').should('contain', 'diamond');
        cy.get('#questionBody').should('contain', 'Jan 10, 2023');
        cy.get('#questionBody').should('contain', '11:24:30');
    })

    it('Answer Page displays expected answers', () => {
        const answers = ["React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.", "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router."];
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.answerText').each(($el, index) => {
            cy.wrap($el).should('contain', answers[index]);
        });
    })

    it('Answer Page displays expected authors', () => {
        const authors = ['kate', 'viscount'];
        const date = ['Nov 20','Nov 23'];
        const times = ['3:24:42','08:24:00'];
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.answerAuthor').each(($el, index) => {
            cy.wrap($el).should('contain', authors[index]);
            cy.wrap($el).should('contain', date[index]);
            cy.wrap($el).should('contain', times[index]);
        });
    })

    it('Answer Page displays comments on question', () => {
        const comments = ['This is comment xyz.', 'This is comment abc.'];
        const authors = ['kate', 'diamond'];
        const date = ['Nov 26', 'Jan 02'];
        const time = ['09:24:00', '07:19:00'];
        cy.visit('http://localhost:3000');
        cy.contains('android studio save string shared preference, start activity and load the saved string').click();
        cy.get('.question_end .comment').each(($el, index) => {
            cy.wrap($el).should('contain', comments[index]);
            cy.wrap($el).should('contain', authors[index]);
            cy.wrap($el).should('contain', date[index]);
            cy.wrap($el).should('contain', time[index]);
        });
    })

    it('Answer Page displays error when guest comments on question', () => {
        cy.visit('http://localhost:3000');
        cy.contains('android studio save string shared preference, start activity and load the saved string').click();
        cy.get('.question_end .comment_input').type("This is comment 1");
        cy.get('.question_end .add_comment_button').click();
        cy.contains('Please login to comment on this question.');
    })

    it('Answer Page displays comments on answer', () => {
        const comments = ['This is comment xyz.', 'This is comment abc.', 'This is comment abc.', 'This is comment lmnop.', 'This is comment abc.', 'This is comment xyz.'];
        const authors = ['kate', 'diamond', 'diamond', 'viscount', 'diamond', 'kate'];
        const date = ['Nov 26', 'Jan 02', 'Jan 02', 'Mar 19', 'Jan 02', 'Nov 26'];
        const time = ['09:24:00', '07:19:00', '07:19:00', '02:27:00', '07:19:00', '09:24:00'];
        cy.visit('http://localhost:3000');
        cy.contains('android studio save string shared preference, start activity and load the saved string').click();
        cy.get('.answer_section .comment').each(($el, index) => {
            cy.wrap($el).should('contain', comments[index]);
            cy.wrap($el).should('contain', authors[index]);
            cy.wrap($el).should('contain', date[index]);
            cy.wrap($el).should('contain', time[index]);
        });
    })

    it('Answer Page displays error when guest comments on answer', () => {
        cy.visit('http://localhost:3000');
        const comments = ['This is comment 1', 'This is comment 2', 'This is comment 3'];
        cy.contains('android studio save string shared preference, start activity and load the saved string').click();
        cy.get('.answer_section .comment_input').each(($el, index) => {
            cy.wrap($el).type(comments[index]);
        });
        cy.get('.answer_section .add_comment_button').each(($el, index) => {
            cy.wrap($el).click();
        });
        cy.contains('Please login to comment on this answer.');
    })

    it('Answer Page displays votes on question', () => {
        cy.visit('http://localhost:3000');
        cy.contains('android studio save string shared preference, start activity and load the saved string').click();
        cy.get('.question_end .voteCount').should('contain', '30 votes');
    })

    it('Answer Page displays votes on answer', () => {
        const votes = ['11 votes', '1 votes', '0 votes'];
        cy.visit('http://localhost:3000');
        cy.contains('android studio save string shared preference, start activity and load the saved string').click();
        cy.get('.answer_section .voteCount').each(($el, index) => {
            cy.wrap($el).should('contain', votes[index]);
        });
    })

    it('Answer Page displays Answer Question button', () => {
        cy.visit('http://localhost:3000');
        cy.contains('android studio save string shared preference, start activity and load the saved string').click();
        cy.get('.ansButton').should('contain', 'Answer Question');
    })

})

describe('Answer Page with Login User', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('kate');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
    })
    
    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    })

    it('Answer Page displays expected header', () => {
        cy.contains('Programmatically navigate using React router').click();
        cy.get('#answersHeader').should('contain', 'Programmatically navigate using React router');
        cy.get('#answersHeader').should('contain', '2 answers');
        cy.get('#answersHeader').should('contain', 'Ask a Question');
        cy.get('#sideBarNav').should('contain', 'Questions');
        cy.get('#sideBarNav').should('contain', 'Tags');
        cy.get('#sideBarNav').should('contain', 'Profile');
        cy.get('#sideBarNav').should('contain', 'Logout');
        cy.contains('Ask a Question').click();
        cy.contains('Question Title');
    })

    it('Answer Page displays new comment when user comments on question', () => {
        const comments = ['This is new comment 1', 'This is comment lmnop.', 'This is comment abc.'];
        const authors = ['kate', 'viscount', 'diamond'];
        const date = ['0 seconds ago', 'Mar 19', 'Jan 02'];
        const time = ['0 seconds ago', '02:27:00', '07:19:00'];
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.question_end .comment_input').type("This is new comment 1");
        cy.get('.question_end .add_comment_button').click();
        cy.get('.question_end .comment').each(($el, index) => {
            cy.wrap($el).should('contain', comments[index]);
            cy.wrap($el).should('contain', authors[index]);
            cy.wrap($el).should('contain', date[index]);
            cy.wrap($el).should('contain', time[index]);
        });
    })

    it('Answer Page displays new comment when user comments on answer', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.answer_section .comment_input').type('This is new comment 1');
        cy.get('.answer_section .add_comment_button').click();
        cy.get('.answer_section .comment').should('contain', 'This is new comment 1');
    })

    it('Answer Page user upvotes on question', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.question_end .voteCount').should('contain', '15 votes');
        cy.contains('↑').click();
        cy.get('.question_end .voteCount').should('contain', '16 votes');
    })

    it('Answer Page user downvotes on question', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.question_end .voteCount').should('contain', '15 votes');
        cy.contains('↓').click();
        cy.get('.question_end .voteCount').should('contain', '14 votes');
    })

    it('Answer Page user un-upvotes on question', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.question_end .voteCount').should('contain', '15 votes');
        cy.contains('↑').click();
        cy.get('.question_end .voteCount').should('contain', '16 votes');
        cy.contains('↑').click();
        cy.get('.question_end .voteCount').should('contain', '15 votes');
    })

    it('Answer Page user un-downvotes on question', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.question_end .voteCount').should('contain', '15 votes');
        cy.contains('↓').click();
        cy.get('.question_end .voteCount').should('contain', '14 votes');
        cy.contains('↓').click();
        cy.get('.question_end .voteCount').should('contain', '15 votes');
    })

    it('Answer Page user upvotes then downvotes on question', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.question_end .voteCount').should('contain', '15 votes');
        cy.contains('↑').click();
        cy.get('.question_end .voteCount').should('contain', '16 votes');
        cy.contains('↓').click();
        cy.get('.question_end .voteCount').should('contain', '15 votes');
        cy.contains('↓').click();
        cy.get('.question_end .voteCount').should('contain', '14 votes');
    })

    it('Answer Page user downvotes then upvotes on question', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.question_end .voteCount').should('contain', '15 votes');
        cy.contains('↓').click();
        cy.get('.question_end .voteCount').should('contain', '14 votes');
        cy.contains('↑').click();
        cy.get('.question_end .voteCount').should('contain', '15 votes');
        cy.contains('↑').click();
        cy.get('.question_end .voteCount').should('contain', '16 votes');
    })

    it('Answer Page user upvotes on answer', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.answer_section .voteCount').should('contain', '2 votes');
        cy.get('.answer_section .voteBtn').contains('↑').click();
        cy.get('.answer_section .voteCount').should('contain', '3 votes');
    })

    it('Answer Page user downvotes on answer', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.answer_section .voteCount').should('contain', '2 votes');
        cy.get('.answer_section .voteBtn').contains('↓').click();
        cy.get('.answer_section .voteCount').should('contain', '1 votes');
    })

    it('Answer Page user up-upvotes on answer', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.answer_section .voteCount').should('contain', '2 votes');
        cy.get('.answer_section .voteBtn').contains('↑').click();
        cy.get('.answer_section .voteCount').should('contain', '3 votes');
        cy.get('.answer_section .voteBtn').contains('↑').click();
        cy.get('.answer_section .voteCount').should('contain', '2 votes');
    })

    it('Answer Page user un-downvotes on answer', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.answer_section .voteCount').should('contain', '2 votes');
        cy.get('.answer_section .voteBtn').contains('↓').click();
        cy.get('.answer_section .voteCount').should('contain', '1 votes');
        cy.get('.answer_section .voteBtn').contains('↓').click();
        cy.get('.answer_section .voteCount').should('contain', '2 votes');
    })

    it('Answer Page user upvotes then downvotes on answer', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.answer_section .voteCount').should('contain', '2 votes');
        cy.get('.answer_section .voteBtn').contains('↑').click();
        cy.get('.answer_section .voteCount').should('contain', '3 votes');
        cy.get('.answer_section .voteBtn').contains('↓').click();
        cy.get('.answer_section .voteCount').should('contain', '2 votes');
        cy.get('.answer_section .voteBtn').contains('↓').click();
        cy.get('.answer_section .voteCount').should('contain', '1 votes');
    })

    it('Answer Page user downvotes then upvotes on answer', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.answer_section .voteCount').should('contain', '2 votes');
        cy.get('.answer_section .voteBtn').contains('↓').click();
        cy.get('.answer_section .voteCount').should('contain', '1 votes');
        cy.get('.answer_section .voteBtn').contains('↑').click();
        cy.get('.answer_section .voteCount').should('contain', '2 votes');
        cy.get('.answer_section .voteBtn').contains('↑').click();
        cy.get('.answer_section .voteCount').should('contain', '3 votes');
    })

    it('Answer Page user reports question', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.question_end .reportBtn').should('contain', 'Report');
        cy.get('.question_end .reportBtn').click();
        cy.get('.question_end .reportBtn').should('contain', 'Reported');
    })

    it('Answer Page user reports answer', () => {
        cy.contains('Quick question about storage on android').click();
        cy.get('.answer_section .reportBtn').should('contain', 'Report');
        cy.get('.answer_section .reportBtn').click();
        cy.get('.answer_section .reportBtn').should('contain', 'Reported');
    })

})


describe('Answer Page with Admin User', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('#formUsernameInput').type('queen');
        cy.get('#formPasswordInput').type('1234');
        cy.get('.form_postBtn').click();
    })
    
    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    })

    it('Answer Page displays delete button for reported questions', () => {
        cy.contains('Reported Questions').click();
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.question_end .reportBtn').should('contain', 'Reported');
        cy.get('.question_end .deleteBtn').should('contain', 'Delete Question');
        cy.get('.question_end .deleteBtn').click();
        cy.contains('0 questions');
        cy.contains('Newest').click();
        cy.contains('3 questions');
    })

    it('Answer Page displays delete button for reported answers', () => {
        cy.contains('Reported Answers').click();
        cy.contains('Object storage for a web application').click();
        cy.get('.question_end .reportBtn').should('contain', 'Report');
        cy.get('.answer_section .reportBtn').should('contain', 'Reported');
        cy.get('.answer_section .deleteBtn').should('contain', 'Delete Answer');
        cy.get('.answer_section .deleteBtn').click();
        cy.contains('Object storage for a web application');
        cy.contains('1 answers');
    })
})