import { MessageRule } from '@microsoft/microsoft-graph-types'

export async function parseFile(file: Blob) {
  return new Promise<MessageRule[]>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        if (event.target?.result && typeof event.target.result === 'string') {
          const object = JSON.parse(event.target.result)
          if (object.hasOwnProperty('message_rules')) {
            resolve(object.message_rules)
            return
          }
        }
        reject('Invalid file')
      } catch (error) {
        reject('Invalid file')
      }
    }
    reader.readAsText(file)
  })
}
