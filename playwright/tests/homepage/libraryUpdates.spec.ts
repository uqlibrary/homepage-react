import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

test.describe('LibraryUpdates', () => {
    test.describe('content', () => {
        test('loads as expected on desktop', async ({ page }) => {
            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await expect(page.getByTestId('drupal-article-0')).toContainText('Rae and George Hammer memorial');
            await expect(page.getByTestId('drupal-article-1')).toContainText('Building works at Biological Sciences');
            await expect(page.getByTestId('drupal-article-2')).toContainText('Teaching');
            await expect(page.getByTestId('drupal-article-3')).toContainText('Digital Essentials');

            await expect(page.locator('[data-testid="library-updates-parent"] > div')).toHaveCount(5);

            const first = page.getByTestId('drupal-article-0');
            const firstBox = (await first.boundingBox()) as BoundingBox;
            expect(firstBox.x).toBeLessThan(77);

            const second = page.getByTestId('drupal-article-1');
            const secondBox = (await second.boundingBox()) as BoundingBox;
            expect(secondBox.x).toBe(firstBox.x);
            expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height);

            const third = page.getByTestId('drupal-article-2');
            const thirdBox = (await third.boundingBox()) as BoundingBox;
            expect(thirdBox.y).toBe(secondBox.y);
            expect(thirdBox.y + thirdBox.height).toBe(secondBox.y + secondBox.height);
            expect(thirdBox.x).toBeGreaterThan(secondBox.x + secondBox.width);

            const fourth = page.getByTestId('drupal-article-3');
            const fourthBox = (await fourth.boundingBox()) as BoundingBox;
            expect(fourthBox.y).toBe(secondBox.y);
            expect(fourthBox.y + fourthBox.height).toBe(secondBox.y + secondBox.height);
            expect(fourthBox.x).toBeGreaterThan(thirdBox.x + thirdBox.width);
            expect(firstBox.x + firstBox.width - (fourthBox.x + fourthBox.width)).toBeLessThan(1);
        });

        test('loads as expected on tablet', async ({ page }) => {
            await page.goto('/');
            await page.setViewportSize({ width: 840, height: 900 });

            await expect(page.getByTestId('drupal-article-0')).toContainText('Rae and George Hammer memorial');
            await expect(page.locator('[data-testid="library-updates-parent"] > div')).toHaveCount(5);

            const first = page.getByTestId('drupal-article-0');
            const firstBox = (await first.boundingBox()) as BoundingBox;
            expect(firstBox.x).toBeLessThan(30);

            const second = page.getByTestId('drupal-article-1');
            const secondBox = (await second.boundingBox()) as BoundingBox;
            expect(secondBox.x).toBe(firstBox.x);
            expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height);

            const third = page.getByTestId('drupal-article-2');
            const thirdBox = (await third.boundingBox()) as BoundingBox;
            expect(thirdBox.y).toBe(secondBox.y);
            expect(thirdBox.y + thirdBox.height).toBe(secondBox.y + secondBox.height);
            expect(thirdBox.x).toBeGreaterThan(secondBox.x + secondBox.width);
            expect(thirdBox.x + thirdBox.width).toBeGreaterThan(795);
        });

        test('loads as expected on mobile', async ({ page }) => {
            await page.goto('/');
            await page.setViewportSize({ width: 390, height: 736 });

            await expect(page.getByTestId('drupal-article-0')).toContainText('Rae and George Hammer memorial');
            await expect(page.locator('[data-testid="library-updates-parent"] > div')).toHaveCount(5);

            const first = page.getByTestId('drupal-article-0');
            const firstBox = (await first.boundingBox()) as BoundingBox;
            expect(firstBox.x).toBeLessThan(26);

            const second = page.getByTestId('drupal-article-1');
            const secondBox = (await second.boundingBox()) as BoundingBox;
            expect(secondBox.x - firstBox.x).toBeLessThan(1);
            expect(secondBox.x + secondBox.width - (firstBox.x + firstBox.width)).toBeLessThanOrEqual(1);
            expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height);

            const third = page.getByTestId('drupal-article-2');
            const thirdBox = (await third.boundingBox()) as BoundingBox;
            expect(thirdBox.x).toBe(secondBox.x);
            expect(thirdBox.x + thirdBox.width).toBe(secondBox.x + secondBox.width);
            expect(thirdBox.y).toBeGreaterThan(secondBox.y + secondBox.height);

            const fourth = page.getByTestId('drupal-article-3');
            const fourthBox = (await fourth.boundingBox()) as BoundingBox;
            expect(fourthBox.x).toBe(secondBox.x);
            expect(fourthBox.x + fourthBox.width).toBe(secondBox.x + secondBox.width);
            expect(fourthBox.y).toBeGreaterThan(thirdBox.y + thirdBox.height);
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
            await page.waitForTimeout(2000);
            await page.setViewportSize({ width: 550, height: 750 });
            await page.getByTestId('article-1-title').scrollIntoViewIfNeeded();
            await assertAccessibility(page, 'div[data-testid="library-updates-parent"]');
        });
    });
});
