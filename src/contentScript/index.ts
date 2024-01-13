import { PlatformMessage } from './interface'

/** 通讯消息类型 */
export const PLATFORM_MESSAGE_TYPE = Object.freeze({
  OPEN_QN: 'open-qn',
  CLOSE_QN: 'close-qn',
})

chrome.runtime.onMessage.addListener(async (data: PlatformMessage.Data) => {
  const { type } = data
  // 按需加载主体代码，避免在页面加载时就加载主体代码，影响用户正常的页面加载速度
  const { App } = await import('../launch')

  switch (type) {
    case PLATFORM_MESSAGE_TYPE.OPEN_QN:
      if (App.isOpen === true) {
        App.close()
      } else {
        App.open()
      }
      break
    case PLATFORM_MESSAGE_TYPE.CLOSE_QN:
      App.close()
      break
  }
})
