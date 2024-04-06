import { Context, createContext } from 'react'

import { MailContextData } from './types'

export const MailContext: Context<MailContextData> = createContext(
  {} as MailContextData
)
