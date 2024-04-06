import {
  OutlookCategory,
  MailFolder,
  MessageRule,
} from '@microsoft/microsoft-graph-types'
import { Client } from '@microsoft/microsoft-graph-client'

export class SettingsResource {
  static async getRuleList(
    client: Client,
    folder: string = 'inbox'
  ): Promise<MessageRule[]> {
    const ruleList: MessageRule[] = (
      await client
        .api(`/me/mailFolders/${folder}/messageRules`)
        .select('displayName,id,sequence,isEnabled,hasError,isReadOnly')
        .get()
    ).value

    return ruleList
  }

  static async exportRules(
    client: Client,
    folder: string = 'inbox'
  ): Promise<MessageRule[]> {
    const ruleList: MessageRule[] = (
      await client.api(`/me/mailFolders/${folder}/messageRules`).get()
    ).value

    return ruleList
  }

  static async createRule(
    client: Client,
    data: MessageRule,
    folder: string = 'inbox'
  ): Promise<void> {
    return client.api(`/me/mailFolders/${folder}/messageRules`).post(data)
  }

  static async updateRule(
    client: Client,
    id: string,
    data: MessageRule,
    folder: string = 'inbox'
  ): Promise<void> {
    return client
      .api(`/me/mailFolders/${folder}/messageRules/${id}`)
      .patch(data)
  }

  static async getFolderList(client: Client): Promise<MailFolder[]> {
    const ruleList: MailFolder[] = (await client.api('/me/mailFolders').get())
      .value
    return ruleList
  }

  static async getChildFolders(
    client: Client,
    id: string
  ): Promise<MailFolder[]> {
    return (await client.api(`/me/mailFolders/${id}/childFolders`).get()).value
  }

  static async createMailFolder(
    client: Client,
    displayName: string
  ): Promise<MailFolder> {
    return client.api('/me/mailFolders').post({
      displayName,
    })
  }

  static async createChildMailFolder(
    client: Client,
    displayName: string,
    parentId: string
  ): Promise<MailFolder> {
    return client.api(`/me/mailFolders/${parentId}/childFolders`).post({
      displayName,
    })
  }

  static async getCategories(client: Client): Promise<OutlookCategory[]> {
    const ruleList: OutlookCategory[] = (
      await client.api('/me/outlook/masterCategories').get()
    ).value
    return ruleList
  }

  static async createCategory(
    client: Client,
    displayName: string
  ): Promise<MailFolder> {
    return client.api('/me/outlook/masterCategories').post({
      displayName,
      color: 'preset0',
    })
  }
}
