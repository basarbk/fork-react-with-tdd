import { Component } from 'react'
import { getUserById } from '../api/apiCalls'
import Alert from '../components/Alert'
import Spinner from '../components/Spinner'
import ProfileCard from './ProfileCard'

class UserPage extends Component {
  constructor() {
    super()
    this.state = {
      user: {},
      pendingApiCall: false,
      failedResponse: undefined
    }
  }
  async componentDidMount() {
    this.setState({ pendingApiCall: true })
    try {
      const res = await getUserById(this.props.match.params.id)
      this.setState({ user: res.data })
    } catch (error) {
      this.setState({ failedResponse: error.response.data.message })
      // do nothing
    }
    this.setState({ pendingApiCall: false })
  }

  render() {
    const { user, pendingApiCall, failedResponse } = this.state
    let content = (
      <Alert type="secondary" center="true">
        <Spinner size="big" />
      </Alert>
    )
    if (!pendingApiCall) {
      if (failedResponse) {
        content = (
          <Alert type="fail" center>
            {failedResponse}
          </Alert>
        )
      } else {
        content = <ProfileCard user={user} />
      }
    }
    return (
      <>
        <div data-testid="user-page">{content}</div>
      </>
    )
  }
}

export default UserPage
