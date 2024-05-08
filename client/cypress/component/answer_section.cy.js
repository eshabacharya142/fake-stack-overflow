import AnswerSection from "../../src/components/main/answerPage/answerSection";

describe('AnswerSection Component with Logged in User', () => {
    const aid = 'answerId'
    const answer = {
        text: 'Sample answer text',
        ans_by: {
            user_name: 'sampleUser'
        },
        ans_date_time: new Date(),
        voteCount: 5,
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
        cy.stub(AnswerSection, 'addCommentAnswer').resolves()
        const reloadData = cy.stub().as('reloadData')
        cy.mount(
            <AnswerSection
                aid={aid}
                answer={answer}
                reloadData={reloadData}
                currentUser={currentUser}
            />
        )
    })

    it('displays answer', () => {
        cy.get('.answer').should('exist')
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

    it('calls addCommentAnswer when comment is submitted', () => {
        const commentText = 'New comment text'
        cy.get('.comment_input').type(commentText)
        cy.get('.add_comment_button').click().then(() => {
            expect(AnswerSection.addCommentAnswer).to.be.calledOnceWith(aid, { text: commentText, comment_date_time: new Date() })
        })
    })
})


it('displays alert box when comment is submitted without login', () => {
    const aid = 'answerId'
    const answer = {
        text: 'Sample answer text',
        ans_by: {
            user_name: 'sampleUser'
        },
        ans_date_time: new Date(),
        voteCount: 5,
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
    cy.stub(AnswerSection, 'addCommentAnswer').rejects(new Error('Unauthorized'))
    const reloadData = cy.stub().as('reloadData')
    cy.mount(
        <AnswerSection
            aid={aid}
            answer={answer}
            reloadData={reloadData}
            currentUser={currentUser}
        />
    )
    cy.get('.comment_input').type('New comment text')
    cy.get('.add_comment_button').click()
    cy.get('.alertBox').should('exist')
})