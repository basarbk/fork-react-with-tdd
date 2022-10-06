import defaultProfileImage from '../assets/profile.png'
import { useSelector } from 'react-redux'

const ProfileCard = (props) => {
  const { user } = props
  const id = useSelector((store) => store.auth.id)

  return (
    <div className="card border border-gray-400 rounded-md text-center overflow-hidden">
      <div className="card-header p-4 bg-gray-100 flex justify-center">
        <img src={defaultProfileImage} alt="profile" width="200" height="200" className="rounded-full shadow-sm" />
      </div>
      <div className="card-body py-4 px-4 border-b border-gray-200 ">
        <h3>{user.username}</h3>
        {id}
        {user.id === id && (
          <button className="btn" type="button">
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfileCard
