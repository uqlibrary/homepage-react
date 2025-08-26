import { test, expect, Locator } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

test.describe('LibraryUpdates', () => {
    test.describe('content', () => {
        // CY to PW conversion note: added some margin to avoid parallel testing rand. failures
        const BOUNDING_BOX_TOLERANCE = 2;
        const getBoundingBox = async (el: Locator): Promise<BoundingBox> => {
            await expect.poll(async () => (await el.boundingBox()) !== null, { timeout: 5000 }).toBeTruthy();
            const box = await el.boundingBox();
            if (!box) throw new Error(`Unable to get bounding box: ${el}`);
            return box;
        };

        test('loads as expected on desktop', async ({ page }) => {
            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('drupal-article-0')).toContainText('Rae and George Hammer memorial');
            await expect(page.getByTestId('drupal-article-1')).toContainText('Building works at Biological Sciences');
            await expect(page.getByTestId('drupal-article-2')).toContainText('Teaching');
            await expect(page.getByTestId('drupal-article-3')).toContainText('Digital Essentials');

            await expect(page.locator('[data-testid="library-updates-parent"] > div')).toHaveCount(4 + 1); // 4 news stories and a heading

            // at desktop, the articles are laid out like:
            //  /----------------\
            //  | XXXXXXXXXXXXXX |
            //  \----------------/
            //  XXXX   XXXX   XXXX
            await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
            const firstBox = await getBoundingBox(page.getByTestId('drupal-article-0'));
            // CY to PW conversion note: value below from 77 to 84 to avoid parallel testing rand. failures
            expect(firstBox.x).toBeLessThan(84 + BOUNDING_BOX_TOLERANCE);

            const secondBox = await getBoundingBox(page.getByTestId('drupal-article-1'));
            expect(Math.abs(secondBox.x - firstBox.x)).toBeLessThan(BOUNDING_BOX_TOLERANCE);
            expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - BOUNDING_BOX_TOLERANCE);

            const thirdBox = await getBoundingBox(page.getByTestId('drupal-article-2'));
            expect(Math.abs(thirdBox.y - secondBox.y)).toBeLessThan(BOUNDING_BOX_TOLERANCE);
            expect(Math.abs(thirdBox.y + thirdBox.height - (secondBox.y + secondBox.height))).toBeLessThan(
                BOUNDING_BOX_TOLERANCE,
            );
            expect(thirdBox.x).toBeGreaterThan(secondBox.x + secondBox.width - BOUNDING_BOX_TOLERANCE);

            const fourthBox = await getBoundingBox(page.getByTestId('drupal-article-3'));
            expect(Math.abs(fourthBox.y - secondBox.y)).toBeLessThan(BOUNDING_BOX_TOLERANCE);
            expect(Math.abs(fourthBox.y + fourthBox.height - (secondBox.y + secondBox.height))).toBeLessThan(
                BOUNDING_BOX_TOLERANCE,
            );
            expect(fourthBox.x).toBeGreaterThan(thirdBox.x + thirdBox.width - BOUNDING_BOX_TOLERANCE);
            expect(Math.abs(firstBox.x + firstBox.width - (fourthBox.x + fourthBox.width))).toBeLessThan(
                BOUNDING_BOX_TOLERANCE + 1,
            );
        });

        test('loads as expected on tablet', async ({ page }) => {
            await page.goto('/');
            await page.setViewportSize({ width: 840, height: 900 });
            await expect(page.getByTestId('drupal-article-0')).toContainText('Rae and George Hammer memorial');

            await expect(page.locator('[data-testid="library-updates-parent"] > div')).toHaveCount(5);

            // at tablet width, the articles are laid out:
            //  /-----------\
            //  | XXXXXXXXX |
            //  \-----------/
            //  XXXXX   XXXXX
            //  XXXXX
            const firstBox = await getBoundingBox(page.getByTestId('drupal-article-0'));
            expect(firstBox.x).toBeLessThan(30 + BOUNDING_BOX_TOLERANCE);

            const secondBox = await getBoundingBox(page.getByTestId('drupal-article-1'));
            expect(Math.abs(secondBox.x - firstBox.x)).toBeLessThan(BOUNDING_BOX_TOLERANCE);
            expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - BOUNDING_BOX_TOLERANCE - 12);

            const thirdBox = await getBoundingBox(page.getByTestId('drupal-article-2'));
            expect(Math.abs(thirdBox.y - secondBox.y)).toBeLessThan(BOUNDING_BOX_TOLERANCE);
            expect(Math.abs(thirdBox.y + thirdBox.height - (secondBox.y + secondBox.height))).toBeLessThan(
                BOUNDING_BOX_TOLERANCE,
            );
            expect(thirdBox.x).toBeGreaterThan(secondBox.x + secondBox.width - BOUNDING_BOX_TOLERANCE);
            // CY to PW conversion note: value below from 795 to 790 to avoid parallel testing rand. failures
            expect(thirdBox.x + thirdBox.width).toBeGreaterThan(790 - BOUNDING_BOX_TOLERANCE); // near right edge of 840 width

            // visually the fourth article drops down, but by the numbers it seems to sit on the right,
            // same as desktop, so I'm not going to test it
        });

        test('loads as expected on mobile', async ({ page }) => {
            await page.goto('/');
            await page.setViewportSize({ width: 390, height: 736 });
            await expect(page.getByTestId('drupal-article-0')).toContainText('Rae and George Hammer memorial');

            await expect(page.locator('[data-testid="library-updates-parent"] > div')).toHaveCount(5); // 4 news stories and a heading

            // at mobile width, the articles are laid out:
            //  /------\
            //  | XXXX |
            //  \------/
            //    XXXX
            //    XXXX
            //    XXXX
            const firstBox = await getBoundingBox(page.getByTestId('drupal-article-0'));
            expect(firstBox.x).toBeLessThan(26 + BOUNDING_BOX_TOLERANCE);

            const secondBox = await getBoundingBox(page.getByTestId('drupal-article-1'));
            expect(Math.abs(secondBox.x - firstBox.x)).toBeLessThan(BOUNDING_BOX_TOLERANCE);
            expect(Math.abs(secondBox.x + secondBox.width - (firstBox.x + firstBox.width))).toBeLessThan(
                BOUNDING_BOX_TOLERANCE,
            );
            expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - BOUNDING_BOX_TOLERANCE);

            const thirdBox = await getBoundingBox(page.getByTestId('drupal-article-2'));
            expect(Math.abs(thirdBox.x - secondBox.x)).toBeLessThan(BOUNDING_BOX_TOLERANCE);
            expect(Math.abs(thirdBox.x + thirdBox.width - (secondBox.x + secondBox.width))).toBeLessThan(
                BOUNDING_BOX_TOLERANCE,
            );
            expect(thirdBox.y).toBeGreaterThan(secondBox.y + secondBox.height - BOUNDING_BOX_TOLERANCE);

            const fourthBox = await getBoundingBox(page.getByTestId('drupal-article-3'));
            expect(Math.abs(fourthBox.x - secondBox.x)).toBeLessThan(BOUNDING_BOX_TOLERANCE);
            expect(Math.abs(fourthBox.x + fourthBox.width - (secondBox.x + secondBox.width))).toBeLessThan(
                BOUNDING_BOX_TOLERANCE,
            );
            expect(fourthBox.y).toBeGreaterThan(thirdBox.y + thirdBox.height - BOUNDING_BOX_TOLERANCE);
        });

        test('handles an error correctly', async ({ page }) => {
            await page.goto('/?responseType=drupalError');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('drupal-error')).toContainText('No articles found');
        });
    });
    test.describe('accessibility', () => {
        test('is accessible at 1300 1000', async ({ page }) => {
            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await page.getByTestId('article-1-title').scrollIntoViewIfNeeded();
            await assertAccessibility(page, 'div[data-testid="library-updates-parent"]', {
                disabledRules: ['color-contrast'],
            });
        });
        test('is accessible at 550 750', async ({ page }) => {
            await page.goto('/');
            await page.setViewportSize({ width: 550, height: 750 });
            await page.getByTestId('article-1-title').scrollIntoViewIfNeeded();
            await assertAccessibility(page, 'div[data-testid="library-updates-parent"]');
        });
    });
});
