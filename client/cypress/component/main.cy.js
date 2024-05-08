import React from 'react'
import Main from '../../src/components/main'

describe('Main Component', () => {
    const currentUser = { username: 'testUser', role: 'REGISTERED' };

    it('displays QuestionPage by default', () => {
        cy.mount(<Main title="Test Title"/>)
        cy.get('.right_main').contains('Test Title').should('exist')
    });

    it('displays TagPage when Tags button is clicked', () => {
        cy.mount(<Main title="Test Title"/>)
        cy.get('#menu_tag').click()
        cy.get('.right_main').contains('Tags').should('exist')
    });

    it('displays LoginPage when Login button is clicked', () => {
        cy.mount(<Main title="Test Title"/>)
        cy.get('#menu_login').click()
        cy.get('.right_main').contains('Login').should('exist')
    });

    it('displays RegisterPage when Register button is clicked', () => {
        cy.mount(<Main title="Test Title"/>)
        cy.get('#menu_register').click()
        cy.get('.right_main').contains('Register').should('exist')
    });

    it('calls handleQuestions and displays QuestionPage when Questions button is clicked', () => {
        const setQuestionPage = cy.spy().as('setQuestionPage');
        cy.mount(
            <Main title="Test Title" setQuesitonPage={setQuestionPage}/>
        );
        cy.get('#menu_question').click().then(() => {
            expect(setQuestionPage).to.be.calledOnce;
        });
        cy.get('.right_main').contains('Test Title').should('exist');
    });

});
