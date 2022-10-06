import LoginPage from './LoginPage'
import { screen, render, waitForElementToBeRemoved } from '../test/setup'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import en from '../locale/en.json'
import es from '../locale/es.json'
import storage from '../state/storage'
import { login } from '../api/apiCalls'

let requestBody
let count = 0
let acceptLanguageHeader
const server = setupServer(
  rest.post('/api/1.0/auth', (req, res, ctx) => {
    requestBody = req.body
    count = count + 1
    acceptLanguageHeader = req.headers.get('Accept-Language')
    return res(
      ctx.status(401),
      ctx.json({
        message: 'Incorrect credentials'
      })
    )
  })
)

beforeEach(() => {
  count = 0
  server.resetHandlers()
})
beforeAll(() => {
  server.listen()
})
afterAll(() => {
  server.close()
})

const loginSuccess = rest.post('/api/1.0/auth', (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      id: 5,
      image: null,
      username: 'user5',
      token: '1234567'
    })
  )
})

describe('Login Page', () => {
  describe('Layout', () => {
    it('has header', () => {
      render(<LoginPage />)
      const header = screen.queryByRole('heading', { name: 'Login' })
      expect(header).toBeInTheDocument()
    })
    it('has email input', () => {
      render(<LoginPage />)
      const input = screen.getByLabelText('Email')
      expect(input).toBeInTheDocument()
    })
    it('has password input', () => {
      render(<LoginPage />)
      const input = screen.getByLabelText('Password')
      expect(input).toBeInTheDocument()
    })
    it('has password type', () => {
      render(<LoginPage />)
      const input = screen.getByLabelText('Password')
      expect(input.type).toBe('password')
    })
    it('has Login button', () => {
      render(<LoginPage />)
      const button = screen.getByRole('button', { name: 'Login' })
      expect(button).toBeInTheDocument()
    })
    it('disables the Login button initially', () => {
      render(<LoginPage />)
      const button = screen.getByRole('button', { name: 'Login' })
      expect(button).toBeDisabled()
    })
  })
  describe('interactions', () => {
    let button
    let emailInput
    let passwordInput
    const setup = (email = 'user100@mail.com') => {
      render(<LoginPage />)
      emailInput = screen.getByLabelText('Email')
      userEvent.type(emailInput, email)
      passwordInput = screen.getByLabelText('Password')
      userEvent.type(passwordInput, 'P4ssword')
      button = screen.getByRole('button', { name: 'Login' })
    }
    it('enables the button when email and password inputs are filled', () => {
      setup()
      expect(button).not.toBeDisabled()
    })
    it('displays spinner during api call', async () => {
      setup()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      userEvent.click(button)
      const spinner = screen.getByRole('status')
      await waitForElementToBeRemoved(spinner)
    })
    it('sends email and password to backend after clicking submit', async () => {
      setup()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      userEvent.click(button)
      const spinner = screen.getByRole('status')
      await waitForElementToBeRemoved(spinner)
      expect(requestBody).toEqual({
        email: 'user100@mail.com',
        password: 'P4ssword'
      })
    })
    it('disables submit when there is an api call', async () => {
      setup()
      userEvent.click(button)
      userEvent.click(button)
      const spinner = screen.getByRole('status')
      await waitForElementToBeRemoved(spinner)
      expect(count).toBe(1)
    })
    it('displays auth fail message', async () => {
      setup()
      userEvent.click(button)
      const errorMessage = await screen.findByText('Incorrect credentials')
      expect(errorMessage).toBeInTheDocument()
    })
    it('clears auth fail message when email field is changed', async () => {
      setup()
      userEvent.click(button)
      const errorMessage = await screen.findByText('Incorrect credentials')
      userEvent.type(emailInput, 'user1@mail.co')
      expect(errorMessage).not.toBeInTheDocument()
    })
    it('clears auth fail message when password field is changed', async () => {
      setup()
      userEvent.click(button)
      const errorMessage = await screen.findByText('Incorrect credentials')
      userEvent.type(passwordInput, 'newPassword')
      expect(errorMessage).not.toBeInTheDocument()
    })
    it('stores id, username, and image in storage', async () => {
      server.use(loginSuccess)
      setup('user5@mail.com')
      userEvent.click(button)
      const spinner = screen.getByRole('status')
      await waitForElementToBeRemoved(spinner)
      const storedState = storage.getItem('auth')
      const objectFields = Object.keys(storedState)
      expect(objectFields.includes('id')).toBeTruthy()
      expect(objectFields.includes('username')).toBeTruthy()
      expect(objectFields.includes('image')).toBeTruthy()
    })
    it('stores auth header value in storage', async () => {
      server.use(loginSuccess)
      setup('user5@mail.com')
      userEvent.click(button)
      const spinner = screen.getByRole('status')
      await waitForElementToBeRemoved(spinner)
      const storedState = storage.getItem('auth')
      expect(storedState.header).toBe('Bearer 1234567')
    })
  })
  describe('Internationalization', () => {
    let spanishToggle
    let englishToggle
    let passwordInput
    let emailInput
    const setup = () => {
      render(
        <>
          <LoginPage />
        </>
      )
      spanishToggle = screen.getByTitle('Español')
      englishToggle = screen.getByTitle('English')
      passwordInput = screen.getByLabelText('Password')
      emailInput = screen.getByLabelText('Email')
    }

    it('initially displays all text in English', () => {
      setup()
      expect(screen.getByRole('heading', { name: en.login })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: en.login })).toBeInTheDocument()
      expect(screen.getByLabelText(en.email)).toBeInTheDocument()
      expect(screen.getByLabelText(en.password)).toBeInTheDocument()
    })

    it('displays all text in Spanish after selecting Spanish', async () => {
      setup()
      userEvent.click(spanishToggle)
      expect(screen.getByRole('heading', { name: es.login })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: es.login })).toBeInTheDocument()
      expect(screen.getByLabelText(es.email)).toBeInTheDocument()
      expect(screen.getByLabelText(es.password)).toBeInTheDocument()
    })
    it('displays all text in English after changing language to English', () => {
      setup()
      userEvent.click(spanishToggle)
      userEvent.click(englishToggle)
      expect(screen.getByRole('heading', { name: en.login })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: en.login })).toBeInTheDocument()
      expect(screen.getByLabelText(en.email)).toBeInTheDocument()
      expect(screen.getByLabelText(en.password)).toBeInTheDocument()
    })
    it('sends language header as en for outgoing request', async () => {
      setup()
      userEvent.type(emailInput, 'user1@mail.com')
      userEvent.type(passwordInput, 'P4assword')
      const button = screen.getByRole('button', { name: en.login })
      userEvent.click(button)
      const spinner = screen.getByRole('status')
      await waitForElementToBeRemoved(spinner)
      expect(acceptLanguageHeader).toBe('en')
    })
    it('sends language header es for outgoing request in spanish', async () => {
      setup()
      userEvent.click(spanishToggle)
      userEvent.type(emailInput, 'user1@mail.com')
      userEvent.type(passwordInput, 'P4assword')
      const button = screen.getByRole('button', { name: es.login })
      userEvent.click(button)
      const spinner = screen.getByRole('status')
      await waitForElementToBeRemoved(spinner)
      expect(acceptLanguageHeader).toBe('es')
    })
  })
})
