import SideBarNav from "../../src/components/main/sideBarNav";

describe('SideBarNav Component with Guest User', () => {
    const currentUser = null;

    it('displays Questions menu button', () => {
        cy.mount(<SideBarNav currentUser={currentUser}/>)
        cy.get('#menu_question').should('exist')
    })

    it('displays Tags menu button', () => {
        cy.mount(<SideBarNav currentUser={currentUser}/>)
        cy.get('#menu_tag').should('exist')
    })

    it('displays Login menu button when no user is logged in', () => {
        cy.mount(<SideBarNav currentUser={currentUser}/>)
        cy.get('#menu_login').should('exist')
    })

    it('displays Register menu button when no user is logged in', () => {
        cy.mount(<SideBarNav currentUser={currentUser}/>)
        cy.get('#menu_register').should('exist')
    })

    it('calls handleQuestions when "Questions" menu button is clicked', () => {
        const handleQuestions = cy.spy().as('handleQuestions')
        cy.mount(
            <SideBarNav
                currentUser={currentUser}
                handleQuestions={handleQuestions}
            />
        )
        cy.get('#menu_question').click().then(() => {
            expect(handleQuestions).to.be.calledOnce
        })
    })

    it('calls handleTags when "Tags" menu button is clicked', () => {
        const handleTags = cy.spy().as('handleTags')
        cy.mount(
            <SideBarNav
                currentUser={currentUser}
                handleTags={handleTags}
            />
        )
        cy.get('#menu_tag').click().then(() => {
            expect(handleTags).to.be.calledOnce
        })
    })

    it('calls handleLogin when "Login" menu button is clicked', () => {
        const handleLogin = cy.spy().as('handleLogin')
        cy.mount(
            <SideBarNav
                currentUser={currentUser}
                handleLogin={handleLogin}
            />
        )
        cy.get('#menu_login').click().then(() => {
            expect(handleLogin).to.be.calledOnce
        })
    })

    it('calls handleRegister when "Register" menu button is clicked', () => {
        const handleRegister = cy.spy().as('handleRegister')
        cy.mount(
            <SideBarNav
                currentUser={currentUser}
                handleRegister={handleRegister}
            />
        )
        cy.get('#menu_register').click().then(() => {
            expect(handleRegister).to.be.calledOnce
        })
    })

})


describe('SideBarNav Component with Logged in User', () => {
    const currentUser = { username: 'testUser', role: 'REGISTERED' }

    it('displays Questions menu button', () => {
        cy.mount(<SideBarNav currentUser={currentUser}/>)
        cy.get('#menu_question').should('exist')
    })

    it('displays Tags menu button', () => {
        cy.mount(<SideBarNav currentUser={currentUser}/>)
        cy.get('#menu_tag').should('exist')
    })

    it('displays Profile menu button when user is logged in', () => {
        cy.mount(<SideBarNav currentUser={currentUser}/>)
        cy.get('#menu_profile').should('exist')
    })

    it('displays Logout menu button when user is logged in', () => {
        cy.mount(<SideBarNav currentUser={currentUser}/>)
        cy.get('#menu_logout').should('exist')
    })

    it('calls handleQuestions when "Questions" menu button is clicked', () => {
        const handleQuestions = cy.spy().as('handleQuestions')
        cy.mount(
            <SideBarNav
                currentUser={currentUser}
                handleQuestions={handleQuestions}
            />
        )
        cy.get('#menu_question').click().then(() => {
            expect(handleQuestions).to.be.calledOnce
        })
    })

    it('calls handleTags when "Tags" menu button is clicked', () => {
        const handleTags = cy.spy().as('handleTags')
        cy.mount(
            <SideBarNav
                currentUser={currentUser}
                handleTags={handleTags}
            />
        )
        cy.get('#menu_tag').click().then(() => {
            expect(handleTags).to.be.calledOnce
        })
    })

    it('calls handleProfile when "Profile" menu button is clicked', () => {
        const handleProfile = cy.spy().as('handleProfile')
        cy.mount(
            <SideBarNav
                currentUser={currentUser}
                handleProfile={handleProfile}
            />
        )
        cy.get('#menu_profile').click().then(() => {
            expect(handleProfile).to.be.calledOnce
        })
    })

    it('calls handleLogout when "Logout" menu button is clicked', () => {
        const handleLogout = cy.spy().as('handleLogout')
        cy.mount(
            <SideBarNav
                currentUser={currentUser}
                handleLogout={handleLogout}
            />
        )
        cy.get('#menu_logout').click().then(() => {
            expect(handleLogout).to.be.calledOnce
        })
    })

});
