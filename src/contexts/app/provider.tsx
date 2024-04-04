import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

import Login from '../../pages/login/component'
import { AppContext } from './context'
import { useApp } from './hook'
import type { Props } from './types'

export default function AppProvider({ children }: Props) {
  const auth = useApp()
  if (auth.isLoading) {
    return (
      <div className="full-size-page">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    )
  }
  return (
    <AppContext.Provider value={auth}>
      {auth.user ? children : <Login />}
    </AppContext.Provider>
  )
}
