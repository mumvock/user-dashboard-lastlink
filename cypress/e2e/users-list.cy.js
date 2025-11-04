describe('Users list page (e2e)', () => {
    beforeEach(() => {
        cy.fixture('users.json').then(() => {
            cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', { fixture: 'users.json' }).as('getUsers')

            cy.request({ url: '/users' }).then((resp) => {
                expect(resp.headers['content-type']).to.include('text/html')
            })

            cy.visit('/users')

            cy.wait('@getUsers', { timeout: 20000 })
            cy.get('table', { timeout: 20000 }).should('exist')
        })
    })

    it('renders the table headers and rows based on the API', () => {
        cy.contains('th', 'Name')
        cy.contains('th', 'E-mail')
        cy.contains('th', 'Company name')

        cy.get('table').contains('td', 'Leanne Graham').should('exist')
        cy.get('table').contains('td', 'Sincere@april.biz').should('exist')
    })

    it('filters the list when typing in the search input', () => {
        cy.get('input[placeholder="Name, e-mail or company name"]').type('Leanne')

        cy.get('table').contains('td', 'Leanne Graham').should('exist')
        cy.get('table').contains('td', 'Ervin Howell').should('not.exist')
    })

    it('navigates to user info when clicking the info action', () => {
        cy.get('table').find('a[matIconButton]').first().click()

        cy.url().should('match', /\/users\/info\/1$/)
    })
})
