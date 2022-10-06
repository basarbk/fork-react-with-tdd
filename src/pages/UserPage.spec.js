import { render, screen, waitFor } from '../test/setup'
import UserPage from './UserPage'
import { setupServer } from 'msw/lib/node'
import { rest } from 'msw'

// let requestBody
// let acceptLanguageHeader
const server = setupServer()

beforeEach(() => {})
server.resetHandlers()
beforeAll(() => {
  server.listen()
})
afterAll(() => {
  server.close()
})

describe('User Page', () => {
  beforeEach(() => {
    server.use(
      rest.get('/api/1.0/users/:id', (req, res, ctx) => {
        const id = Number.parseInt(req.params.id)
        if (req.params.id === '1') {
          return res(
            ctx.json({
              id: id,
              username: 'user' + id,
              email: `user${id}@mail.com`,
              image: null
            })
          )
        } else {
          return res(
            ctx.status(404),
            ctx.json({
              message: 'User not found'
            })
          )
        }
      })
    )
  })
  it('displays user name on page when user is found', async () => {
    const match = { params: { id: 1 } }
    render(<UserPage match={match} />)
    await waitFor(() => {
      expect(screen.queryByText('user1')).toBeInTheDocument()
    })
  })
  it('displays a spinner while api call is in progress', async () => {
    const match = { params: { id: 1 } }
    render(<UserPage match={match} />)
    let loader = screen.getByRole('status')
    await screen.findByText(/user/)
    expect(loader).not.toBeInTheDocument()
  })
  it('displays error message received from backend when user is not found', async () => {
    const match = { params: { id: 2000 } }
    render(<UserPage match={match} />)
    await waitFor(() => {
      expect(screen.queryByText('User not found')).toBeInTheDocument()
    })
  })
})
