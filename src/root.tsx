import { MsalProvider } from '@azure/msal-react'
import { IPublicClientApplication } from '@azure/msal-browser'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './contexts'
import { Router } from './routes'
import { ConfigProvider, App } from 'antd'

type Props = {
  pca: IPublicClientApplication
}

export function Root({ pca }: Props) {
  return (
    <ConfigProvider theme={{ cssVar: true }}>
      <App>
        <BrowserRouter>
          <MsalProvider instance={pca}>
            <AppProvider>
              <Router />
            </AppProvider>
          </MsalProvider>
        </BrowserRouter>
      </App>
    </ConfigProvider>
  )
}
