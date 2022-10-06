import { withRouter } from 'react-router-dom'
import defaultProfileImage from '../assets/profile.png'

const UserListItem = (props) => {
  const { user, history } = props
  return (
    <li
      className="py-4 px-4 border-b border-gray-200 cursor-pointer"
      onClick={() => {
        history.push(`/user/${user.id}`)
      }}
    >
      <img src={defaultProfileImage} className="rounded-full shadow-sm" width="30" alt="profile image" />
      {user.username}
    </li>
  )
}

export default withRouter(UserListItem)
