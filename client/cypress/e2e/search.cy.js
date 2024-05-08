describe('Search', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    })
    
    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    })

    it('Search string in question text', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('navigation{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('Search string matches tag and text', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string', 'Programmatically navigate using React router'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('navigation [React]{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('Output of the search should be in newest order by default', () => {
        const qTitles = ['Quick question about storage on android', 'android studio save string shared preference, start activity and load the saved string', 'Programmatically navigate using React router'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('android [react]{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        });
    })

    it('Output of the search should show number of results found', () => {
        const qTitles = ['Quick question about storage on android', 'Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('android [react]{enter}');
        cy.contains(qTitles.length+" questions");
    })

    it('Output of the empty search should show all results ', () => {
        const qTitles = ['Quick question about storage on android', 'Object storage for a web application', 'Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('{enter}');
        cy.contains(qTitles.length+" questions");
    })

    it('Search string with non-existing tag and non-tag word', () => {
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('[NonExistingTag] nonexistingword{enter}');
        cy.contains('No Questions Found');
    })

    it('Search string with case-insensitive matching', () => {
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('AnDrOiD{enter}');
        cy.contains('android');
    })

})