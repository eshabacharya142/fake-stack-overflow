# Final Team Project for CS5500

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/ETUqq9jqZolOr0U4v-gexHkBbCTAoYgTx7cUc34ds2wrTA?e=URQpeI).

## List of features

All the features you have implemented. 

| Feature           | Description                   | E2E Tests            | Component Tests              | Jest Tests                         
|-------------------|-------------------------------|----------------------|------------------------------|------------------------------------
| View post         | Users must be able to view posts as a Questions List. When user clicks on a Question, coressponding answers and related information is displayed.           | client/cypress/e2e/home.cy.js, client/cypress/e2e/answer.cy.js  | client/cypress/component/question_page.cy.js, client/cypress/component/question_section.cy.js, client/cypress/component/answer_page.cy.js, client/cypress/component/answer_section.cy.js, client/cypress/component/answer_components.cy.js    | server/tests/question.test.js          
| Create post(Q&A)  | Users must be able to create or post new question or new answer on the website.              | client/cypress/e2e/newquestion.cy.js, client/cypress/e2e/newanswer.cy.js   | client/cypress/component/new_question.cy.js, client/cypress/component/new_answer.cy.js    | server/tests/newQuestion.test.js, server/tests/newAnswer.test.js       
| Search post       | Users must be able to search for posts by entering search keywords/tags in search bar. | client/cypress/e2e/search.cy.js  | client/cypress/component/header.cy.js    | server/tests/question.test.js  
| Tag post          | Users should be able to tag Questions with relevant keywords for easy search/categorization.     | client/cypress/e2e/tags.cy.js  | client/cypress/component/tag_page.cy.js    | server/tests/tags.test.js       
| Vote              | Users should be able to upvote or downvote Question and Answer.           | client/cypress/e2e/answer.cy.js  | client/cypress/component/vote_component.cy.js, client/cypress/component/answer_section.cy.js, client/cypress/component/question_section.cy.js, client/cypress/component/question_page.cy.js    | server/tests/vote.test.js          
| Comment           | Users must be able to add/post comments on Questions and Answers.              | client/cypress/e2e/answer.cy.js  | client/cypress/component/answer_components.cy.js, client/cypress/component/answer_section.cy.js,  client/cypress/component/question_section.cy.js    | server/tests/comment.test.js      
| Post Moderation   | Admin users must be able to delete Questions and Answers reported by Registered user. | client/cypress/e2e/answer.cy.js, client/cypress/e2e/home.cy.js  | client/cypress/component/vote_component.cy.js     | server/tests/postModeration.test.js
| User Profiles     | Users must have individual profiles (guest, admin, registered type). Registered and Admin users can register, login and view their own profile.       | client/cypress/e2e/register.cy.js, client/cypress/e2e/login.cy.js, client/cypress/e2e/profile.cy.js  | client/cypress/component/register_page.cy.js, client/cypress/component/login_page.cy.js, client/cypress/component/profile_page.cy.js    | server/tests/session.test.js       
. . .

## Instructions to generate and view coverage report 

Please follow the below instructions to check jest coverage:
1. Go to the root project directory
2. Run: cd server
3. Run: jest --collect-coverage  

Jest coverage checked :

|File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
|----------------------|---------|----------|---------|---------|-------------------
| All files            |   99.78 |    97.85 |   98.03 |     100 |                   
| server               |     100 |      100 |     100 |     100 |                   
|  server.js           |     100 |      100 |     100 |     100 |                   
| server/controller    |     100 |       97 |     100 |     100 |                   
|  answer.js           |     100 |      100 |     100 |     100 |                   
|  comment.js          |     100 |      100 |     100 |     100 |                   
|  question.js         |     100 |      100 |     100 |     100 |                   
|  tag.js              |     100 |      100 |     100 |     100 |                   
|  user.js             |     100 |      100 |     100 |     100 |                   
|  vote.js             |     100 |    94.82 |     100 |     100 | 29,130,139        
| server/models        |     100 |      100 |     100 |     100 |                   
|  answers.js          |     100 |      100 |     100 |     100 |                   
|  comments.js         |     100 |      100 |     100 |     100 |                   
|  questions.js        |     100 |      100 |     100 |     100 |                   
|  tags.js             |     100 |      100 |     100 |     100 |                   
|  users.js            |     100 |      100 |     100 |     100 |                   
| server/models/schema |     100 |      100 |     100 |     100 |                   
|  answer.js           |     100 |      100 |     100 |     100 |                   
|  comment.js          |     100 |      100 |     100 |     100 |                   
|  question.js         |     100 |      100 |     100 |     100 |                   
|  tag.js              |     100 |      100 |     100 |     100 |                   
|  user.js             |     100 |      100 |     100 |     100 |                   
| server/utils         |   98.83 |      100 |   96.29 |     100 |                   
|  question.js         |   98.83 |      100 |   96.29 |     100 |                   


Please follow the below instructions to check cypress e2e coverage:
1. Go to the root project directory
2. Run: cd client
3. Run: npx nyc report --reporter=text-summary

Cypress e2e coverage checked :

Coverage summary
1. Statements => 92.64% ( 466/503 )
2. Branches => 83.25% ( 184/221 )
3. Functions => 96.74% ( 119/123 )
4. Lines => 93.18% ( 465/499 )


## Endpoints and other instructions

server - http://localhost:8000
client - http://localhost:3000

If you want to populate the database, please run following commands - 
1. node server/remove_db.js "mongodb://127.0.0.1:27017/fake_so" 
2. node server/populate_db.js "mongodb://127.0.0.1:27017/fake_so"

Commands to check ESLint on client -
1. cd client
2. npx eslint src/  

Commands to check ESLint on server -
1. cd server
2. npx eslint controller/ 
3. npx eslint models/ 
4. npx eslint tests/ 
5. npx eslint utils/ 
6. npx eslint server.js/

Commands to run tests -
1. Component tests => npx cypress run --component
2. E2E tests => npx cypress run
3. Jest tests => npm test tests/

## Extra Credit Section (if applicable)
