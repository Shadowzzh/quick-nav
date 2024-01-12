import { PLATFORM_MESSAGE_TYPE } from '../contentScript/constant'
import { PlatformMessage } from '../contentScript/interface'

console.log('background is running')

chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return
  chrome.tabs.sendMessage<PlatformMessage.Data>(tab.id, {
    type: PLATFORM_MESSAGE_TYPE.OPEN_QN,
  })
})
