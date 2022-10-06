const Alert = (props) => {
  let className = `px-4 py-4 w-full rounded`
  if (props.type === 'success') {
    className += ' bg-green-300 text-black'
  } else if (props.type === 'fail') {
    className += ' bg-red-200 text-black border border-red-300'
  } else if (props.type === 'secondary') {
    className += ' bg-gray-200 text-black'
  }
  if (props.center) {
    className += ' text-center justify-center'
  }

  return (
    <div className={className}>
      {props.text}
      {props.children}
    </div>
  )
}

Alert.defaultProps = {
  type: 'success'
}

export default Alert
