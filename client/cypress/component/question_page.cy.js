import QuestionHeader from '../../src/components/main/questionPage/header/index'
import OrderButton from '../../src/components/main/questionPage/header/orderButton/index'
import Question from '../../src/components/main/questionPage/question/index'
import QuestionPage from '../../src/components/main/questionPage'


it('OrderButton - rendering order button', () => {
    const message = 'Test Message'
    const setQuestionOrderSpy = cy.spy('').as('setQuestionOrderSpy')
    
    cy.mount(<OrderButton 
        message={message} 
        setQuestionOrder={setQuestionOrderSpy}/>)
     cy.get('.btn').click()
     cy.get('@setQuestionOrderSpy').should('have.been.calledWith', message)

})

it('QuestionHeader - rendering question header when current user is registered/guest', () => {
    const title = 'Sample Title'
    const count = 1
    const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy')
    const setQuestionOrderSpy = cy.spy().as('setQuestionOrderSpy')
    
    cy.mount(<QuestionHeader 
        title_text={title} 
        qcnt = {count}
        setQuestionOrder={setQuestionOrderSpy}
        handleNewQuestion={handleNewQuestionSpy}
        currentUser={{role : 'REGISTERED'}}/>)

    cy.get('.bold_title').contains(title)
    cy.get('.bluebtn').click()
    cy.get('@handleNewQuestionSpy').should('have.been.called')
    cy.get('#question_count').contains(count + ' questions')
    cy.get('.btns .btn').eq(0).should('have.text', 'Newest')
    cy.get('.btns .btn').eq(1).should('have.text', 'Active')
    cy.get('.btns .btn').eq(2).should('have.text', 'Unanswered')
    cy.get('.btns .btn').each(($el) => {
        cy.wrap($el).click();
        cy.get('@setQuestionOrderSpy').should('have.been.calledWith', $el.text())
    })
})

it('QuestionHeader - rendering question header when current user is admin', () => {
    const title = 'Sample Title'
    const count = 1
    const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy')
    const setQuestionOrderSpy = cy.spy().as('setQuestionOrderSpy')
    
    cy.mount(<QuestionHeader 
        title_text={title} 
        qcnt = {count}
        setQuestionOrder={setQuestionOrderSpy}
        handleNewQuestion={handleNewQuestionSpy}
        currentUser={{ role : 'ADMIN'}}/>)

    cy.get('.bold_title').contains(title)
    cy.get('.bluebtn').click()
    cy.get('@handleNewQuestionSpy').should('have.been.called')
    cy.get('#question_count').contains(count + ' questions')
    cy.get('.btns .btn').eq(0).should('have.text', 'Newest')
    cy.get('.btns .btn').eq(1).should('have.text', 'Active')
    cy.get('.btns .btn').eq(2).should('have.text', 'Unanswered')
    cy.get('.btns .btn').eq(3).should('have.text', 'Reported Questions')
    cy.get('.btns .btn').eq(4).should('have.text', 'Reported Answers')
    cy.get('.btns .btn').each(($el) => {
        cy.wrap($el).click();
        cy.get('@setQuestionOrderSpy').should('have.been.calledWith', $el.text())
    })
})

it('Question - renders question title, tags, author, meta, and vote count correctly', () => {
    const q = {
        _id: '1',
        title: 'Sample Question',
        answers: [],
        views: 10,
        tags: [{ name: 'tag1' }, { name: 'tag2' }],
        asked_by: { user_name: 'user1' },
        ask_date_time: new Date().toISOString(),
        voteCount: 5
    }
    cy.mount(<Question q={q} clickTag={() => {}} handleAnswer={() => {}} />)
    cy.contains('.postStats div', '0 answers')
    cy.contains('.postStats div', '10 views')
    cy.contains('.postTitle', 'Sample Question')
    cy.contains('.question_tag_button', 'tag1')
    cy.contains('.question_tag_button', 'tag2')
    cy.contains('.question_author', 'user1')
    cy.contains('.question_meta', 'asked 0 seconds ago')
    cy.contains('.voteCount', '5 votes')
})

