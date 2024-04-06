import { HIERARCHY_SPLITTER } from '../constants'

export function getNameID(names: string[]) {
  return names.join(HIERARCHY_SPLITTER)?.trim().replace(/ /g, '_').toLowerCase()
}
