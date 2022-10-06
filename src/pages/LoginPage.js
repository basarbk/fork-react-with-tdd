import PropTypes from 'prop-types'
import Input from '../components/Input'
import { login } from '../api/apiCalls'
import Alert from '../components/Alert'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ButtonWithProgress from '../components/ButtonWithProgress'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../state/authSlice'
import { useHistory } from 'react-router-dom'

const LoginPage = () => {
  const [apiProgress, setApiProgress] = useState(false)
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [failMessage, setFailMessage] = useState()
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    setFailMessage()
  }, [email, password])

  const submit = async (event) => {
    event.preventDefault()
    setApiProgress(true)
    try {
      const response = await login({ email, password })
      history.push('/')
      const payload = { ...response.data, header: `Bearer ${response.data.token}` }
      dispatch(loginSuccess(payload))
    } catch (error) {
      setFailMessage(error.response.data.message || 'Error occurred')
      // test
    }
    setApiProgress(false)
  }

  let disabled = false
  if (apiProgress || !(email && password)) {
    disabled = true
  }

  return (
    <div data-testid="login-page">
      <div className="form-container max-w-lg mx-auto">
        <form className="border mt-10 rounded" data-testid="form-sign-up">
          <div className="fieldHeader px-10 py-4 bg-gray-200 text-center">
            <h1 className="text-2xl">{t('login')}</h1>
          </div>
          <div className="fieldBody p-10">
            <div className="fieldRow">
              <Input
                id="email"
                label={t('email')}
                onChange={(event) => {
                  setEmail(event.target.value)
                }}
              />
            </div>
            <div className="fieldRow">
              <Input
                id="password"
                type="password"
                label={t('password')}
                onChange={(event) => {
                  setPassword(event.target.value)
                }}
              />
            </div>
            {failMessage && <Alert type="fail">{failMessage}</Alert>}
            <div className="text-center">
              <ButtonWithProgress disabled={disabled} apiProgress={apiProgress} onClick={submit}>
                {t('login')}
              </ButtonWithProgress>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

LoginPage.propTypes = {
  random: PropTypes.number
}

export default LoginPage