it('Question - triggers handleAnswer function when question is clicked', () => {
    const q = {
        _id: '1',
        title: 'Sample Question',
        answers: [],
        views: 10,
        tags: [{ name: 'tag1' }, { name: 'tag2' }],
        asked_by: { user_name: 'user1' },
        ask_date_time: new Date().toISOString(),
        voteCount: 5
    }
    const handleAnswerSpy = cy.spy().as('handleAnswerSpy')
    cy.mount(<Question q={q} clickTag={() => {}} handleAnswer={handleAnswerSpy} />)
    cy.get('.question').click()
    cy.get('@handleAnswerSpy').should('have.been.calledOnceWith', '1')
})

it('Question - triggers clickTag function when tag button is clicked', () => {
    const q = {
        _id: '1',
        title: 'Sample Question',
        answers: [],
        views: 10,
        tags: [{ name: 'tag1' }, { name: 'tag2' }],
        asked_by: { user_name: 'user1' },
        ask_date_time: new Date().toISOString(),
        voteCount: 5
    }
    const clickTagSpy = cy.spy().as('clickTagSpy')
    cy.mount(<Question q={q} clickTag={clickTagSpy} handleAnswer={() => {}} />)
    cy.contains('.question_tag_button', 'tag1').click()
    cy.get('@clickTagSpy').should('have.been.calledOnceWith', 'tag1')
})

it('QuestionPage - renders question page with correct title and questions', () => {
    const mockQuestions = [
        {
            _id: '1',
            title: 'Question 1',
            answers: [],
            views: 10,
            tags: [{ name: 'tag1' }],
            asked_by: { user_name: 'user1' },
            ask_date_time: new Date().toISOString(),
            voteCount: 5
        },
        {
            _id: '2',
            title: 'Question 2',
            answers: [],
            views: 15,
            tags: [{ name: 'tag2' }],
            asked_by: { user_name: 'user2' },
            ask_date_time: new Date().toISOString(),
            voteCount: 8
        }
    ]
    cy.stub(QuestionPage, 'getQuestionsByFilter').resolves(mockQuestions)
    cy.mount(
        <QuestionPage
            title_text="All Questions"
        />
    )
    cy.contains('.bold_title', 'All Questions')
    cy.get('.question').should('have.length', 2);
    cy.contains('.question', 'Question 1')
    cy.contains('.question', 'Question 2')
})

it('QuestionPage - triggers handleAnswer function when a question is clicked', () => {
    const mockQuestions = [
        {
            _id: '1',
            title: 'Question 1',
            answers: [],
            views: 10,
            tags: [{ name: 'tag1' }],
            asked_by: { user_name: 'user1' },
            ask_date_time: new Date().toISOString(),
            voteCount: 5
        },
        {
            _id: '2',
            title: 'Question 2',
            answers: [],
            views: 15,
            tags: [{ name: 'tag2' }],
            asked_by: { user_name: 'user2' },
            ask_date_time: new Date().toISOString(),
            voteCount: 8
        }
    ]
    cy.stub(QuestionPage, 'getQuestionsByFilter').resolves(mockQuestions)
    const handleAnswerSpy = cy.spy().as('handleAnswerSpy')
    cy.mount(
        <QuestionPage
            handleAnswer={handleAnswerSpy}
        />
    )
    cy.contains('.question', 'Question 1').click().then(() => {
        expect(handleAnswerSpy).to.be.calledOnce;
    })
})

it('QuestionPage - renders no questions found message when question list is empty', () => {
    cy.stub(QuestionPage, 'getQuestionsByFilter').resolves([])
    cy.mount(
        <QuestionPage
            title_text="All Questions"
            order="newest"
            search=""
        />
    )
    cy.contains('.bold_title', 'All Questions')
    cy.contains('#question_count', '0 questions')
})

it('QuestionPage - renders no questions found message for search results', () => {
    cy.stub(QuestionPage, 'getQuestionsByFilter').resolves([])
    cy.mount(
        <QuestionPage
            title_text="Search Results"
            order="newest"
            search="someSearchQuery"
        />
    )
    cy.contains('.bold_title', 'No Questions Found').should('be.visible')
})