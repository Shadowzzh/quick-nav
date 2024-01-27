import { syncStorage } from '@/utils/storage'
import { DEFAULT_CONFIG } from '../../defaultConfig'
import { cssRule } from '../../utils/cssRule'
import { APP_THEME } from '../constant'

export const defaultThemeLight = {
  color: '#3b3b3b',
  primary: '#536EDC',
  selectedColor: '#3b3b3b',
  selectedBackground: '#e7f0fc',
  shadow: 'rgb(0 0 0 / 6%) 0px 0px 10px 1px',
  background: '#fff',
  backgroundHover: '#f5f5f5',
  backgroundDisabled: '#ebebeb',
  backgroundActive: '#ebebeb',
  itemHoverBackground: '#E2E8F0',
  border: 'rgb(235, 238, 245)',
  wavesBackground: 'rgba(0, 0, 0, 0.2)',
  icon: '#999',
  invertIcon: '#777',
  scrollBarBackground: '#bbb',
  colorDisabled: '#ddd',
  danger: '#ff9393',
}

export const defaultThemeDark = {
  color: '#ccc',
  border: '#2d2d2d',
  primary: '#898ae9',
  shadow: 'rgba(1, 1, 1, 0.15) 0px 0px 12px 1px',
  selectedBackground: '#594dc0',
  selectedColor: '#eee',
  background: '#282C34',
  backgroundDisabled: '#2E3238',
  backgroundHover: '#31353B',
  backgroundActive: '#41454B',
  wavesBackground: '#71757B',
  itemHoverBackground: '#383e4a',
  invertIcon: '#ddd',
  icon: '#ccc',
  scrollBarBackground: '#6d6d6e',
  colorDisabled: '#6E7073',
  danger: '#bb3d3e',
}

/** 获取主题色配置 */
export const getThemeColorOption = async () => {
  const theme = (await syncStorage.get('theme')) ?? APP_THEME.DARK

  if (theme === APP_THEME.LIGHT) {
    return defaultThemeLight
  }

  if (theme === APP_THEME.DARK) {
    return defaultThemeDark
  }

  return defaultThemeDark
}

cssRule.add(
  ':root',
  `
    --animation-ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
    --animation-ease-out-circ: cubic-bezier(0.165, 0.84, 0.44, 1);
  `,
)
cssRule.add(
  `:root [data-${DEFAULT_CONFIG.THEME_NAME}='light']`,
  `
    --theme-primary: ${defaultThemeLight.primary};
    --theme-color: ${defaultThemeLight.color};
    --theme-invertIcon: ${defaultThemeLight.invertIcon};
    --theme-icon: ${defaultThemeLight.icon};
    --theme-border: ${defaultThemeLight.border};
    --theme-shadow: ${defaultThemeLight.shadow};
    --theme-waves-background: ${defaultThemeLight.wavesBackground};
    --theme-background: ${defaultThemeLight.background};
    --theme-background-hover: ${defaultThemeLight.backgroundHover};
    --theme-background-active: ${defaultThemeLight.backgroundActive};
    --theme-selectedColor:${defaultThemeLight.selectedColor};
    --theme-selectedBackground:${defaultThemeLight.selectedBackground};
    --theme-item-hover-background: ${defaultThemeLight.itemHoverBackground};
    --theme-scrollBar-background: ${defaultThemeLight.scrollBarBackground};
    --theme-background-disabled: ${defaultThemeLight.backgroundDisabled};
    --theme-color-disabled: ${defaultThemeLight.colorDisabled};
    --theme-danger: ${defaultThemeLight.danger};
  `,
)

cssRule.add(
  `:root [data-${DEFAULT_CONFIG.THEME_NAME}='dark']`,
  `
    --theme-primary: ${defaultThemeDark.primary};
    --theme-color: ${defaultThemeDark.color};
    --theme-invertIcon: ${defaultThemeDark.invertIcon};
    --theme-icon: ${defaultThemeDark.icon};
    --theme-border: ${defaultThemeDark.border};
    --theme-shadow: ${defaultThemeDark.shadow};
    --theme-waves-background: ${defaultThemeDark.wavesBackground};
    --theme-background: ${defaultThemeDark.background};
    --theme-background-hover: ${defaultThemeDark.backgroundHover};
    --theme-background-active: ${defaultThemeDark.backgroundActive};
    --theme-selectedColor:${defaultThemeDark.selectedColor};
    --theme-selectedBackground:${defaultThemeDark.selectedBackground};
    --theme-item-hover-background: ${defaultThemeDark.itemHoverBackground};
    --theme-scrollBar-background: ${defaultThemeLight.scrollBarBackground};
    --theme-background-disabled: ${defaultThemeDark.backgroundDisabled};
    --theme-color-disabled: ${defaultThemeDark.colorDisabled};
    --theme-danger: ${defaultThemeDark.danger};
  `,
)
