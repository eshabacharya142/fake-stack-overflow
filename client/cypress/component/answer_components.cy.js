import AnswerHeader from '../../src/components/main/answerPage/header';
import QuestionBody from '../../src/components/main/answerPage/questionBody';
import Answer from '../../src/components/main/answerPage/answer';
import Comment from '../../src/components/main/answerPage/comment';
import CommentSection from '../../src/components/main/answerPage/commentSection';


it('AnswerHeader - shows question title, answer count and onclick function', () => {
    const answerCount = 3;
    const title = 'android studio save string shared preference, start activity and load the saved string';
    const handleNewQuestion = cy.spy().as('handleNewQuestionSpy');
    
    cy.mount(<AnswerHeader
        ansCount={answerCount} 
        title={title}
        handleNewQuestion={handleNewQuestion}/>);
    cy.get('.bold_title').contains(answerCount + " answers");
    cy.get('.answer_question_title').contains(title);
    cy.get('.bluebtn').click();
    cy.get('@handleNewQuestionSpy').should('have.been.called');
})

it('QuestionBody - should have a question body which shows question text, views, asked by and asked', () => {
    const questionBody = 'Sample Question Body'
    const views = '150'
    const askedBy = 'johndoe'
    const date = new Date().toLocaleString()
    cy.mount(<QuestionBody 
        text={questionBody}
        views={views} 
        askby={askedBy}
        meta={date}
        />)
    cy.get('.answer_question_text > div').contains(questionBody)
    cy.get('.answer_question_view').contains(views + ' views')
    cy.get('.answer_question_right > .question_author').contains(askedBy)
    cy.get('.answer_question_right > .answer_question_meta').contains('asked ' + date)  
})

it('Answer - component should have a answer text ,answered by and answered date', () => {
    const answerText = 'Sample Answer Text'
    const answeredBy = 'joydeepmitra'
    const date = new Date().toLocaleString()
    cy.mount(<Answer 
        text={answerText}
        ansBy={answeredBy}
        meta={date}
        />)
    cy.get('.answerText').contains(answerText)
    cy.get('.answerAuthor > .answer_author').contains(answeredBy)
    cy.get('.answerAuthor > .answer_question_meta').contains(date) 
})

it('Comment - displays the comment text, author, date', () => {
    cy.mount(
        <Comment 
            text="Sample comment text" 
            commentBy="johndoe" 
            meta="asked 10 seconds ago" 
        />
    )
    cy.contains('Sample comment text')
    cy.contains('.comment_author', 'johndoe')
    cy.contains('.comment_question_meta', 'asked 10 seconds ago')
})

it('Comment - displays all the comments', () => {
    const comments = [
        {
            text: 'This is the first comment.',
            comment_by: { user_name: 'johndoe' },
            comment_date_time: new Date().toISOString()
        },
        {
            text: 'This is the second comment.',
            comment_by: { user_name: 'janedoe' },
            comment_date_time: new Date().toISOString()
        }
    ]
    cy.mount(<CommentSection comments={comments} />)
    cy.get('.comments_end .comment').should('have.length', 2)
    cy.get('.comments_end .comment')
            .eq(0)
            .should('contain.text', 'This is the first comment.')
            .and('contain.text', 'johndoe')
            .and('contain.text', 'ago')
    cy.get('.comments_end .comment')
            .eq(1)
            .should('contain.text', 'This is the second comment.')
            .and('contain.text', 'janedoe')
            .and('contain.text', 'ago')
})


