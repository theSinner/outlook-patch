import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { PublicClientApplication } from '@azure/msal-browser'
import { Root } from './root'
import { AppConfig } from './config'

import './index.scss'

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: AppConfig.appId,
    redirectUri: AppConfig.redirectUri,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  },
})
const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <Root pca={msalInstance} />
  </StrictMode>
)
