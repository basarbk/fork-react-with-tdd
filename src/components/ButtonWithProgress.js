import Spinner from './Spinner'

const ButtonWithProgress = (props) => {
  const { disabled, apiProgress, onClick } = props
  return (
    <button type="submit" className="btn mt-8" disabled={disabled} onClick={onClick}>
      {apiProgress && <Spinner type="white" />}
      <span className="pl-1">{props.children}</span>
    </button>
  )
}

export default ButtonWithProgress
