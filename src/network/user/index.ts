import { User } from '@microsoft/microsoft-graph-types'
import { Client } from '@microsoft/microsoft-graph-client'

export class UserResource {
  static async getUser(client: Client): Promise<User> {
    const user: User = await client
      .api('/me')
      .select('displayName,mail,mailboxSettings,userPrincipalName')
      .get()

    return user
  }
}
