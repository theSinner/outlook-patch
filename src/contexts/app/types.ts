import { Client } from '@microsoft/microsoft-graph-client'
import { MouseEventHandler, ReactNode } from 'react'

export interface AppUser {
  displayName?: string
  email?: string
  avatar?: string
  timeZone?: string
  timeFormat?: string
}

export interface AppError {
  message: string
  debug?: string
}

export interface AppContextData {
  user?: AppUser
  error?: AppError
  signIn?: MouseEventHandler<HTMLElement>
  signOut?: MouseEventHandler<HTMLElement>
  displayError?: (message: string, debug?: string) => void
  clearError?: () => void
  client?: Client
  isLoading?: boolean
}

export interface Props {
  children: ReactNode
}
