import { render, screen } from '../test/setup'
import { setupServer } from 'msw/lib/node'
import { rest } from 'msw'
import UserList from './UserList'
import userEvent from '@testing-library/user-event'
import en from '../locale/en.json'
import es from '../locale/es.json'

const users = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@mail.com',
    image: null
  },
  {
    id: 2,
    username: 'user2',
    email: 'user2@mail.com',
    image: null
  },
  {
    id: 3,
    username: 'user3',
    email: 'user3@mail.com',
    image: null
  },
  {
    id: 4,
    username: 'user4',
    email: 'user4@mail.com',
    image: null
  },
  {
    id: 5,
    username: 'user5',
    email: 'user5@mail.com',
    image: null
  },
  {
    id: 6,
    username: 'user6',
    email: 'user6@mail.com',
    image: null
  },
  {
    id: 7,
    username: 'user7',
    email: 'user7@mail.com',
    image: null
  },
  {
    id: 8,
    username: 'user8',
    email: 'user8@mail.com',
    image: null
  },
  {
    id: 9,
    username: 'user9',
    email: 'user9@mail.com',
    image: null
  },
  {
    id: 10,
    username: 'user10',
    email: 'user10@mail.com',
    image: null
  }
]

const getPage = (page, size) => {
  let start = page * size
  let end = start + size
  let totalPages = Math.ceil(users.length / size)
  return {
    content: users.slice(start, end),
    page,
    size,
    totalPages
  }
}

const server = setupServer(
  rest.get('/api/1.0/users', (req, res, ctx) => {
    let page = Number.parseInt(req.url.searchParams.get('page'))
    let size = Number.parseInt(req.url.searchParams.get('size'))
    if (Number.isNaN(page)) {
      page = 0
    }
    if (Number.isNaN(size)) {
      size = 5
    }
    return res(ctx.status(200), ctx.json(getPage(page, size)))
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

const setup = () => {
  render(<UserList />)
}

describe('User List', () => {
  describe('Interactions', () => {
    it('displays 3 users in list', async () => {
      setup()
      const users = await screen.findAllByText(/user/)
      expect(users.length).toBe(3)
    })
    it('displays next page link', async () => {
      setup()
      await screen.findAllByText('user1')
      expect(screen.queryByText('next >')).toBeInTheDocument()
    })
    it('displays next page after clicking next', async () => {
      setup()
      await screen.findAllByText('user1')
      let next = screen.queryByText('next >')
      userEvent.click(next)
      let user4 = await screen.findByText('user4')
      expect(user4).toBeInTheDocument()
    })
    it('hides next page link at last page', async () => {
      setup()
      await screen.findAllByText('user1')
      userEvent.click(screen.queryByText('next >'))
      await screen.findByText('user4')
      userEvent.click(screen.queryByText('next >'))
      await screen.findByText('user7')
      userEvent.click(screen.queryByText('next >'))
      await screen.findByText('user10')
      expect(screen.queryByText('next >')).not.toBeInTheDocument()
    })
    it('does not display previous page link on first page', async () => {
      setup()
      await screen.findByText('user1')
      expect(screen.queryByText('< prev')).not.toBeInTheDocument()
    })
    it('displays previous page link after first page', async () => {
      setup()
      await screen.findByText('user1')
      userEvent.click(screen.queryByText('next >'))
      await screen.findByText('user4')
      expect(screen.queryByText('< prev')).toBeInTheDocument()
    })
    it('displays previous page after clicking previous page link', async () => {
      setup()
      await screen.findByText('user1')
      userEvent.click(screen.queryByText('next >'))
      await screen.findByText('user4')
      userEvent.click(screen.queryByText('< prev'))
      const firstUserOnPage = await screen.findByText('user1')
      expect(firstUserOnPage).toBeInTheDocument()
    })
    it('displays spinner while api call is in progress', async () => {
      setup()
      let loader = screen.getByRole('status')
      await screen.findByText('user1')
      expect(loader).not.toBeInTheDocument()
    })
  })
  describe('Internationalization', () => {
    beforeEach(() => {
      server.use(
        rest.get('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(getPage(1, 3)))
        })
      )
    })

    it('initially displays header and navigation links in english', async () => {
      setup()
      await screen.findByText('user4')
      expect(screen.getByText(en.users)).toBeInTheDocument()
      expect(screen.getByText(en.nextPage)).toBeInTheDocument()
      expect(screen.getByText(en.previousPage)).toBeInTheDocument()
    })
    it('initially displays header and navigation links in spanish after selecting spanish', async () => {
      setup()
      await screen.findByText('user4')
      const spanishToggle = screen.getByTitle('Espa??ol')
      userEvent.click(spanishToggle)

      expect(screen.getByText(es.users)).toBeInTheDocument()
      expect(screen.getByText(es.nextPage)).toBeInTheDocument()
      expect(screen.getByText(es.previousPage)).toBeInTheDocument()
    })
  })
})
