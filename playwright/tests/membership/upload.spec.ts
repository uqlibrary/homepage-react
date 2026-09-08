import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

// Supporting documents. The types that need proof of eligibility carry upload instructions in their config;
// where they do, the form asks for documents, checks them in the browser, and uploads them so the stored
// result travels with the application. Some types collect their documents another way and are not shown the
// in-person service-point note.

const aPdf = { name: 'card.pdf', mimeType: 'application/pdf', buffer: Buffer.from('a pdf') };
const aGif = { name: 'sneaky.gif', mimeType: 'image/gif', buffer: Buffer.from('a gif') };

test.describe('Membership supporting documents', () => {
    test('a hospital applicant can attach and upload a document', async ({ page }) => {
        await page.goto('/membership/form/hospital?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        await expect(page.getByTestId('membership-file-upload')).toBeVisible();
        await expect(page.getByTestId('membership-upload-instructions')).toContainText('hospital ID');
        // Hospital collects documents another way, so the in-person service-point note is not shown.
        await expect(page.getByTestId('membership-upload-in-person')).toHaveCount(0);

        await page.getByTestId('membership-upload-input').setInputFiles(aPdf);
        await expect(page.getByTestId('membership-upload-table')).toContainText('card.pdf');

        await page.getByTestId('membership-upload-submit').click();
        await expect(page.getByTestId('membership-upload-status-0')).toContainText(/uploaded/i);

        await assertAccessibility(page, '[data-testid="membership-form"]');
    });

    test('a reciprocal applicant sees the in-person note and is told when a file is the wrong sort', async ({
        page,
    }) => {
        await page.goto('/membership/form/reciprocal?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        await expect(page.getByTestId('membership-upload-in-person')).toBeVisible();

        await page.getByTestId('membership-upload-input').setInputFiles(aGif);
        await expect(page.getByTestId('membership-upload-rejections')).toContainText(/does not end in/i);
        await expect(page.getByTestId('membership-upload-table')).toHaveCount(0);
    });
});
