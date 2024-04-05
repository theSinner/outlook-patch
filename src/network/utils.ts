import { IMsalContext } from '@azure/msal-react'
import { Client } from '@microsoft/microsoft-graph-client'
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser'
import { InteractionType, PublicClientApplication } from '@azure/msal-browser'
import { AppConfig } from '../config'

let graphClient: Client | undefined

export function ensureClient(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
) {
  if (!graphClient) {
    graphClient = Client.initWithMiddleware({
      authProvider,
    })
  }

  return graphClient
}

export function getAuthProvider(
  msal: IMsalContext
): AuthCodeMSALBrowserAuthenticationProvider {
  return new AuthCodeMSALBrowserAuthenticationProvider(
    msal.instance as PublicClientApplication,
    {
      account: msal.instance.getActiveAccount()!,
      scopes: AppConfig.scopes,
      interactionType: InteractionType.Popup,
    }
  )
}

export function getClient(msal: IMsalContext): Client {
  return ensureClient(getAuthProvider(msal))
}
