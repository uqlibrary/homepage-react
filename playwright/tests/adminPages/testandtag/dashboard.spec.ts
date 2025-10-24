import { test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertTitles } from '@uq/pw/tests/adminPages/testandtag/helpers';
import { default as locale } from '../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

test.describe('Test and Tag Dashboard', () => {
    test('page is accessible and renders base', async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag?user=uqtesttag');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.dashboard.header.pageSubtitle('Library'));
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });
    test('page triggers errors if unable to load onLoad', async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag?user=uqpf');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.dashboard.header.pageSubtitle('Properties and Facilities'));
        await page.goto('http://localhost:2020/admin/testntag?user=uqpf');
        await page.getByTestId('confirmation_alert-error-alert').click();
    });
});
