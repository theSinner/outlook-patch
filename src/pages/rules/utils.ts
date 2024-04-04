import { MessageRule } from '@microsoft/microsoft-graph-types'

export const reorder = <T>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const exportRules = (rules: MessageRule[]) => {
  exportJSON({
    message_rules: rules.map(({ id, ...rule }) => rule),
  })
}

export const exportJSON = (data: Record<string, unknown>) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`
  const link = document.createElement('a')
  link.href = jsonString
  link.download = 'message-rules.json'

  link.click()
}
