import { render, screen, waitFor, waitForElementToBeRemoved } from '../test/setup'
import SignUpPage from './SignUpPage'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import en from '../locale/en.json'
import es from '../locale/es.json'

let counter = 0
let acceptLanguageHeader
const server = setupServer(
  rest.post('/api/1.0/users', (req, res, ctx) => {
    counter += 1
    acceptLanguageHeader = req.headers.get('Accept-Language')
    return res(ctx.status(200))
  })
)

beforeEach(() => {
  counter = 0
  server.resetHandlers()
})
beforeAll(() => {
  server.listen()
})
afterAll(() => {
  server.close()
})

describe('Sign Up Page', () => {
  describe('Layout', () => {
    it('has header', () => {
      render(<SignUpPage />)
      const header = screen.queryByRole('heading', { name: en.signUp })
      expect(header).toBeInTheDocument()
    })
    it('has username input', () => {
      render(<SignUpPage />)
      const input = screen.getByLabelText('Username')
      expect(input).toBeInTheDocument()
    })
    it('has email input', () => {
      render(<SignUpPage />)
      const input = screen.getByLabelText('Email')
      expect(input).toBeInTheDocument()
    })
    it('has password input', () => {
      render(<SignUpPage />)
      const input = screen.getByLabelText('Password')
      expect(input).toBeInTheDocument()
    })
    it('has password type', () => {
      render(<SignUpPage />)
      const input = screen.getByLabelText('Password')
      expect(input.type).toBe('password')
    })
    it('has password repeat input', () => {
      render(<SignUpPage />)
      const input = screen.getByLabelText('Password Repeat')
      expect(input).toBeInTheDocument()
    })
    it('has password type for password repeat', () => {
      render(<SignUpPage />)
      const input = screen.getByLabelText('Password Repeat')
      expect(input.type).toBe('password')
    })
    it('has sign up button', () => {
      render(<SignUpPage />)
      const button = screen.getByRole('button', { name: 'Sign Up' })
      expect(button).toBeInTheDocument()
    })
    it('disables the sign up button initially', () => {
      render(<SignUpPage />)
      const button = screen.getByRole('button', { name: 'Sign Up' })
      expect(button).toBeDisabled()
    })
  })
  describe('Interactions', () => {
    let button
    let usernameInput
    let emailInput
    let passwordInput
    let passwordRepeatInput
    const setup = () => {
      render(<SignUpPage />)
      usernameInput = screen.getByLabelText('Username')
      emailInput = screen.getByLabelText('Email')
      passwordInput = screen.getByLabelText('Password')
      passwordRepeatInput = screen.getByLabelText('Password Repeat')
      userEvent.type(usernameInput, 'user1')
      userEvent.type(emailInput, 'email@test.com')
      userEvent.type(passwordInput, 'P4ssword')
      userEvent.type(passwordRepeatInput, 'P4ssword')
      button = screen.getByRole('button', { name: 'Sign Up' })
    }

    it('disables button when there is an ongoing api call', async () => {
      setup()

      userEvent.click(button)
      userEvent.click(button)

      await screen.findByText('Please check your email to activate your account.')
      expect(counter).toBe(1)
    })

    it('displays loading after clicking submit', async () => {
      setup()

      let loader = screen.queryByRole('status')
      expect(loader).not.toBeInTheDocument()
      userEvent.click(button)
      loader = screen.queryByRole('status')
      expect(loader).toBeInTheDocument()
      await screen.findByText('Please check your email to activate your account.')
    })

    it('displays account activation notification after successful signup request', async () => {
      setup()

      let text
      expect(screen.queryByText('Please check your email to activate your account.')).not.toBeInTheDocument()

      userEvent.click(button)
      try {
        text = await screen.findByText('Please check your email to activate your account.')
      } catch (error) {
        // suppress error
      }
      expect(text).toBeInTheDocument()
    })
    it('hides form after successful request', async () => {
      setup()

      const form = screen.getByTestId('form-sign-up')
      userEvent.click(button)

      await waitFor(() => {
        expect(form).not.toBeInTheDocument()
      })
      // await waitForElementToBeRemoved(form)
    })
    const generateValidationError = (field, message) => {
      return rest.post('/api/1.0/users', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message
            }
          })
        )
      })
    }
    it.each`
      field         | message
      ${'username'} | ${'Username cannot be null'}
      ${'email'}    | ${'E-mail cannot be null'}
      ${'password'} | ${'Password cannot be null'}
    `('displays $message for $field', async ({ field, message }) => {
      server.use(generateValidationError(field, message))
      setup()
      userEvent.click(button)
      const validationError = await screen.findByText(message)
      expect(validationError).toBeInTheDocument()
    })

    it('hides spinner and enables button', async () => {
      server.use(generateValidationError('username', 'Username cannot be null'))
      setup()
      userEvent.click(button)
      await screen.findByText('Username cannot be null')
      const loading = screen.queryByRole('status')
      expect(loading).not.toBeInTheDocument()
      expect(button).toBeEnabled()
    })

    it('displays mismatch error message for password repeat', async () => {
      setup()
      passwordInput = screen.getByLabelText('Password')
      passwordRepeatInput = screen.getByLabelText('Password Repeat')
      userEvent.type(passwordInput, 'P4ssword')
      userEvent.type(passwordRepeatInput, 'P4ssword100')
      userEvent.click(button)
      const validationError = screen.queryByText('Password mismatch')
      expect(validationError).toBeInTheDocument()
    })

    it('it clears validation error after username field is updated', async () => {
      server.use(generateValidationError('username', 'Username cannot be null'))
      setup()
      usernameInput = screen.getByLabelText('Username')
      userEvent.click(button)
      const validationError = await screen.findByText('Username cannot be null')
      userEvent.type(usernameInput, 'new-input')
      expect(validationError).not.toBeInTheDocument()
    })

    it.each`
      field         | message                      | label
      ${'username'} | ${'Username cannot be null'} | ${'Username'}
    `('it clears validation error  ', async ({ field, message, label }) => {
      server.use(generateValidationError(field, message))
      setup()
      const input = screen.getByLabelText(label)
      userEvent.click(button)
      const validationError = await screen.findByText(message)
      userEvent.type(input, 'new-input')
      expect(validationError).not.toBeInTheDocument()
    })
  })
  describe('Internationalization', () => {
    let spanishToggle
    let englishToggle
    let passwordInput
    let passwordRepeatInput
    const setup = () => {
      render(
        <>
          <SignUpPage />
        </>
      )
      spanishToggle = screen.getByTitle('Español')
      englishToggle = screen.getByTitle('English')
      passwordInput = screen.getByLabelText(en.password)
      passwordRepeatInput = screen.getByLabelText(en.passwordRepeat)
    }

    it('initially displays all text in English', () => {
      setup()
      expect(screen.getByRole('heading', { name: en.signUp })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: en.signUp })).toBeInTheDocument()
      expect(screen.getByLabelText(en.username)).toBeInTheDocument()
      expect(screen.getByLabelText(en.email)).toBeInTheDocument()
      expect(screen.getByLabelText(en.password)).toBeInTheDocument()
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument()
    })
    it('displays all text in Spanish after changing language', () => {
      setup()
      userEvent.click(spanishToggle)
      expect(screen.getByRole('heading', { name: es.signUp })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: es.signUp })).toBeInTheDocument()
      expect(screen.getByLabelText(es.username)).toBeInTheDocument()
      expect(screen.getByLabelText(es.email)).toBeInTheDocument()
      expect(screen.getByLabelText(es.password)).toBeInTheDocument()
      expect(screen.getByLabelText(es.passwordRepeat)).toBeInTheDocument()
    })

    it('displays all text in English after changing language to English', () => {
      setup()

      userEvent.click(spanishToggle)
      userEvent.click(englishToggle)
      expect(screen.getByRole('heading', { name: en.signUp })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: en.signUp })).toBeInTheDocument()
      expect(screen.getByLabelText(en.username)).toBeInTheDocument()
      expect(screen.getByLabelText(en.email)).toBeInTheDocument()
      expect(screen.getByLabelText(en.password)).toBeInTheDocument()
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument()
    })
    it('displays password mismatch validation in Spanish', () => {
      setup()
      userEvent.click(spanishToggle)
      userEvent.type(passwordInput, 'a')
      const validationMessageInSpanish = screen.queryByText(es.passwordMismatchValidation)
      expect(validationMessageInSpanish).toBeInTheDocument()
    })

    it('sends language header an en for outgoing request', async () => {
      setup()
      userEvent.type(passwordInput, 'P4assword')
      userEvent.type(passwordRepeatInput, 'P4assword')
      const button = screen.getByRole('button', { name: en.signUp })
      const form = screen.queryByTestId('form-sign-up')
      userEvent.click(button)
      await waitForElementToBeRemoved(form)
      expect(acceptLanguageHeader).toBe('en')
    })
    it('sends language header es for outgoing request in spanish', async () => {
      setup()
      userEvent.type(passwordInput, 'P4assword')
      userEvent.type(passwordRepeatInput, 'P4assword')
      const button = screen.getByRole('button', { name: en.signUp })
      userEvent.click(spanishToggle)
      const form = screen.queryByTestId('form-sign-up')
      userEvent.click(button)
      await waitForElementToBeRemoved(form)
      expect(acceptLanguageHeader).toBe('es')
    })
  })
})
