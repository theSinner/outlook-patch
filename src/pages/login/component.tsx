import { useContext } from 'react'
import { Typography, Button } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import { AppContext } from '../../contexts/app/context'

import './component.scss'

const { Title } = Typography

export default function Login() {
  const { signIn } = useContext(AppContext)
  return (
    <div id="login-page">
      <div className="content-wrapper">
        <div className="logo-wrapper">
          <img className="logo" src="/logo.png" alt="Outlook Patch" />
          <Title level={1} className="title">
            Outlook Patch
          </Title>
        </div>
        <button className="login-button" onClick={signIn}>
          <img src="/sign-in.svg" alt="Sign in with Microsoft" />
        </button>
      </div>
      <div id="github-button-wrapper">
        <Button
          icon={<GithubOutlined />}
          href="https://github.com/theSinner/outlook-patch"
          target="_blank"
          ghost
        >
          View on Github
        </Button>
      </div>
    </div>
  )
}
