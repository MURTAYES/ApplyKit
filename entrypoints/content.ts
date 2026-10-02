import { defineContentScript } from 'wxt/sandbox';
import { loadProfile } from '../src/storage/profileStorage';
import { executeFill } from '../src/engine/fillEngine';

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === 'TRIGGER_FILL') {
        loadProfile()
          .then((profile) => {
            const report = executeFill(profile, document);
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
