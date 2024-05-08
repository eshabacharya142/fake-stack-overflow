import QuestionSection from "../../src/components/main/answerPage/questionSection";

describe('QuestionSection Component with Logged in User', () => {
    const qid = 'questionId'
    const question = {
        views: 20,
        text: 'Sample question text',
        asked_by: {
            user_name: 'sampleUser'
        },
        ask_date_time: new Date(),
        voteCount: 10,
        reported: false,
        comments: [
            {
                text: 'Sample comment',
                comment_by: {
                    user_name: 'commentUser'
                },
                comment_date_time: new Date()
            }
        ]
    }
    const currentUser = { role: 'REGISTERED' }

    beforeEach(() => {
        cy.stub(QuestionSection, 'addCommentQuestion').resolves()
        const reloadData = cy.stub().as('reloadData')
        cy.mount(
            <QuestionSection
                qid={qid}
                question={question}
                reloadData={reloadData}
                currentUser={currentUser}
                handleQuestions={() => {}}
            />
        )
    })

    it('displays question body', () => {
        cy.get('.questionBody').should('exist')
    })

    it('displays vote body', () => {
        cy.get('.voteBody').should('exist')
    })

    it('displays comment area', () => {
        cy.get('.comment_section').should('exist')
    })

    it('displays comments', () => {
        cy.get('.commentText').should('exist')
    })

    it('calls addCommentQuestion when comment is submitted', () => {
        const commentText = 'New comment text'
        cy.get('.comment_input').type(commentText)
        cy.get('.add_comment_button').click().then(() => {
            expect(QuestionSection.addCommentQuestion).to.be.calledOnceWith(qid, { text: commentText, comment_date_time: new Date() })
        })
    })
})

it('displays alert box when comment is submitted without login', () => {
    const qid = 'questionId'
    const question = {
        views: 20,
        text: 'Sample question text',
        asked_by: {
            user_name: 'sampleUser'
        },
        ask_date_time: new Date(),
        voteCount: 10,
        reported: false,
        comments: [
            {
                text: 'Sample comment',
                comment_by: {
                    user_name: 'commentUser'
                },
                comment_date_time: new Date()
            }
        ]
    }
    const currentUser = null
    cy.stub(QuestionSection, 'addCommentQuestion').rejects(new Error('Unauthorized'))
    const reloadData = cy.stub().as('reloadData')
    cy.mount(
        <QuestionSection
            qid={qid}
            question={question}
            reloadData={reloadData}
            currentUser={currentUser}
            handleQuestions={() => {}}
        />
    )
    cy.get('.comment_input').type('New comment text')
    cy.get('.add_comment_button').click()
    cy.get('.alertBox').should('exist')
})