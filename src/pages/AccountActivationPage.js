import { activate } from '../api/apiCalls'
import { useEffect, useState } from 'react'
import Alert from '../components/Alert'
import Spinner from '../components/Spinner'

const AccountActivationPage = (props) => {
  const [result, setResult] = useState()
  useEffect(() => {
    async function activateRequest() {
      setResult()
      try {
        await activate(props.match.params.token)
        setResult('success')
      } catch (error) {
        setResult('failed')
      }
    }
    activateRequest()
  }, [props.match.params.token])

  let content = (
    <div className="flex items-center gap-x-4">
      <Alert center="true" type="secondary">
        <Spinner size="big" type="secondary" />
      </Alert>
    </div>
  )

  if (result === 'success') {
    content = <Alert>Account is activated</Alert>
  } else if (result === 'failed') {
    content = <Alert type="fail">Activation failure</Alert>
  }

  return <div data-testid="activation-page">{content}</div>
}

export default AccountActivationPage
