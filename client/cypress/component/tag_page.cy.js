import Tag from '../../src/components/main/tagPage/tag';
import TagPage from '../../src/components/main/tagPage/index';


it('renders tag component', () => {
    const tag = {name : 'Sample Tag ', qcnt: '5'}

    cy.mount(<Tag t={tag} clickTag={() => {}} />)
    cy.get('.tagNode > .tagName').contains(tag.name)
    cy.get('div.tagNode').invoke('text').then((text) => {
        expect(text).to.equal(tag.name + tag.qcnt + ' questions');
    })
})

it('calls clickTag when tag is clicked', () => {
    const tag = {name : 'Sample Tag ', qcnt: '5'}

    const clickTagStub = cy.stub().as('clickTagStub')
    cy.mount(<Tag t={tag} clickTag={clickTagStub} />)
    cy.get('.tagNode').click()
    cy.get('@clickTagStub').should('be.calledWith', tag.name)
});

it('renders tag page and displays tags', () => {
    const tag1 = {name : 'Sample Tag 1', qcnt: 5}
    const tag2 = {name : 'Sample Tag 2', qcnt: 10}
    const tlist = [tag1, tag2]

    cy.stub(TagPage, 'getTagsWithQuestionNumber').resolves(tlist)
    cy.mount(<TagPage clickTag={() => {}} handleNewQuestion = {() => {}}/>)

    cy.get('.bold_title').contains(tlist.length + ' Tags')
    cy.get('.tagNode > .tagName').contains(tag1.name)
    cy.get('.tagNode > .tagName').contains(tag2.name)
    cy.get('div.tagNode').invoke('text').then((text) => {
        expect(text).to.equal(tag1.name + tag1.qcnt + ' questions' + tag2.name + tag2.qcnt + ' questions');
    })
});

it('calls clickTag handler when a tag is clicked', () => {
    const tag1 = {name : 'Sample Tag 1', qcnt: 5}
    const tag2 = {name : 'Sample Tag 2', qcnt: 10}
    const tlist = [tag1, tag2];

    cy.stub(TagPage, 'getTagsWithQuestionNumber').resolves(tlist)
    const clickTagStub = cy.stub().as('clickTagStub')
    cy.mount(<TagPage clickTag={clickTagStub} handleNewQuestion={() => {}} />)
    cy.contains('.tag_list', 'Sample Tag 2').click()
    cy.get('@clickTagStub').should('be.calledWith', 'Sample Tag 2')
});

it('calls handleNewQuestion handler when "Ask a Question" button is clicked', () => {

    const handleNewQuestionStub = cy.stub().as('handleNewQuestionStub')
    cy.mount(<TagPage clickTag={() => {}} handleNewQuestion={handleNewQuestionStub} />)
    cy.contains('button', 'Ask a Question').click()
    cy.get('@handleNewQuestionStub').should('be.called')
});