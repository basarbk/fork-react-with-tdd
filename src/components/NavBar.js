import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { selectAuth } from '../state/authSlice'
import { useSelector } from 'react-redux'

const NavBar = () => {
  const { t } = useTranslation()
  const auth = useSelector(selectAuth)
  return (
    <nav className="bg-gray-200 py-4">
      <div className="container justify-between flex gap-x-4">
        <Link to="/" title="Home">
          Home
        </Link>
        <div className="flex gap-x-4">
          {!auth.isLoggedIn && (
            <>
              <Link to="/signup" title="Sign Up">
                {t('signUp')}
              </Link>
              <Link to="/login" title="Log In">
                Log In
              </Link>
            </>
          )}
          {auth.isLoggedIn && <Link to={`/user/${auth.id}`}>My Profile</Link>}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
