describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Joonas Nuutinen',
      username: 'joonas',
      password: 'jonttuli'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('username').find('input')
    cy.contains('password').find('input')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('username').find('input').type('joonas')
      cy.contains('password').find('input').type('jonttuli')
      cy.contains('login').click()
      cy.contains('Joonas Nuutinen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('username').find('input').type('joonas')
      cy.contains('password').find('input').type('tonttuli')
      cy.contains('login').click()
      cy.contains('wrong credentials').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
})