import AnswerPage from '../../src/components/main/answerPage/index';

describe('AnswerPage Component', () => {
    const qid = 'questionId'
    const question = {
        title: 'Sample Question Title',
        answers: [
            {
                _id: 'answerId1',
                text: 'Sample answer text 1',
                ans_by: {
                    user_name: 'user1'
                },
                ans_date_time: new Date(),
                voteCount: 5,
                reported: false,
                comments: [
                    {
                        text: 'Sample comment 1',
                        comment_by: {
                            user_name: 'commentUser1'
                        },
                        comment_date_time: new Date()
                    }
                ]
            },
            {
                _id: 'answerId2',
                text: 'Sample answer text 2',
                ans_by: {
                    user_name: 'user2'
                },
                ans_date_time: new Date(),
                voteCount: 10,
                reported: false,
                comments: [
                    {
                        text: 'Sample comment 2',
                        comment_by: {
                            user_name: 'commentUser2'
                        },
                        comment_date_time: new Date()
                    }
                ]
            }
        ]
    }
    const currentUser = { role: 'REGISTERED' }

    it('displays answer header', () => {
        cy.mount(<AnswerPage/>)
        cy.get('#answersHeader').should('exist')
    })

    it('displays question section', () => {
        cy.mount(<AnswerPage/>)
        cy.get('.question_end').should('exist')
    })

    it('displays answers', () => {
        cy.stub(AnswerPage, 'getQuestionById').resolves(question)
        cy.mount(<AnswerPage/>)
        cy.get('.answer_section').should('have.length', question.answers.length)
    })

    it('calls handleNewAnswer when "Answer Question" button is clicked', () => {
        const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy')
        const handleNewAnswerSpy = cy.spy().as('handleNewAnswerSpy')
        const handleQuestionsSpy = cy.spy().as('handleQuestionsSpy')
        cy.stub(AnswerPage, 'getQuestionById').resolves(question)
        cy.mount(
            <AnswerPage
                qid={qid}
                handleNewQuestion={handleNewQuestionSpy}
                handleNewAnswer={handleNewAnswerSpy}
                currentUser={currentUser}
                handleQuestions={handleQuestionsSpy}
            />
        )
        cy.get('.ansButton').click().then(() => {
            expect(handleNewAnswerSpy).to.be.calledOnce
        })
    })
})
