import { QN } from '../contentScript/interface'

interface StorageRecord {
  navigatorPanel: {
    position: QN.Position
    size: QN.Size
  }
}

/**
 * 异步存储
 *
 */
export const syncStorage = {
  /** 获取 Storage 值 */
  async get<K extends keyof StorageRecord, Rest extends Array<keyof any>>(
    ...path: [K, ...Rest]
  ): Promise<PathValue<StorageRecord, [K, ...Rest]> | undefined> {
    const data: Record<PropertyKey, any> = await chrome.storage.sync.get(path)
    let result: any = data

    for (const key of path) {
      result = result[key]
    }

    return result
  },

  set,
}

/** 设置 Storage 值 */
async function set<K extends keyof StorageRecord>(keys: K, value: StorageRecord[K]): Promise<void>
async function set<K extends keyof StorageRecord, L extends Array<keyof any>>(
  keys: [K, ...L],
  value: PathValue<StorageRecord, [K, ...L]>,
): Promise<void>
async function set(this: typeof syncStorage, keys: any, value: any): Promise<void> {
  let data = await chrome.storage.sync.get()
  if (!Array.isArray(keys)) return

  keys.reduce((acc, key, index) => {
    let nextPropValue = acc[key]

    if (nextPropValue === undefined) {
      acc[key] = {}
    }

    if (index === keys.length - 1) {
      acc[key] = value
    }

    return acc[key]
  }, data ?? {})

  return chrome.storage.sync.set({ ...data })
}
