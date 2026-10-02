import { defineContentScript } from 'wxt/sandbox';
import { loadProfile } from '../src/storage/profileStorage';
import { executeFill } from '../src/engine/fillEngine';
import { getMappingForUrl } from '../src/engine/siteResolver';

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === 'TRIGGER_FILL') {
        loadProfile()
          .then(async (profile) => {
            const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
            const siteMapping = getMappingForUrl(currentUrl);
            const report = await executeFill(profile, document, siteMapping || undefined);
            sendResponse({ success: true, report });
          })
          .catch((err) => {
            sendResponse({ success: false, error: err.message });
          });
        return true; // Keep message port open for async response
      }
    });
  },
});
