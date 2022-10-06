import { Component } from 'react'
import { loadUsers } from '../api/apiCalls'
import UserListItem from './UserListItem'
import { withTranslation } from 'react-i18next'
import Spinner from './Spinner'

class UserList extends Component {
  state = {
    page: {
      content: [],
      page: 0,
      size: 0,
      totalPages: 0
    },
    pendingApiCall: false
  }
  componentDidMount() {
    this.loadData()
  }

  loadData = async (pageIndex) => {
    this.setState({ pendingApiCall: true })
    try {
      const { data } = await loadUsers(pageIndex)
      this.setState({ page: data })
    } catch (error) {
      // do nothing
    }
    this.setState({ pendingApiCall: false })
  }

  render() {
    const { pendingApiCall } = this.state
    const { totalPages, page, content } = this.state.page
    const { t } = this.props
    return (
      <div className="card border border-gray-400 rounded">
        <div className="card-header text-center p-4 bg-gray-100">
          <h3>{t('users')}</h3>
        </div>
        <ul>
          {content.map((user) => {
            return <UserListItem user={user} key={user.id} />
          })}
        </ul>
        {!pendingApiCall && (
          <div className="div p-4 flex justify-between">
            <div>
              {page > 0 && (
                <button className="btn" onClick={() => this.loadData(page - 1)}>
                  {t('previousPage')}
                </button>
              )}
            </div>
            <div>
              {page < totalPages - 1 && (
                <button className="btn" onClick={() => this.loadData(page + 1)}>
                  {t('nextPage')}
                </button>
              )}
            </div>
          </div>
        )}
        {pendingApiCall && (
          <div className="flex justify-center p-4">
            <Spinner />
          </div>
        )}
      </div>
    )
  }
}

export default withTranslation()(UserList)
