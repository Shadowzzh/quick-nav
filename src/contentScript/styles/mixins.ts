import { DEFAULT_CONFIG } from '../../defaultConfig'
import { cssRule } from '../../utils/cssRule'

export const defaultThemeLight = {
  color: '#3b3b3b',
  primary: '#536EDC',
  selectedColor: '#3b3b3b',
  selectedBackground: '#e7f0fc',
  shadow: 'rgb(0 0 0 / 6%) 0px 0px 10px 1px',
  background: '#fff',
  backgroundHover: '#f5f5f5',
  backgroundActive: '#ebebeb',
  itemHoverBackground: '#E2E8F0',
  border: 'rgb(235, 238, 245)',
  wavesBackground: 'rgba(0, 0, 0, 0.2)',
  icon: '#999',
}

export const defaultThemeDark = {
  color: '#ccc',
  border: '#4d4d4d',
  primary: '#898ae9',
  shadow: 'rgba(1, 1, 1, .4) 0px 0px 12px 1px;',
  selectedBackground: '#594dc0',
  selectedColor: '#eee',
  background: '#282C34',
  backgroundHover: '#31353B',
  backgroundActive: '#41454B',
  wavesBackground: '#71757B',
  itemHoverBackground: '#383e4a',
  icon: '#ccc',
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
  `,
)

cssRule.add(
  `:root [data-${DEFAULT_CONFIG.THEME_NAME}='dark']`,
  `
    --theme-primary: ${defaultThemeDark.primary};
    --theme-color: ${defaultThemeDark.color};
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
  `,
)
