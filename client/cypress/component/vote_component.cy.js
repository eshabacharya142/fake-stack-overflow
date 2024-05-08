import VoteBody from "../../src/components/main/answerPage/vote";

describe('Vote with Logged in User', () => {
    const qid = 'questionId'
    const aid = 'answerId'
    const voteCount = 10
    const currentUser = { role: 'USER' }

    beforeEach(() => {
        cy.stub(VoteBody, 'voteQuestion').resolves()
        cy.stub(VoteBody, 'voteAnswer').resolves()
        cy.stub(VoteBody, 'reportedQuestions').resolves()
        cy.stub(VoteBody, 'reportedAnswers').resolves()
        cy.stub(VoteBody, 'deleteQuestion').resolves()
        cy.stub(VoteBody, 'deleteAnswer').resolves()

        const reloadData = cy.stub().as('reloadData')
        cy.mount(
            <VoteBody
                qid={qid}
                aid={aid}
                voteCount={voteCount}
                reloadData={reloadData}
                currentUser={currentUser}
                reportedQ={false}
                setReportedQ={() => {}}
                reportedA={false}
                setReportedA={() => {}}
                handleQuestions={() => {}}
            />
        )
    })

    it('displays vote count', () => {
        cy.get('.voteCount').should('contain.text', `${voteCount} votes`)
    })

    context('when user is logged in', () => {
        it('displays upvote and downvote buttons', () => {
            cy.get('.voteBtn').should('have.length', 2)
        })

        it('displays report button for question if not reported', () => {
            cy.get('.reportBtn').should('exist').and('contain.text', 'Report')
        })

        it('displays report button for answer if not reported', () => {
            const reloadData = cy.stub().as('reloadData')
            cy.mount(
                <VoteBody
                    qid={null}
                    aid={aid}
                    voteCount={voteCount}
                    reloadData={reloadData}
                    currentUser={currentUser}
                    reportedQ={false}
                    setReportedQ={() => {}}
                    reportedA={false}
                    setReportedA={() => {}}
                    handleQuestions={() => {}}
                />
            )
            cy.get('.reportBtn').should('exist').and('contain.text', 'Report')
        })

        it('calls upvote when upvote button is clicked', () => {
            cy.get('.voteBtn').contains('↑').click().then(() => {
                expect(VoteBody.voteQuestion).to.be.calledOnceWith(qid, 'upvote')
            })
        })

        it('calls downvote when downvote button is clicked', () => {
            cy.get('.voteBtn').contains('↓').click().then(() => {
                expect(VoteBody.voteQuestion).to.be.calledOnceWith(qid, 'downvote')
            })
        })

        it('calls reportedQuestions when report button for question is clicked', () => {
            cy.get('.reportBtn').click().then(() => {
                expect(VoteBody.reportedQuestions).to.be.calledOnceWith(qid)
            })
        })

        it('calls reportedAnswers when report button for answer is clicked', () => {
            const reloadData = cy.stub().as('reloadData')
            cy.mount(
                <VoteBody
                    qid={null}
                    aid={aid}
                    voteCount={voteCount}
                    reloadData={reloadData}
                    currentUser={currentUser}
                    reportedQ={false}
                    setReportedQ={() => {}}
                    reportedA={false}
                    setReportedA={() => {}}
                    handleQuestions={() => {}}
                />
            )
            cy.get('.reportBtn').click().then(() => {
                expect(VoteBody.reportedAnswers).to.be.calledOnceWith(aid)
            })
        })

        context('when question is reported', () => {
            beforeEach(() => {
                const reloadData = cy.stub().as('reloadData')
                cy.mount(
                    <VoteBody
                        qid={qid}
                        aid={null}
                        voteCount={voteCount}
                        reloadData={reloadData}
                        currentUser={currentUser}
                        reportedQ={true}
                        setReportedQ={() => {}}
                        reportedA={false}
                        setReportedA={() => {}}
                        handleQuestions={() => {}}
                    />
                )
            })

            it('disables report button for question', () => {
                cy.get('.reportBtn').should('be.disabled').and('contain.text', 'Reported')
            })
        })

        context('when answer is reported', () => {
            beforeEach(() => {
                const reloadData = cy.stub().as('reloadData');
                cy.mount(
                    <VoteBody
                        qid={null}
                        aid={aid}
                        voteCount={voteCount}
                        reloadData={reloadData}
                        currentUser={currentUser}
                        reportedQ={false}
                        setReportedQ={() => {}}
                        reportedA={true}
                        setReportedA={() => {}}
                        handleQuestions={() => {}}
                    />
                )
            })

            it('disables report button for answer', () => {
                cy.get('.reportBtn').should('be.disabled').and('contain.text', 'Reported')
            })
        })

        it('does not display delete button for non-admin user', () => {
            cy.get('.deleteBtn').should('not.exist')
        })
    })

    context('when user is admin', () => {
        const adminUser = { role: 'ADMIN' }

        beforeEach(() => {
            const reloadData = cy.stub().as('reloadData')
            cy.mount(
                <VoteBody
                    qid={qid}
                    aid={aid}
                    voteCount={voteCount}
                    reloadData={reloadData}
                    currentUser={adminUser}
                    reportedQ={true}
                    setReportedQ={() => {}}
                    reportedA={false}
                    setReportedA={() => {}}
                    handleQuestions={() => {}}
                />
            )
        })

        it('displays delete button for reported question', () => {
            cy.get('.deleteBtn').should('exist').and('contain.text', 'Delete Question')
        })

        it('displays delete button for reported answer', () => {
            const reloadData = cy.stub().as('reloadData')
            cy.mount(
                <VoteBody
                    qid={null}
                    aid={aid}
                    voteCount={voteCount}
                    reloadData={reloadData}
                    currentUser={adminUser}
                    reportedQ={false}
                    setReportedQ={() => {}}
                    reportedA={true}
                    setReportedA={() => {}}
                    handleQuestions={() => {}}
                />
            )
            cy.get('.deleteBtn').should('exist').and('contain.text', 'Delete Answer')
        })

        it('calls deleteQuestion when delete button for question is clicked', () => {
            cy.get('.deleteBtn').click().then(() => {
                expect(VoteBody.deleteQuestion).to.be.calledOnceWith(qid)
            })
        })

        it('calls deleteAnswer when delete button for answer is clicked', () => {
            const reloadData = cy.stub().as('reloadData')
            cy.mount(
                <VoteBody
                    qid={null}
                    aid={aid}
                    voteCount={voteCount}
                    reloadData={reloadData}
                    currentUser={adminUser}
                    reportedQ={false}
                    setReportedQ={() => {}}
                    reportedA={true}
                    setReportedA={() => {}}
                    handleQuestions={() => {}}
                />
            )
            cy.get('.deleteBtn').click().then(() => {
                expect(VoteBody.deleteAnswer).to.be.calledOnceWith(aid)
            })
        })
    })
})
