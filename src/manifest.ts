import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

export default defineManifest({
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
  },
  name: packageData.name,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/logo-16-light.png',
    32: 'img/logo-32-light.png',
    48: 'img/logo-48-light.png',
    128: 'img/logo-128-light.png',
  },
  action: {
    // default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
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
      js: ['src/contentScript/index.ts'],
    },
  ],
  // side_panel: {
  //   default_path: 'sidepanel.html',
  // },
  web_accessible_resources: [
    {
      resources: [
        'img/logo-16-light.png',
        'img/logo-32-light.png',
        'img/logo-48-light.png',
        'img/logo-128-light.png',
      ],
      matches: [],
    },
  ],
  permissions: ['sidePanel', 'storage', 'activeTab', 'scripting'],
  // chrome_url_overrides: {
  // newtab: 'newtab.html',
  // },
})
