import { useState, useEffect, useMemo } from 'react'

import { useMsal } from '@azure/msal-react'
import { AppUser, AppError } from './types'
import { AppConfig } from '../../config'
import { UserResource, getClient } from '../../network'

export function useApp() {
  const msal = useMsal()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<AppUser>()
  const [error, setError] = useState<AppError>()

  const client = useMemo(() => {
    return getClient(msal)
  }, [msal])

  const displayError = (message: string, debug?: string) => {
    setError({ message, debug })
  }

  const clearError = () => {
    setError(undefined)
  }

  useEffect(() => {
    if (user && isLoading) {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    const checkUser = async () => {
      const accounts = msal.instance.getAllAccounts()
      if (!accounts?.length) {
        setIsLoading(false)
      }
      if (!user) {
        try {
          const account = msal.instance.getActiveAccount()
          if (account) {
            const userData = await UserResource.getUser(client)

            setUser({
              displayName: userData.displayName || '',
              email: userData.mail || userData.userPrincipalName || '',
              timeFormat: userData.mailboxSettings?.timeFormat || 'h:mm a',
              timeZone: userData.mailboxSettings?.timeZone || 'UTC',
            })
          }
        } catch (err: any) {
          displayError(err.message)
        }
      }
    }
    checkUser()
  })

  const signIn = async () => {
    await msal.instance.loginPopup({
      scopes: AppConfig.scopes,
      prompt: 'select_account',
    })

    const accounts = msal.instance.getAllAccounts()
    if (accounts && accounts.length > 0) {
      msal.instance.setActiveAccount(accounts[0])
    }

    // Get the user from Microsoft Graph
    const userData = await UserResource.getUser(client)

    setUser({
      displayName: userData.displayName || '',
      email: userData.mail || userData.userPrincipalName || '',
      timeFormat: userData.mailboxSettings?.timeFormat || '',
      timeZone: userData.mailboxSettings?.timeZone || 'UTC',
    })
  }

  const signOut = async () => {
    window.sessionStorage.clear()
    setUser(undefined)
  }

  return {
    user,
    error,
    signIn,
    signOut,
    displayError,
    clearError,
    client,
    isLoading,
  }
}
