describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'ben',
      password: 'asdf',
      name: 'Ben S',
    })
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', () => {
    cy.contains('log in to application')
    cy.get('input[name="Username"]')
    cy.get('input[name="Password"]')
  })

  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.get('input[name="Username"]').type('ben')
      cy.get('input[name="Password"]').type('asdf')
      cy.get('form').contains('login').click()

      cy.contains(/ben s logged in/i)
    })

    it('fails with wrong credentials', () => {
      cy.get('input[name="Username"]').type('ben')
      cy.get('input[name="Password"]').type('the wrong password')
      cy.get('form').contains('login').click()

      cy.contains(/wrong credentials/i)
    })
  })

  describe('When logged in', () => {
    beforeEach(() => {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'ben', password: 'asdf',
      }).then((response) => {
        localStorage.setItem('user', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', () => {
      cy.contains('new note').click()

      cy.get('input[name="blog_title"]').type('My New Blog')
      cy.get('input[name="blog_author"]').type('BenS')
      cy.get('input[name="blog_url"]').type('http://blog.example.com')

      cy.get('button:contains("create")').click()

      cy.contains('My New Blog')
      cy.contains('BenS')
    })
  })
})
