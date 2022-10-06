import PropTypes from 'prop-types'

const Input = (props) => {
  const { type = 'text', id, label, onChange, help } = props

  const inputClass = help ? 'is-invalid' : ''
  return (
    <div className="fieldInput">
      <label htmlFor={id}>{label}</label>
      <input type={type} className={inputClass} id={id} onChange={onChange} />
      {help && <span className="text-red-700 block mt-2">{help}</span>}
    </div>
  )
}

Input.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  help: PropTypes.string
}

export default Input
