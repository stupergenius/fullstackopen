describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'ben',
      password: 'asdf',
      name: 'Ben S',
    })
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'neb',
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

    describe('When a blog exists', () => {
      beforeEach(() => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:3003/api/blogs',
          body: {
            title: 'My New Blog',
            author: 'BenS',
            url: 'http://blog.example.com',
            likes: 5,
          },
          auth: {
            bearer: JSON.parse(localStorage.getItem('user')).token,
          },
        }).then(() => {
          cy.visit('http://localhost:3000')
        })
      })

      it('A blog can be liked', () => {
        cy.get('button:contains("view")').click()

        cy.contains('likes 5')
        cy.get('button:contains("like")').click()
        cy.get('button:contains("like")').click()
        cy.contains('likes 7')
      })

      it('A blog can be deleted', () => {
        cy.get('button:contains("view")').click()
        cy.get('button:contains("remove")').click()

        cy
          .contains('My New Blog')
          .parent()
          .find('button:contains("remove")')
          .should('not.exist')
      })

      it('A blog can be deleted only by the owner', () => {
        // Login `neb` user and make him a blog
        // Then assert whether `ben` user can delete `neb`'s blog

        cy.request('POST', 'http://localhost:3003/api/login', {
          username: 'neb', password: 'asdf',
        }).then((response) => {
          cy.request({
            method: 'POST',
            url: 'http://localhost:3003/api/blogs',
            body: {
              title: 'Nebs new blog',
              author: 'NebR',
              url: 'http://neb.example.com',
              likes: 2,
            },
            auth: {
              bearer: response.body.token,
            },
          }).then(() => {
            cy.visit('http://localhost:3000')
          })
        })

        // we're still logged in as `ben` at this point,
        // so we should only be able to delete his blogs

        cy
          .contains('My New Blog')
          .parent()
          .find('button:contains("view")')
          .click()

        cy
          .contains('My New Blog')
          .parent()
          .find('button:contains("remove")')

        // But not `neb`s blogs

        cy
          .contains('Nebs new blog')
          .parent()
          .find('button:contains("view")')
          .click()

        cy
          .contains('Nebs new blog')
          .parent()
          .find('button:contains("remove")')
          .should('not.exist')
      })

      it('Blogs are sorted by likes descending', () => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:3003/api/blogs',
          body: {
            title: 'A second blog',
            author: 'BenS',
            url: 'http://blog.example.com',
            likes: 25,
          },
          auth: {
            bearer: JSON.parse(localStorage.getItem('user')).token,
          },
        }).then(() => {
          cy.visit('http://localhost:3000')
        })

        cy.get('button:contains("view")').each((button) => {
          cy.wrap(button).click()
        })

        let currentLikes = Infinity
        cy
          .get('button:contains("hide")')
          .each((p) => {
            cy.wrap(p).parent().should((content) => {
              const matches = content.text().match(/likes (\d+)/)
              if (matches.length < 2) return

              const likes = parseInt(matches[1], 10)
              if (Number.isNaN(likes)) return

              expect(currentLikes).to.be.at.least(likes) // really verbose gte...
              currentLikes = likes
            })
          })
      })
    })
  })
})
