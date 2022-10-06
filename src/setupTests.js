// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import i18n from './locale/i18n'
import { act } from 'react-dom/test-utils'
import { logout } from './state/authSlice'
import { cleanup } from '@testing-library/react'
import store from './state/store'
import storage from './state/storage'

afterEach(() => {
  act(() => {
    i18n.changeLanguage('en')
  })
  store.dispatch(logout())
  storage.clear()
  cleanup()
})
