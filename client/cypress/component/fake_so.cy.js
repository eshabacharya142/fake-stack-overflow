import React from 'react'
import FakeStackOverflow from '../../src/components/fakestackoverflow'

describe('FakeStackOverflow Component', () => {
  it('renders', () => {
    cy.mount(<FakeStackOverflow />)
  })

  it('renders Header and Main components by default', () => {
    cy.mount(<FakeStackOverflow />)
    cy.get('#header').should('exist')
    cy.get('#main').should('exist')
  })

})