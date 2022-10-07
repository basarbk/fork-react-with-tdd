import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import LanguageSelector from '../components/LanguageSelector'
import { Provider } from 'react-redux'
import store from '../state/store'

const AllTheProviders = ({ children }) => {
  return (
    <Router>
      <Provider store={store()}>
        {children}
        <LanguageSelector />
      </Provider>
    </Router>
  )
}

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
