describe('Home Page', () => {

  beforeEach(() => {
    cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
  })

  afterEach(() => {
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
  })

  it('successfully shows All Questions string', () => {
      cy.visit('http://localhost:3000');
      cy.contains('All Questions');
  })

  it('successfully shows Ask a Question button', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Ask a Question');
  })

  it('successfully shows total questions number', () => {
    cy.visit('http://localhost:3000');
    cy.contains('4 questions');
  })

  it('successfully shows filter buttons', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Newest');
    cy.contains('Active');
    cy.contains('Unanswered');
  })

  it('successfully shows menu items', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Questions');
    cy.contains('Tags');
  })

  it('successfully shows search bar', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar');
  })

  it('successfully shows page title', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Fake Stack Overflow');
  })

  it('successfully shows all questions in model', () => {
    const qTitles = ['Quick question about storage on android', 'Object storage for a web application', 'android studio save string shared preference, start activity and load the saved string', 'Programmatically navigate using React router'];
    cy.visit('http://localhost:3000');
    cy.get('.postTitle').each(($el, index, $list) => {
        cy.wrap($el).should('contain', qTitles[index]);
    })
  })

  it('successfully shows all question stats', () => {
    const answers = ['1 answers', '2 answers', '3 answers','2 answers'];
    const views = ['103 views', '200 views', '121 views','10 views'];
    cy.visit('http://localhost:3000');
    cy.get('.postStats').each(($el, index, $list) => {
        cy.wrap($el).should('contain', answers[index]);
        cy.wrap($el).should('contain', views[index]);
    })
  })

  it('successfully shows all question authors and date time', () => {
    const authors = ['viscount', 'simon', 'diamond', 'kate'];
    const date = ['Mar 10, 2023', 'Feb 18, 2023', 'Jan 10, 2023', 'Jan 20, 2022'];
    const times = ['14:28:01', '01:02:15', '11:24:30', '03:00:00'];
    cy.visit('http://localhost:3000');
    cy.get('.lastActivity').each(($el, index, $list) => {
        cy.wrap($el).should('contain', authors[index]);
        cy.wrap($el).should('contain', date[index]);
        cy.wrap($el).should('contain', times[index]);
    })
  })
  
  it('successfully shows all question votes', () => {
    const votes = ['15 votes', '10 votes', '30 votes', '12 votes']
    cy.visit('http://localhost:3000');
    cy.get('.voteCount').each(($el, index, $list) => {
        cy.wrap($el).should('contain', votes[index]); 
    })
  })

  it('successfully shows all questions containing selected tag', () => {
    cy.visit('http://localhost:3000');
    cy.get('.question_tag_button').contains('storage').click();
    cy.get('.bold_title').contains('storage');
    cy.contains('2 questions');
    cy.contains('Quick question about storage on android');
    cy.contains('Object storage for a web application');

  })

  it('successfully shows all questions in model in active order', () => {
    const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Quick question about storage on android', 'Object storage for a web application'];
    cy.visit('http://localhost:3000');
    cy.contains('Active').click();
    cy.get('.postTitle').each(($el, index, $list) => {
        cy.wrap($el).should('contain', qTitles[index]);
    })
  })

  it('successfully shows all unanswered questions in model', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Unanswered').click();
    cy.contains('0 questions');
  })

  it('successfully highlights "Questions" link when on the home page', () => {
    cy.visit('http://localhost:3000');
    cy.get('.sideBarNav').contains('Questions').should('have.css', 'background-color', 'rgb(204, 204, 204)');
  })

  it('successfully highlights "Tags" link when on the Tags page', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Tags').click();
    cy.get('.sideBarNav').contains('Tags').should('have.css', 'background-color', 'rgb(204, 204, 204)');
  })

  it('successfully highlights "Login" link when on the Login page', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Login').click();
    cy.get('.sideBarNav').contains('Login').should('have.css', 'background-color', 'rgb(204, 204, 204)');
  })

  it('successfully highlights "Register" link when on the Register page', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Register').click();
    cy.get('.sideBarNav').contains('Register').should('have.css', 'background-color', 'rgb(204, 204, 204)');
  })

  it('successfully highlights "Profile" link when on the Profile page after login', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Login').click();
    cy.get('#formUsernameInput').type('kate');
    cy.get('#formPasswordInput').type('1234');
    cy.get('.form_postBtn').click();
    cy.contains('Profile').click();
    cy.get('.sideBarNav').contains('Profile').should('have.css', 'background-color', 'rgb(204, 204, 204)');
  })

  it('successfully highlights "Questions" link after Logout if logged in already', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Login').click();
    cy.get('#formUsernameInput').type('kate');
    cy.get('#formPasswordInput').type('1234');
    cy.get('.form_postBtn').click();
    cy.contains('Logout').click();
    cy.get('.sideBarNav').contains('Questions').should('have.css', 'background-color', 'rgb(204, 204, 204)');
  })

  it('successfully shows all reported questions when logged in as admin', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Login').click();
    cy.get('#formUsernameInput').type('queen');
    cy.get('#formPasswordInput').type('1234');
    cy.get('.form_postBtn').click();
    cy.contains('Reported Questions').click();
    cy.get('.postTitle').should('contain', 'Programmatically navigate using React router');
  })

  it('successfully shows all questions with reported answers when logged in as admin', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Login').click();
    cy.get('#formUsernameInput').type('queen');
    cy.get('#formPasswordInput').type('1234');
    cy.get('.form_postBtn').click();
    cy.contains('Reported Answers').click();
    cy.get('.postTitle').should('contain', 'Object storage for a web application');
  })

})
