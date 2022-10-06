const Spinner = (prop) => {
  let className = 'inline-block rounded-full loader'
  if (prop.type === 'primary') {
    className += ' border-blue-600'
  } else if (prop.type === 'secondary') {
    className += ' border-gray-600'
  } else if (prop.type === 'white') {
    className += ' border-white'
  }
  if (prop.size === 'big') {
    className += ' border-4 w-12 h-12'
  } else {
    className += ' border-2 w-4 h-4'
  }
  return (
    <div className="inline-block">
      <span role="status" className={className}></span>
    </div>
  )
}

Spinner.defaultProps = {
  type: 'primary',
  size: 'small'
}

export default Spinner
