import { MailContext } from './context'
import { useMail } from './hook'
import type { Props } from './types'

export default function MailProvider({ children }: Props) {
  const mailContextData = useMail()
  return (
    <MailContext.Provider value={mailContextData}>
      {children}
    </MailContext.Provider>
  )
}
