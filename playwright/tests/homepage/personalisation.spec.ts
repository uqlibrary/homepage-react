import { test, expect } from '@playwright/test';
import { Page } from '@uq/pw/test';

const expectUserToDisplayCorrectFirstName = async (page: Page, username: string, firstname: string) => {
    await page.goto(`/?user=${username}`);
    await page.setViewportSize({ width: 1300, height: 1000 });
    await expect(page.getByTestId('homepage-user-greeting')).toContainText(`Hi, ${firstname}`);
};

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

export const hasPanels = async (page: Page, optionsTheUserShouldSee: string[]) => {
    for (const item of optionsTheUserShouldSee) {
        expect(
            [...possiblePanels.keys()].includes(item),
            `panel option unexpectedly supplied for panel test: ${item}`,
        ).toBeTruthy();
    }

    for (const [key, value] of possiblePanels) {
        expect(typeof key).toBe('string');
        expect(key.length).toBeGreaterThan(0);
        expect(typeof value.title).toBe('string');
        expect(value.title.length).toBeGreaterThan(0);
        expect(typeof value.content).toBe('string');
        expect(value.content.length).toBeGreaterThan(0);

        const panelname = `${key}-panel`;
        const titleSelector = `div[data-testid="${panelname}"] h3`;
        if (optionsTheUserShouldSee.includes(key)) {
            await expect(page.locator(titleSelector)).toContainText(value.title);
        } else {
            await expect(page.locator(titleSelector)).not.toBeVisible();
        }
        if (optionsTheUserShouldSee.includes(key)) {
            await expect(page.locator(`div[data-testid="${panelname}"]`).getByText(value.content)).toBeVisible();
        }
    }
};

async function rendersALoggedOutUser(page: Page) {
    await page.context().clearCookies();
    await page.goto('/?user=public');
    await page.setViewportSize({ width: 1300, height: 1000 });
    await hasPanels(page, []);
}

const hasNoEspacePanel = async (page: Page) => {
    await expect(page.getByTestId('espace-links-panel')).not.toBeVisible();
};

const hasEspaceEntries = async (page: Page, optionsTheUserShouldSee: string[]) => {
    const availableOptions = new Map<string, string>();
    availableOptions.set('espace-possible', 'records');
    availableOptions.set('espace-orcid', 'Link ORCiD account');
    availableOptions.set('espace-ntro', 'NTRO records');

    for (const [key, value] of availableOptions) {
        const elementId = page.getByTestId(key);

        if (optionsTheUserShouldSee.includes(key)) {
            await expect(elementId).toContainText(value);
        } else {
            await expect(elementId).not.toBeVisible();
        }
    }
};

const hasAccountPanelOptions = async (page: Page, optionsTheUserShouldSee: string[]) => {
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
            await expect(element).toContainText(value);
        } else {
            await expect(element).not.toBeVisible();
        }
    }
};

const seesEndNoteInReferencing = async (page: Page) =>
    await expect(page.getByTestId('referencing-endnote')).toContainText('Endnote referencing software');

