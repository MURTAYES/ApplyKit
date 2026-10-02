import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Donna - Job Application Autofill',
    description: 'Fills job application forms from your local profile safely and accurately.',
    version: '0.1.0',
    permissions: [
      'storage',
      'activeTab',
      'scripting',
    ],
    action: {
      default_title: 'Donna',
    },
    options_ui: {
      page: 'options/index.html',
      open_in_tab: true,
    },
  },
});
