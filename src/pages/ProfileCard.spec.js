import { render, screen } from '../test/setup'
import ProfileCard from './ProfileCard'
import storage from '../state/storage'

describe('Profile Card', () => {
  const setup = (
    user = {
      id: 5,
      username: 'user5'
    }
  ) => {
    storage.setItem('auth', { id: 5, username: 'user5' })
    render(<ProfileCard user={user} />)
  }
  it('displays edit button when logged is shown on card', () => {
    setup()
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })
  it('does not display edit button for another user', () => {
    setup({ id: 2, username: 'user2' })
    console.log(storage.getItem('auth'))
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
  })
})
