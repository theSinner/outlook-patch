import { Context, createContext } from 'react'

import { AppContextData } from './types'

export const AppContext: Context<AppContextData> = createContext(
  {} as AppContextData
)
