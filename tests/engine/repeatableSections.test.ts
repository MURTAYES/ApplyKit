import { describe, it, expect } from 'vitest';
import {
  findJobExperienceContainer,
  countExistingExperienceRows,
  findAddMoreButton,
  expandJobExperienceRows,
  getRowIndexForElement,
} from '../../src/engine/repeatableSections';

describe('Repeatable Job Experiences Engine', () => {
  it('identifies job experience container and counts rows', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <fieldset>
        <legend>Job Experience / চাকরির অভিজ্ঞতা</legend>
        <table>
          <tbody>
            <tr class="job-row">
              <td><input name="designation_1" placeholder="Designation" /></td>
              <td><input name="employer_1" placeholder="Employer" /></td>
            </tr>
          </tbody>
        </table>
        <button type="button" class="btn-add">Add More</button>
      </fieldset>
    `;
    document.body.appendChild(container);

    const expContainer = findJobExperienceContainer(document);
    expect(expContainer).not.toBeNull();

    const count = countExistingExperienceRows(expContainer!);
    expect(count).toBe(1);

    const addBtn = findAddMoreButton(expContainer!);
    expect(addBtn).not.toBeNull();
    expect(addBtn?.textContent).toBe('Add More');

    container.remove();
  });

  it('expands job experience rows dynamically when Add More button is clicked', async () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <fieldset>
        <legend>Job Experience / কর্মসংস্থান</legend>
        <table id="expTable">
          <tbody>
            <tr class="job-row">
              <td><input name="designation_1" placeholder="Designation" /></td>
            </tr>
          </tbody>
        </table>
        <button type="button" id="btnAddMore">Add More</button>
      </fieldset>
    `;
    document.body.appendChild(container);

    // Simulate page JS adding a new row on click
    const addBtn = container.querySelector('#btnAddMore')!;
    const tableBody = container.querySelector('tbody')!;
    let rowNum = 1;

    addBtn.addEventListener('click', () => {
      rowNum++;
      const newTr = document.createElement('tr');
      newTr.className = 'job-row';
      newTr.innerHTML = `<td><input name="designation_${rowNum}" placeholder="Designation" /></td>`;
      tableBody.appendChild(newTr);
    });

    const finalCount = await expandJobExperienceRows(document, 3);
    expect(finalCount).toBe(3);
    expect(tableBody.querySelectorAll('tr').length).toBe(3);

    container.remove();
  });

  it('determines 0-based row index for elements in table rows', () => {
    const table = document.createElement('table');
    table.innerHTML = `
      <tbody>
        <tr><td><input id="input-row-0" /></td></tr>
        <tr><td><input id="input-row-1" /></td></tr>
        <tr><td><input id="input-row-2" /></td></tr>
      </tbody>
    `;
    document.body.appendChild(table);

    const input0 = table.querySelector<HTMLInputElement>('#input-row-0')!;
    const input1 = table.querySelector<HTMLInputElement>('#input-row-1')!;
    const input2 = table.querySelector<HTMLInputElement>('#input-row-2')!;

    expect(getRowIndexForElement(input0, table)).toBe(0);
    expect(getRowIndexForElement(input1, table)).toBe(1);
    expect(getRowIndexForElement(input2, table)).toBe(2);

    table.remove();
  });
});
