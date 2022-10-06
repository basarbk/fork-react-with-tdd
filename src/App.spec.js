import { cleanup, render, screen } from './test/setup'
import userEvent from '@testing-library/user-event'
import App from './App'
import { setupServer } from 'msw/lib/node'
import { rest } from 'msw'
import storage from './state/storage'

// let requestBody
// let acceptLanguageHeader
const server = setupServer(
  rest.post('/api/1.0/users/token/:token', (req, res, ctx) => {
    // requestBody = req.body
    // acceptLanguageHeader = req.headers.get('Accept-Language')
    return res(ctx.status(200))
  }),

  rest.get('/api/1.0/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        content: [
          {
            id: 1,
            username: 'user-in-list',
            email: 'user-in-list@mail.com',
            image: null
          }
        ],
        page: 0,
        size: 0,
        totalPages: 0
      })
    )
  }),
  rest.get('/api/1.0/users/:id', (req, res, ctx) => {
    const id = Number.parseInt(req.params.id)
    return res(
      ctx.json({
        id: id,
        username: 'user' + id,
        email: 'user' + id + '@mail.com',
        image: null
      })
    )
  }),
  rest.post('/api/1.0/auth', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 5,
        username: 'user5'
      })
    )
  })
)

beforeEach(() => {
  server.resetHandlers()
})
beforeAll(() => {
  server.listen()
})
afterAll(() => {
  server.close()
})
afterEach(() => {
  // cleanup()
})

const setup = (path) => {
  window.history.pushState({}, '', path)
  render(<App />)
}

describe('Routing', () => {
  it.each`
    path               | testId
    ${'/'}             | ${'home-page'}
    ${'/signup'}       | ${'signup-page'}
    ${'/login'}        | ${'login-page'}
    ${'/user/1'}       | ${'user-page'}
    ${'/user/2'}       | ${'user-page'}
    ${'/activate/123'} | ${'activation-page'}
    ${'/activate/123'} | ${'activation-page'}
  `('displays $testId when path is $path', ({ path, testId }) => {
    setup(path)
    const page = screen.queryByTestId(testId)
    expect(page).toBeInTheDocument()
  })

  it.each`
    path         | testId
    ${'/'}       | ${'signup-page'}
    ${'/signup'} | ${'home-page'}
    ${'/login'}  | ${'signup-page'}
  `('does not display $testId when path is $path', ({ path, testId }) => {
    setup(path)
    const page = screen.queryByTestId(testId)
    expect(page).not.toBeInTheDocument()
  })

  it.each`
    targetPage
    ${'Home'}
    ${'Sign Up'}
    ${'Log In'}
  `('has link to $targetPage on NavBar', ({ targetPage }) => {
    setup('/')
    const link = screen.queryByRole('link', { name: targetPage })
    expect(link).toBeInTheDocument()
  })

  it.each`
    initialPath  | clickingTo   | visiblePage
    ${'/'}       | ${'Sign Up'} | ${'signup-page'}
    ${'/signup'} | ${'Home'}    | ${'home-page'}
    ${'/signup'} | ${'Log In'}  | ${'login-page'}
  `('displays $visiblePage after clicking $clickTo link', ({ initialPage, clickingTo, visiblePage }) => {
    setup(initialPage)
    const link = screen.queryByRole('link', { name: clickingTo })
    userEvent.click(link)
    expect(screen.queryByTestId(visiblePage)).toBeInTheDocument()
  })

  it('navigates to user page when clicking the username on user list', async () => {
    setup('/')
    const user = await screen.findByText('user-in-list')
    userEvent.click(user)
    const page = await screen.findByTestId('user-page')
    expect(page).toBeInTheDocument()
  })
})

describe('Login', () => {
  const setupLoggedIn = () => {
    setup('/login')
    userEvent.type(screen.getByLabelText('Email'), 'user5@mail.com')
    userEvent.type(screen.getByLabelText('Password'), 'P4ssword')
    userEvent.click(screen.getByRole('button', { name: 'Login' }))
  }
  it('hides My Profile link on navbar when not logged in', async () => {
    setup('/login')
    const myProfileLink = screen.queryByRole('link', { name: 'My Profile' })
    expect(myProfileLink).not.toBeInTheDocument()
  })
  it('redirects to homepage after successful login', async () => {
    setupLoggedIn()
    const page = await screen.findByTestId('home-page')
    expect(page).toBeInTheDocument()
  })
  it('displays My Profile link on navbar after successful login', async () => {
    setup('/login')
    const myProfileLink = screen.queryByRole('link', { name: 'My Profile' })
    expect(myProfileLink).not.toBeInTheDocument()
    userEvent.type(screen.getByLabelText('Email'), 'user5@mail.com')
    userEvent.type(screen.getByLabelText('Password'), 'P4ssword')
    userEvent.click(screen.getByRole('button', { name: 'Login' }))
    await screen.findByTestId('home-page')
    const myProfileLinkAfterLogin = screen.queryByRole('link', { name: 'My Profile' })
    expect(myProfileLinkAfterLogin).toBeInTheDocument()
  })

  it('hides the Login and Sign Up links from navbar after successful login', async () => {
    setupLoggedIn()
    await screen.findAllByTestId('home-page')
    const loginLink = screen.queryByRole('link', { name: 'Log In' })
    const signUpLink = screen.queryByRole('link', { name: 'Sign Up' })
    expect(loginLink).not.toBeInTheDocument()
    expect(signUpLink).not.toBeInTheDocument()
  })

  it('displays user page with logged in user id in url after clicking My Profile link', async () => {
    setupLoggedIn()
    await screen.findAllByTestId('home-page')
    const myProfileLink = screen.getByRole('link', { name: 'My Profile' })
    userEvent.click(myProfileLink)
    await screen.findByTestId('user-page')
    const username = await screen.findByText('user5')
    expect(username).toBeInTheDocument()
  })

  it('stores logged in state in local storage', async () => {
    setupLoggedIn()
    await screen.findAllByTestId('home-page')
    const state = storage.getItem('auth')
    expect(state.isLoggedIn).toBeTruthy()
  })
  // it('displays layout of logged in state', async () => {
  //   storage.setItem('auth', { isLoggedIn: true, id: 4 })
  //   setup('/')
  //   const myProfileLink = await screen.findByRole('link', { name: 'Log In' })
  //   expect(myProfileLink).toBeInTheDocument()
  //   console.log(storage.getItem('auth'))
  // const myProfileLink = await screen.findByRole('link', { name: 'Profile' })
  //   expect(myProfileLink).toBeInTheDocument()
  // })
})

console.error = () => {}