const noEndNoteInReferencing = async (page: Page) => {
    await expect(page.getByTestId('referencing-endnote')).not.toBeVisible();
};
// we test that each user type gets the correct elements on the homepage
// we shouldn't test the mylibrary button here, same, as that is built in reusable-webcomponents
// everyone has catalogue and referencing
test.describe('Personalised Homepage', () => {
    test("Renders an on-campus undergraduate student's home page correctly", async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 's1111111', 'Michael');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // this type of user will see the following panels:
        await hasPanels(page, ['catalogue', 'referencing', 'learning-resources', 'training', 'espace']);
        await seesEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, [
            'searchhistory',
            'savedsearches',
            'requests',
            'loans',
            'papercut',
            'fines',
        ]);

        // the fine has the supplied value
        await expect(
            page
                .getByTestId('show-fines')
                .getByText(/48\.93/)
                .first(),
        ).toBeVisible();

        // this type of user will see these lines in the espace panel
        await hasEspaceEntries(page, ['espace-possible', 'espace-ntro']);

        // as the user is logged in, they see nav panels with a h3
        await expect(
            page
                .getByTestId('help-navigation-panel')
                .locator(':scope > *')
                .nth(0)
                .locator('h3'),
        ).toBeVisible();
    });

    test('Renders a logged out user', async ({ page }) => {
        // tests ?user=public
        await rendersALoggedOutUser(page);

        // as the user is logged out, they see nav panels with a h2
        await expect(
            page
                .getByTestId('help-navigation-panel')
                .locator(':scope > *')
                .nth(0)
                .locator('h2'),
        ).toBeVisible();
    });

    test('Renders an RHD who is only enrolled in a research subject home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 's2222222', 'Jane');

        // CY => PW conversion note: added 'espace', which refers to div[data-testid=espace-panel] h3 (present during cy testing)
        await hasPanels(page, ['catalogue', 'referencing', 'training', 'readpublish', 'espace']);
        await seesEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, [
            'searchhistory',
            'savedsearches',
            'requests',
            'loans',
            'papercut',
            'fines',
        ]);

        // the fine has a special value
        await expect(
            page
                .getByTestId('show-fines')
                .getByText(/65\.97/)
                .first(),
        ).toBeVisible();

        await hasEspaceEntries(page, ['espace-possible', 'espace-ntro']);
    });

    test('Renders an RHD who has a non reserarch subject home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 's6666666', 'Maryanne');

        await hasPanels(page, ['catalogue', 'referencing', 'learning-resources', 'training', 'readpublish']);
        await seesEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        // this would be odd, all rhds should automatically be setup as an author
        await hasNoEspacePanel(page);
    });

    test('Renders an RHD with courses home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 's5555555', 'Yvonne');

        await hasPanels(page, ['catalogue', 'referencing', 'learning-resources', 'training', 'readpublish']);
        await seesEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        await hasNoEspacePanel(page);
    });

    test('when session cookie auto expires the user logs out', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 's1111111', 'Michael');

        await hasAccountPanelOptions(page, [
            'searchhistory',
            'savedsearches',
            'requests',
            'loans',
            'papercut',
            'fines',
        ]);
        page.context().clearCookies({ name: 'UQLID' });
        await rendersALoggedOutUser(page);
    });
    test('Renders a remote undergraduate home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 's3333333', 'Juno');

        await hasPanels(page, ['catalogue', 'referencing', 'learning-resources', 'training']);
        await seesEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);
        // special loans & requests values
        await expect(page.locator('[data-testid="show-requests"] span')).toBeVisible();
        await expect(
            page
                .locator('[data-testid="show-requests"] span')
                .getByText(/4/)
                .first(),
        ).toBeVisible();
        await expect(page.locator('[data-testid="show-loans"] span')).toBeVisible();
        await expect(
            page
                .locator('[data-testid="show-loans"] span')
                .getByText(/0/)
                .first(),
        ).toBeVisible();

        await hasNoEspacePanel(page);
    });

    test('Renders a researcher home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 'uqresearcher', 'John');

        await hasPanels(page, ['catalogue', 'referencing', 'learning-resources', 'training', 'espace', 'readpublish']);
        await seesEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);
        // special loans & requests values
        await expect(page.locator('[data-testid="show-requests"] span')).toBeVisible();
        await expect(
            page
                .locator('[data-testid="show-requests"] span')
                .getByText(/0/)
                .first(),
        ).toBeVisible();
        await expect(page.locator('[data-testid="show-loans"] span')).toBeVisible();
        await expect(
            page
                .locator('[data-testid="show-loans"] span')
                .getByText(/7/)
                .first(),
        ).toBeVisible();

        await hasEspaceEntries(page, ['espace-possible', 'espace-orcid', 'espace-ntro']);
    });

    test('Renders a patron with no outstanding espace records correctly', async ({ page }) => {
        await page.goto('/?user=uqresearcher&responseType=nodatamissing'); // special mock data
        await page.setViewportSize({ width: 1300, height: 1000 });

        await hasPanels(page, ['catalogue', 'referencing', 'learning-resources', 'training', 'espace', 'readpublish']);
        await seesEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        await hasEspaceEntries(page, ['espace-orcid']);
    });

    test('Renders a library staff administrator home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 'digiteamMember', 'Caroline');

        await hasPanels(page, ['catalogue', 'referencing', 'learning-resources', 'training', 'espace', 'readpublish']);
        await seesEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        await hasEspaceEntries(page, ['espace-possible', 'espace-ntro']);
    });

    test('Renders a Library staff member (without admin privs) home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 'uqstaffnonpriv', 'UQ');

        await hasPanels(page, ['catalogue', 'referencing', 'learning-resources', 'training', 'readpublish']);
        await seesEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        await hasNoEspacePanel(page);
    });

    test('Renders a non-library staff member home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 'uqpkopit', 'Peter');

        await hasPanels(page, ['catalogue', 'referencing', 'learning-resources', 'training', 'espace', 'readpublish']);
        await seesEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        await hasEspaceEntries(page, ['espace-possible', 'espace-ntro']);
    });

    test('Renders a paid Community EM member home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 'emcommunity', 'Community');

        await hasPanels(page, ['catalogue', 'referencing']);
        await noEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        await hasNoEspacePanel(page);
    });

    test('Renders an Alumni (first year or paid) EM member home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 'emalumni', 'Alumni');

        await hasPanels(page, ['catalogue', 'referencing']);
        await noEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        await hasNoEspacePanel(page);
    });

    test('Renders a Hospital EM member home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 'emhospital', 'Hospital');

        await hasPanels(page, ['catalogue', 'referencing', 'training']);
        await noEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        // sees hospital training items
        await page.getByTestId('training-event-detail-button-0').scrollIntoViewIfNeeded();
        await expect(
            page
                .getByTestId('training-event-detail-button-0')
                .getByText(/Planning your systematic review/)
                .first(),
        ).toBeVisible();

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        await hasNoEspacePanel(page);
    });

    test('Renders an Associate EM member home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 'emassociate', 'Associate');

        await hasPanels(page, ['catalogue', 'referencing']);
        await noEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        await hasNoEspacePanel(page);
    });

    test('Renders a Fryer Library EM member home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 'emfryer', 'Fryer');

        await hasPanels(page, ['catalogue', 'referencing']);
        await noEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        await hasNoEspacePanel(page);
    });

    test('Renders an Honorary EM member home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 'emhonorary', 'Honorary');

        await hasPanels(page, ['catalogue', 'referencing', 'learning-resources', 'training', 'readpublish']);
        await noEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        await hasNoEspacePanel(page);
    });

    test('Renders a Short Form Credential course student home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 'uqsfc', 'SFC');

        await hasPanels(page, ['catalogue', 'referencing', 'learning-resources', 'training']);
        await seesEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        await hasNoEspacePanel(page);
    });

    test('test and tag users see home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 'uqtesttag', 'UQ');

        await hasPanels(page, ['catalogue', 'referencing', 'learning-resources', 'training', 'readpublish']);
        await seesEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, [
            'searchhistory',
            'savedsearches',
            'requests',
            'loans',
            'papercut',
            'testntag',
        ]);

        await hasNoEspacePanel(page);
    });

    test('Renders a new user group home page correctly', async ({ page }) => {
        await expectUserToDisplayCorrectFirstName(page, 'newUserGroup', 'New');

        await hasPanels(page, ['catalogue', 'referencing']);
        await noEndNoteInReferencing(page);

        await hasAccountPanelOptions(page, ['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        await hasNoEspacePanel(page);
    });
});
