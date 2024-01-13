import { PLATFORM_MESSAGE_TYPE } from '@/contentScript'
import { PlatformMessage } from '../contentScript/interface'
import { ENV } from '@/env'

/** 测试环境下，设置浏览器图标, 为测试标志 */
if (ENV.isDev) {
  chrome.action.setBadgeText({ text: '测' })
  chrome.action.setBadgeBackgroundColor({ color: '#999' })
}

/** 监听浏览器图标点击事件 */
chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return

  // 通知 contentScript 打开 QN
  chrome.tabs.sendMessage<PlatformMessage.Data>(tab.id, {
    type: PLATFORM_MESSAGE_TYPE.OPEN_QN,
  })
})
