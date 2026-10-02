const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ADD_MORE_PATTERNS = [
  /add\s*more/i,
  /\+\s*add/i,
  /add\s*row/i,
  /add\s*experience/i,
  /add\s*another/i,
  /যোগ\s*করুন/i,
  /নতুন\s*যোগ/i,
];

/**
 * Finds the Job Experience section container element in the DOM.
 */
export function findJobExperienceContainer(rootElement: Document | HTMLElement = document): HTMLElement | null {
  const candidates = Array.from(
    rootElement.querySelectorAll<HTMLElement>('fieldset, table, div, section')
  );

  for (const el of candidates) {
    const text = (el.textContent || '').toLowerCase();
    const isJobExp =
      (text.includes('job experience') ||
        text.includes('employment history') ||
        text.includes('চাকরির অভিজ্ঞতা') ||
        text.includes('কর্মসংস্থান')) &&
      !text.includes('education') &&
      !text.includes('academic');

    if (isJobExp && el.querySelector('input, select, textarea')) {
      return el;
    }
  }

  return null;
}

/**
 * Counts existing Job Experience rows in the DOM.
 */
export function countExistingExperienceRows(container: HTMLElement | Document = document): number {
  const inputs = Array.from(
    container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input, select, textarea'
    )
  );

  const rowContainers = new Set<Element>();
  const designationInputs: HTMLElement[] = [];

  for (const input of inputs) {
    const name = `${input.name} ${input.id} ${input.getAttribute('aria-label') || ''}`.toLowerCase();
    if (
      name.includes('designation') ||
      name.includes('post_name') ||
      name.includes('position') ||
      name.includes('পদবী') ||
      name.includes('পদের নাম')
    ) {
      designationInputs.push(input);
    }

    const row = input.closest('.experience-block, .experience-row, .job-row, .item-row');
    if (row && row !== container) {
      rowContainers.add(row);
    }
  }

  if (designationInputs.length > 0) {
    return designationInputs.length;
  }

  if (rowContainers.size > 0) {
    return rowContainers.size;
  }

  return 1;
}

/**
 * Finds the "+ Add More" button or link inside or adjacent to the Job Experience section.
 */
export function findAddMoreButton(container: HTMLElement | Document = document): HTMLElement | null {
  const clickables = Array.from(
    container.querySelectorAll<HTMLElement>('button, input[type="button"], a, span, input[type="submit"]')
  );

  for (const el of clickables) {
    const text = (el.textContent || (el as HTMLInputElement).value || '').trim();
    const idAndName = `${el.id} ${el.getAttribute('name') || ''} ${el.className}`.toLowerCase();

    for (const pattern of ADD_MORE_PATTERNS) {
      if (pattern.test(text) || pattern.test(idAndName)) {
        if (text.toLowerCase().includes('submit') || text.toLowerCase().includes('next')) {
          continue;
        }
        return el;
      }
    }
  }

  return null;
}

/**
 * Expands Job Experience rows dynamically by clicking "+ Add More" (N - M) times.
 */
export async function expandJobExperienceRows(
  rootElement: Document | HTMLElement = document,
  targetRowCount: number
): Promise<number> {
  if (targetRowCount <= 1) {
    return 1;
  }

  const container = findJobExperienceContainer(rootElement) || (rootElement as HTMLElement);
  let currentCount = countExistingExperienceRows(container);

  if (currentCount >= targetRowCount) {
    return currentCount;
  }

  const addBtn = findAddMoreButton(container);
  if (!addBtn) {
    return currentCount;
  }

  const clicksNeeded = targetRowCount - currentCount;

  for (let i = 0; i < clicksNeeded; i++) {
    addBtn.click();

    // Wait for DOM mutation / dynamic row rendering
    await sleep(150);

    const newCount = countExistingExperienceRows(container);
    if (newCount > currentCount) {
      currentCount = newCount;
    }
  }

  return currentCount;
}

/**
 * Calculates zero-based row index for an input element inside repeated rows.
 */
export function getRowIndexForElement(
  element: HTMLElement,
  rootElement: Document | HTMLElement = document
): number {
  // 1. Check if enclosed in a distinct experience container or row
  const expContainers = Array.from(
    rootElement.querySelectorAll<HTMLElement>(
      '.experience-block, .job-row, .experience-row, .job-table, .job-exp-table, tr.job-item, tr.job-row'
    )
  );
  if (expContainers.length > 1) {
    for (let i = 0; i < expContainers.length; i++) {
      if (expContainers[i].contains(element)) {
        return i;
      }
    }
  }

  // 2. Check if inside a table where each tr represents an experience row
  const tr = element.closest('tr');
  if (tr && tr.parentElement) {
    const siblingRows = Array.from(tr.parentElement.children).filter(
      (child) => child.tagName === 'TR' && child.querySelector('input, select, textarea')
    );
    if (siblingRows.length > 1 && (tr.classList.contains('job-row') || tr.classList.contains('item-row'))) {
      const idx = siblingRows.indexOf(tr);
      if (idx !== -1) return idx;
    }
  }

  // 3. Check preceding elements with the exact same name in the section
  const section = element.closest('fieldset, #job_experience_section, .job-experience, table') || rootElement;
  const elName = element.getAttribute('name');
  if (elName) {
    const sameNameInputs = Array.from(
      section.querySelectorAll<HTMLElement>(`[name="${CSS.escape(elName)}"]`)
    );
    if (sameNameInputs.length > 1) {
      const idx = sameNameInputs.indexOf(element);
      if (idx !== -1) return idx;
    }
  }

  // 4. Check if element name or id ends with _0, _1, _2 or -0, -1, -2
  const nameOrId = `${element.id || ''} ${element.getAttribute('name') || ''}`.trim();
  const zeroBasedMatch = nameOrId.match(/[_\-\[]0\]?/);
  const numMatch = nameOrId.match(/[_\-\[](\d+)\]?$/);
  if (numMatch) {
    const parsed = parseInt(numMatch[1], 10);
    // If zero-based match or root has _0 / -0
    if (zeroBasedMatch || rootElement.querySelector(`[id*="_0"], [name*="_0"], [id*="-0"], [name*="-0"]`)) {
      return parsed;
    }
    // If 1-based (e.g. desig_1, desig_2), convert to 0-based
    if (parsed >= 1) {
      return parsed - 1;
    }
    return parsed;
  }

  return 0;
}
