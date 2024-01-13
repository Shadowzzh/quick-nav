import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

const isProduction = process.env.NODE_ENV === 'production'
const name = isProduction ? packageData.name : `${packageData.name}-${process.env.NODE_ENV}`

export default defineManifest({
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
  },
  name,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/logo-256.png',
    32: 'img/logo-256.png',
    48: 'img/logo-256.png',
    128: 'img/logo-256.png',
  },
  action: {
    // default_popup: 'popup.html',
    default_icon: 'img/logo-256.png',
    // default_title: isProduction ? undefined : '测',
  },
  // options_page: 'options.html',
  // devtools_page: 'devtools.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['<all_urls>', 'http://*/*', 'https://*/*'],
      run_at: 'document_end',
      js: [isProduction ? 'src/contentScript/index.ts': 'src/contentScript/launch.ts'],
    },
  ],
  // side_panel: {
  //   default_path: 'sidepanel.html',
  // },
  web_accessible_resources: [
    {
      resources: ['img/logo-256.png', 'img/logo-256.png', 'img/logo-256.png', 'img/logo-256.png'],
      matches: [],
    },
  ],
  permissions: ['sidePanel', 'storage', 'activeTab', 'scripting'],
  // chrome_url_overrides: {
  // newtab: 'newtab.html',
  // },
})
