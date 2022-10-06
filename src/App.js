import SignUpPage from './pages/SignUpPage'
import LanguageSelector from './components/LanguageSelector'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { Route } from 'react-router-dom'
import UserPage from './pages/UserPage'
import AccountActivationPage from './pages/AccountActivationPage'
import NavBar from './components/NavBar'

function App() {
  return (
    <>
      <NavBar />
      <div className="container pt-4">
        <Route exact path="/" component={HomePage} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/user/:id" component={UserPage} />
        <Route path="/activate/:token" component={AccountActivationPage} />
        <div className="flex justify-center py-4">
          <LanguageSelector text="text prop is set" />
        </div>
      </div>
    </>
  )
}

export default App
