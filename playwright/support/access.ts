import { expect, Page } from '@playwright/test';

export const expectUserToDisplayCorrectFirstName = async (page: Page, username: string, firstname: string) => {
    await page.goto(`/?user=${username}`);
    await expect(page.getByTestId('homepage-user-greeting')).toContainText(`Hi, ${firstname}`);
};

export const hasPanels = async (page: Page, optionsTheUserShouldSee: string[]) => {
    const possiblePanels = new Map<string, { title: string; content: string }>();
    possiblePanels.set('learning-resources', {
        title: 'Learning resources and past exam papers',
        content: 'Search by',
    });
    possiblePanels.set('library-services', { title: 'Library services', content: 'Services for' });
    possiblePanels.set('past-exam-papers', { title: 'Past exam papers', content: 'Search by' });
    possiblePanels.set('training', { title: 'Training', content: 'See all training' });
    possiblePanels.set('espace', { title: 'UQ eSpace', content: 'Update the following items' });
    possiblePanels.set('readpublish', { title: 'Read and publish', content: 'Publish in the right journal' });
    possiblePanels.set('catalogue', { title: 'Your library account', content: 'Search history' });
    possiblePanels.set('referencing', { title: 'Referencing', content: 'Referencing style guides' });

    for (const [key, value] of possiblePanels) {
        const panelname = `${key}-panel`;
        const titleLocator = page.getByTestId(panelname).locator('h3');
        const contentLocator = page.getByTestId(panelname);

        if (optionsTheUserShouldSee.includes(key)) {
            await expect(titleLocator).toBeVisible();
            await expect(titleLocator).toContainText(value.title);
            await expect(contentLocator).toContainText(value.content);
        } else {
            await expect(titleLocator).not.toBeVisible();
        }
    }

    if (optionsTheUserShouldSee.includes('library-services')) {
        expect(
            await page
                .getByTestId('library-services-items')
                .locator('> *')
                .count(),
        ).toBeGreaterThan(0);
    }
};

export const hasNoEspacePanel = async (page: Page) => {
    await expect(page.getByTestId('espace-links-panel')).not.toBeVisible();
};

export const hasEspaceEntries = async (page: Page, optionsTheUserShouldSee: string[]) => {
    const availableOptions = new Map<string, string>();
    availableOptions.set('espace-possible', 'records');
    availableOptions.set('espace-orcid', 'Link ORCiD account');
    availableOptions.set('espace-ntro', 'NTRO records');

    for (const [key, value] of availableOptions) {
        const elementId = page.getByTestId(key);

        if (optionsTheUserShouldSee.includes(key)) {
            await expect(elementId).toBeVisible();
            await expect(elementId).toContainText(value);
        } else {
            await expect(elementId).not.toBeVisible();
        }
    }
};

export const hasAccountPanelOptions = async (page: Page, optionsTheUserShouldSee: string[]) => {
    const availableOptions = new Map<string, string>();
    availableOptions.set('searchhistory', 'Search history');
    availableOptions.set('savedsearches', 'Saved searches');
    availableOptions.set('requests', 'Requests');
    availableOptions.set('loans', 'Loans');
    availableOptions.set('fines', 'Fines');
    availableOptions.set('papercut', 'Print balance');
    availableOptions.set('testntag', 'Test and tag');

    for (const [key, value] of availableOptions) {
        const entryname = `show-${key}`;
        const element = page.getByTestId(entryname);

        if (optionsTheUserShouldSee.includes(key)) {
            await expect(element).toBeVisible();
            await expect(element).toContainText(value);
        } else {
            await expect(element).not.toBeVisible();
        }
    }
};

export const seesEndNoteInReferencing = async (page: Page) => {
    const endnoteLocator = page.getByTestId('referencing-endnote');
    await expect(endnoteLocator).toBeVisible();
    await expect(endnoteLocator).toContainText('Endnote referencing software');
};

export const noEndNoteInReferencing = async (page: Page) => {
    await expect(page.getByTestId('referencing-endnote')).not.toBeVisible();
};
