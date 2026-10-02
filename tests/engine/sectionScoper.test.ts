import { describe, it, expect, beforeEach } from 'vitest';
import { detectSectionScope } from '../../src/engine/sectionScoper';

describe('sectionScoper', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('detects section from fieldset legend', () => {
    document.body.innerHTML = `
      <fieldset>
        <legend>SSC or Equivalent Level</legend>
        <div>
          <label for="ssc_roll">Roll</label>
          <input id="ssc_roll" />
        </div>
      </fieldset>
      <fieldset>
        <legend>HSC or Equivalent Level</legend>
        <div>
          <label for="hsc_roll">Roll</label>
          <input id="hsc_roll" />
        </div>
      </fieldset>
    `;

    const sscInput = document.getElementById('ssc_roll') as HTMLInputElement;
    const hscInput = document.getElementById('hsc_roll') as HTMLInputElement;

    expect(detectSectionScope(sscInput)).toBe('ssc');
    expect(detectSectionScope(hscInput)).toBe('hsc');
  });

  it('detects section from preceding heading', () => {
    document.body.innerHTML = `
      <div class="form-container">
        <h2>Present Address</h2>
        <div>
          <label for="pres_dist">District</label>
          <input id="pres_dist" />
        </div>
        <h2>Permanent Address</h2>
        <div>
          <label for="perm_dist">District</label>
          <input id="perm_dist" />
        </div>
      </div>
    `;

    const presInput = document.getElementById('pres_dist') as HTMLInputElement;
    const permInput = document.getElementById('perm_dist') as HTMLInputElement;

    expect(detectSectionScope(presInput)).toBe('present_address');
    expect(detectSectionScope(permInput)).toBe('permanent_address');
  });

  it('detects Bengali section legends and headings', () => {
    document.body.innerHTML = `
      <fieldset>
        <legend>স্নাতক / সমমান</legend>
        <input id="grad_sub" />
      </fieldset>
      <fieldset>
        <legend>মাস্টার্স / সমমান</legend>
        <input id="mast_sub" />
      </fieldset>
    `;

    const gradInput = document.getElementById('grad_sub') as HTMLInputElement;
    const mastInput = document.getElementById('mast_sub') as HTMLInputElement;

    expect(detectSectionScope(gradInput)).toBe('graduation');
    expect(detectSectionScope(mastInput)).toBe('masters');
  });
});
