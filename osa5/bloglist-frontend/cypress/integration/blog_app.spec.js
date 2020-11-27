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

  describe.only('When logged in', function() {
    beforeEach(function() {
      cy.login('joonas', 'jonttuli')
    })

    it('A blog can be created', function() {
      cy.contains('new note').click()
      const b = {
        title: 'cypress test',
        author: 'cypress',
        url: 'https://www.cypress.io'
      }
      cy.contains('title').find('input').type(b.title)
      cy.contains('author').find('input').type(b.author)
      cy.contains('url').find('input').type(b.url)
      cy.contains('button', 'create').click()
      cy.contains(`a new blog ${b.title} by ${b.author} added`)
      cy.contains(`${b.title} ${b.author}`)
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'like me', author: 'me', url: 'https://www.cypress.io' })
      })

      it('a blog can be liked', function() {
        cy.contains('like me').as('likeMe').contains('view').click()
        cy.get('@likeMe').contains('likes 0')
        cy.get('@likeMe').contains('button', 'like').click()
        cy.get('@likeMe').contains('likes 1')
      })
    })
  })
})
