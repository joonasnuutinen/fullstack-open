const joonas = { name: 'Joonas Nuutinen', username: 'joonas', password: 'jonttuli' }

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.createUser(joonas)
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

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login(joonas)
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

    describe('and several blogs exist', function() {
      const testBlogs = [
        { title: 'like me', author: 'me', url: 'https://www.cypress.io' },
        { title: 'another', author: 'you', url: '/another', likes: 10 },
        { title: 'one more', author: 'them', url: '/one-more', likes: 9 },
      ]
      const likeMe = testBlogs[0]

      beforeEach(function() {
        testBlogs.forEach(blog => {
          cy.createBlog(blog)
        })
      })

      it('a blog can be liked', function() {
        cy.contains(likeMe.title).as('likeMe').contains('view').click()
        cy.get('@likeMe').contains('likes 0')
        cy.get('@likeMe').contains('button', 'like').click()
        cy.get('@likeMe').contains('likes 1')
      })

      it('blog can be deleted by the user who added it', function() {
        cy.contains(likeMe.title).as('likeMe').contains('view').click()
        cy.get('@likeMe').contains('remove').click()
        cy.contains(`Successfully removed ${likeMe.title} by ${likeMe.author}`)
        cy.get('html').should('not.contain', likeMe.tite)
      })

      it('blog cannot be deleted by another user', function() {
        const darth = { username: 'darth', name: 'Darth Vader', password: 'papa' }
        cy.createUser(darth)
        cy.login(darth)
        cy.contains(likeMe.title).as('likeMe').contains('view').click()
        cy.get('@likeMe').should('not.contain', 'remove')
      })

      it('blogs are sorted by likes', function() {
        cy.contains('blogs')
        cy.get('#blogs').should($blogs => {
          expect($blogs.children()).to.have.length(testBlogs.length)
          const sortedBlogs = testBlogs.sort((b1, b2) => (b2.likes || 0) - (b1.likes || 0))
          $blogs.children().each((i, blog) => {
            const content = Cypress.$(blog).text()
            const compBlog = sortedBlogs[i]
            expect(content).to.equal(`${compBlog.title} ${compBlog.author}view`)
          })
        })
      })
    })
  })
})
