import NewQuestion from '../../src/components/main/newQuestion/index';
import {addQuestion} from '../../src/services/questionService';

it('mounts', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTitleInput')
    cy.get('#formTextInput')
    cy.get('#formTagInput')
    cy.get('.form_postBtn')
})

it('shows title inputted by user', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTitleInput').should('have.value', '')
    cy.get('#formTitleInput').type('abc')
    cy.get('#formTitleInput').should('have.value', 'abc')
})

it('shows text inputted by user', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTextInput').should('have.value', '')
    cy.get('#formTextInput').type('abc')
    cy.get('#formTextInput').should('have.value', 'abc')
})

it('shows tags inputted by user', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTagInput').should('have.value', '')
    cy.get('#formTagInput').type('abc')
    cy.get('#formTagInput').should('have.value', 'abc')
})

it('shows error message when inputs are empty', () => {
    cy.mount(<NewQuestion/>)
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Title cannot be empty')
    cy.get('div .input_error').contains('Question text cannot be empty')
    cy.get('div .input_error').contains('Should have at least 1 tag')
})

it('shows error message when title is more than 100 characters', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTitleInput').type('a'.repeat(101))
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Title cannot be more than 100 characters')
})

it('shows error message when there are more than five tags', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTagInput').type('a b c d e f')
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Cannot have more than 5 tags')
})

it('shows error message when a tag is longer than 20 characters', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTagInput').type('a'.repeat(21))
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('New tag length cannot be more than 20')
})

it('addQuestion is called when click Post Question', () => {
    const addQuestionSpy = cy.spy(addQuestion);
    cy.stub(NewQuestion, 'addQuestion').callsFake(addQuestionSpy);
    cy.mount(<NewQuestion/>)
    cy.get('#formTitleInput').type('title1')
    cy.get('#formTextInput').type('question1')
    cy.get('#formTagInput').type('tag1 tag2')
    cy.get('.form_postBtn').click().then(() => {
        expect(addQuestionSpy).to.be.calledOnce;
    })
})

it('handleQuestion is called when click Post Question', () => {
    cy.stub(NewQuestion,'addQuestion').resolves({_id:'1', title:'title1', text: 'question1' })
    const handleQuestionsSpy = cy.spy().as('handleQuestionsSpy')
    cy.mount(<NewQuestion handleQuestions={handleQuestionsSpy} />)
    cy.get('#formTitleInput').type('title1')
    cy.get('#formTextInput').type('question1')
    cy.get('#formTagInput').type('tag1 tag2')
    cy.get('.form_postBtn').click().then(() => {
        expect(handleQuestionsSpy).to.be.calledOnce;
    })
})