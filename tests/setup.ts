import '@testing-library/jest-dom';
import { vi } from 'vitest';

// URL.createObjectURL / revokeObjectURL mock for JSDOM
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = vi.fn((blob: Blob) => `blob:mock-url-${Math.random()}`);
  window.URL.revokeObjectURL = vi.fn();
}

// Chrome API Mock for unit and component testing
const storageMemory: Record<string, any> = {};

(globalThis as any).chrome = {
  storage: {
    local: {
      get: vi.fn((keys?: string | string[] | Record<string, any> | null, callback?: (items: { [key: string]: any }) => void) => {
        let result: Record<string, any> = {};
        if (typeof keys === 'string') {
          result[keys] = storageMemory[keys];
        } else if (Array.isArray(keys)) {
          keys.forEach((k) => {
            result[k] = storageMemory[k];
          });
        } else if (keys === null || keys === undefined) {
          result = { ...storageMemory };
        } else if (typeof keys === 'object') {
          Object.keys(keys).forEach((k) => {
            result[k] = storageMemory[k] !== undefined ? storageMemory[k] : keys[k];
          });
        }
        if (callback) callback(result);
        return Promise.resolve(result);
      }),
      set: vi.fn((items: Record<string, any>, callback?: () => void) => {
        Object.assign(storageMemory, items);
        if (callback) callback();
        return Promise.resolve();
      }),
      remove: vi.fn((keys: string | string[], callback?: () => void) => {
        const keyList = Array.isArray(keys) ? keys : [keys];
        keyList.forEach((k) => {
          delete storageMemory[k];
        });
        if (callback) callback();
        return Promise.resolve();
      }),
      clear: vi.fn((callback?: () => void) => {
        Object.keys(storageMemory).forEach((k) => {
          delete storageMemory[k];
        });
        if (callback) callback();
        return Promise.resolve();
      }),
    },
  },
  runtime: {
    openOptionsPage: vi.fn((callback?: () => void) => {
      if (callback) callback();
      return Promise.resolve();
    }),
    getURL: vi.fn((path: string) => `chrome-extension://mock-id/${path}`),
  },
} as any;
