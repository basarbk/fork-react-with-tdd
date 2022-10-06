import PropTypes from 'prop-types'
import { Component } from 'react'
import Input from '../components/Input'
import { withTranslation } from 'react-i18next'
import { signUp } from '../api/apiCalls'
import Alert from '../components/Alert'
import withHover from '../withHover'
import ButtonWithProgress from '../components/ButtonWithProgress'

class SignUpPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      email: '',
      password: '',
      passwordRepeat: '',
      apiProgress: false,
      signUpSuccess: false,
      errors: {}
    }

    this.onChangeValue = (event) => {
      const { id, value } = event.target
      const errorsCopy = { ...this.state.errors }
      delete errorsCopy[id]
      this.setState({
        [id]: value,
        errors: errorsCopy
      })
    }

    this.submit = async (event) => {
      event.preventDefault()
      const { username, email, password } = this.state
      const body = {
        username,
        email,
        password
      }
      this.setState({ apiProgress: true })
      // axios.post('/api/1.0/users', body)
      try {
        await signUp(body)
        this.setState({ signUpSuccess: true })
      } catch (error) {
        if (error.response.status === 400) {
          this.setState({ errors: error.response.data.validationErrors })
        }
      }
      this.setState({ apiProgress: false })
    }
    this.onClickSpanish = () => {
      this.props.i18n.changeLanguage('es')
    }
    this.onClickEnglish = () => {
      this.props.i18n.changeLanguage('en')
    }
  }

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    let disabled = true
    const { t } = this.props
    const { password, passwordRepeat, apiProgress, signUpSuccess, errors } = this.state
    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat
    }
    if (apiProgress) {
      disabled = true
    }
    let passwordMismatch = password !== passwordRepeat ? t('passwordMismatchValidation') : ''
    return (
      <div data-testid="signup-page">
        <div className="form-container max-w-lg mx-auto">
          {!signUpSuccess ? (
            <form className="border mt-10 rounded" data-testid="form-sign-up">
              <div className="fieldHeader px-10 py-4 bg-gray-200 text-center">
                <h1 className="text-2xl">{t('signUp')}</h1>
              </div>
              <div className="fieldBody p-10">
                <div className="fieldRow">
                  <Input id="username" label={t('username')} onChange={this.onChangeValue} help={errors.username} />
                </div>
                <div className="fieldRow">
                  <Input id="email" label={t('email')} onChange={this.onChangeValue} help={errors.email} />
                </div>
                <div className="fieldRow">
                  <Input
                    id="password"
                    type="password"
                    label={t('password')}
                    onChange={this.onChangeValue}
                    help={errors.password}
                  />
                </div>
                <div className="fieldRow">
                  <Input
                    id="passwordRepeat"
                    type="password"
                    label={t('passwordRepeat')}
                    onChange={this.onChangeValue}
                    help={passwordMismatch}
                  />
                </div>
                <div className="text-center">
                  <ButtonWithProgress disabled={disabled} apiProgress={apiProgress} onClick={this.submit}>
                    {t('signUp')}
                  </ButtonWithProgress>
                </div>
              </div>
            </form>
          ) : (
            <Alert>Please check your email to activate your account.</Alert>
          )}
        </div>
      </div>
    )
  }
}

SignUpPage.propTypes = {
  t: PropTypes.func,
  i18n: PropTypes.object
}

const SignUpPageWithTranslation = withTranslation()(SignUpPage)

export default withHover(SignUpPageWithTranslation)
