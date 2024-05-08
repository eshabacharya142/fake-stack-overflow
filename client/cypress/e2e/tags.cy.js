describe('All Tags', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    })
    
    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    })

    it('Total Tag Count', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Tags').click();
        cy.contains('All Tags');
        cy.contains('7 Tags');
        cy.contains('Ask a Question');
    })

    it('Tag names and count', () => {
        const tagNames = ['react', 'javascript', 'android-studio', 'shared-preferences', 'storage', 'website', 'Flutter'];
        const tagCounts = ['1 questions', '2 questions', '2 questions', '2 questions', '2 questions', '1 questions', '0 questions'];
        cy.visit('http://localhost:3000');
        cy.contains('Tags').click();
        cy.get('.tagNode').each(($el, index, $list) => {
            cy.wrap($el).should('contain', tagNames[index]);
            cy.wrap($el).should('contain', tagCounts[index]);
        })
    })

    it('Click Tag Name', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Tags').click();
        cy.contains('react').click();
        cy.contains('Programmatically navigate using React router');
        cy.contains('2 answers');
        cy.contains('10 views');
        cy.contains('kate');
        cy.contains('Jan 20, 2022');
        cy.contains('03:00:00');
    })

})