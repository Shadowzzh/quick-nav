import { PlatformMessage } from './interface'

chrome.runtime.onMessage.addListener(async (data: PlatformMessage.Data) => {
  const { type } = data
  // 按需加载主体代码，避免在页面加载时就加载主体代码，影响用户正常的页面加载速度
  const { App } = await import('./launch')

  switch (type) {
    case 'open-qn':
      if (App.isOpen === true) {
        App.close()
      } else {
        App.open()
      }
      break
    case 'close-qn':
      App.close()
      break
  }
})
