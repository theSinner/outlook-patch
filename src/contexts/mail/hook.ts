import { useState, useEffect, useContext } from 'react'

import { AppContext } from '../app'
import { getFolders } from './utils'
import { MailFolderExtended } from './types'

export function useMail() {
  const { client } = useContext(AppContext)
  const [mailFolders, setMailFolders] = useState<MailFolderExtended[]>()
  const [mailFoldersIDMap, setMailFoldersIDMap] =
    useState<Record<string, MailFolderExtended>>()
  const [mailFoldersNameMap, setMailFoldersNameMap] =
    useState<Record<string, string>>()

  useEffect(() => {
    if (client) {
      getFolders(client).then((data) => {
        setMailFolders(data.folders)
        setMailFoldersIDMap(data.idMap)
        setMailFoldersNameMap(data.nameMap)
      })
    }
  }, [])

  return {
    mailFolders,
    mailFoldersIDMap,
    mailFoldersNameMap,
  }
}
