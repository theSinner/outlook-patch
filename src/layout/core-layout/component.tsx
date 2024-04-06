import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Typography, Menu, Button, theme } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GithubOutlined,
} from '@ant-design/icons'

import { Props } from './types'

import './component.scss'
import { MENU_ITEMS, MENU_URL_MAP } from './constants'

const { Header, Sider, Content } = Layout
const { Title } = Typography

export default function CoreLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const onMenuClick = (item: string) => {
    if (item && MENU_URL_MAP.hasOwnProperty(item)) {
      navigate(MENU_URL_MAP[item])
    }
  }

  return (
    <Layout id="core-layout">
      <Sider
        className="menu-slider"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['mail-settings-rules']}
          items={MENU_ITEMS}
          onClick={({ key }) => onMenuClick(key)}
        />
        <div id="github-button-wrapper">
          <Button
            icon={<GithubOutlined />}
            type="primary"
            href="https://github.com/theSinner/outlook-patch"
            target="_blank"
          >
            {!collapsed && 'View in Github'}
          </Button>
        </div>
      </Sider>
      <Layout>
        <Header
          id="app-header-wrapper"
          style={{ padding: 0, background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <img className="logo" src="/logo.png" alt="Outlook Patch" />
          <Title className="title" level={3}>
            Outlook Patch
          </Title>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
