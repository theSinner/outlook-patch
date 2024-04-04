import { MessageRule } from '@microsoft/microsoft-graph-types'
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
    return await client.api(`/me/mailFolders/${folder}/messageRules`).post(data)
  }

  static async updateRule(
    client: Client,
    id: string,
    data: MessageRule,
    folder: string = 'inbox'
  ): Promise<void> {
    return await client
      .api(`/me/mailFolders/${folder}/messageRules/${id}`)
      .patch(data)
  }
}
