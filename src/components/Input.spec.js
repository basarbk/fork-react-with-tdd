import { render, screen } from '../test/setup'
import Input from './Input'

it('has is-invalid class for input when help is set', () => {
  const { container } = render(<Input help="Error message" />)
  const input = container.querySelector('input')
  expect(input.classList).toContain('is-invalid')
})

it('displays help message when it is set', () => {
  render(<Input help="Error message" />)
  const message = screen.queryByText('Error message')
  expect(message).toBeInTheDocument()
})

it('does not have is-invalid class for input when help is not set', () => {
  const { container } = render(<Input />)
  const input = container.querySelector('input')
  expect(input.classList).not.toContain('is-invalid')
})
