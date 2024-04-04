import { useContext } from 'react'
import { Button } from 'antd'

import { AppContext } from '../../contexts/app/context'

import './component.scss'

export default function Login() {
  const { signIn } = useContext(AppContext)
  return (
    <div id="login-page">
      <Button onClick={signIn}>Sign In</Button>
    </div>
  )
}
