import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import useHover from '../useHover'
import { useRef } from 'react'

const LanguageSelector = () => {
  const { i18n } = useTranslation()
  const ref = useRef()
  const on = useHover(ref.current)

  let size = 24
  if (on) {
    size = 48
  }

  return (
    <div ref={ref}>
      <button type="button" title="Español" onClick={() => i18n.changeLanguage('es')}>
        <img src={`https://www.countryflagicons.com/FLAT/${size}/ES.png`} />
      </button>
      <button type="button" title="English" onClick={() => i18n.changeLanguage('en')}>
        <img src={`https://www.countryflagicons.com/FLAT/${size}/US.png`} />
      </button>
    </div>
  )
}

LanguageSelector.propTypes = {
  i18n: PropTypes.object
}

export default LanguageSelector
