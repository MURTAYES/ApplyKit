import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Privacy, Safety and Telemetry Audit (PRIV-01 - PRIV-04, REPT-01, REPT-02)', () => {
  it('ensures PRIVACY.md exists and contains all required Chrome Web Store privacy disclosures', () => {
    const privacyPath = path.resolve(__dirname, '../../PRIVACY.md');
    expect(fs.existsSync(privacyPath)).toBe(true);

    const content = fs.readFileSync(privacyPath, 'utf-8');
    expect(content).toContain('chrome.storage.local');
    expect(content).toContain('zero');
    expect(content).toContain('activeTab');
    expect(content).toContain('scripting');
    expect(content).toContain('Delete All Stored Data');
  });

  it('audits codebase ensuring no console.log prints PII data', () => {
    const srcDir = path.resolve(__dirname, '../../src');
    const entryDir = path.resolve(__dirname, '../../entrypoints');

    const scanFiles = (dir: string): string[] => {
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          results = results.concat(scanFiles(fullPath));
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
          results.push(fullPath);
        }
      }
      return results;
    };

    const files = [...scanFiles(srcDir), ...scanFiles(entryDir)];
    const forbiddenPiiKeywords = [
      /console\.log\(.*profile\.basicInfo\./i,
      /console\.log\(.*\.nid\b/i,
      /console\.log\(.*\.phone\b/i,
      /console\.log\(.*\.email\b/i,
      /console\.log\(.*\.fatherName/i,
      /console\.log\(.*\.motherName/i,
    ];

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const pattern of forbiddenPiiKeywords) {
        const match = content.match(pattern);
        expect(match, `Forbidden PII logging found in ${filePath}: ${match?.[0]}`).toBeNull();
      }
    }
  });
});
