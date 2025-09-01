import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('header', () => {
    test.describe('Big 6 Nav', () => {
        test.describe('displays correctly', () => {
            test('desktop displays correctly', async ({ page }) => {
                await page.goto('http://localhost:2020/?user=public');
                await page.setViewportSize({ width: 1300, height: 1000 });

                const panel = page.getByTestId('help-navigation-panel');
                const li = panel.locator('li');
                await expect(li).toHaveCount(6);

                // we have a 3 x 2 grid at desktop
                const first = li.nth(0);
                const { top: firstTop, left: firstLeft, bottom: firstBottom, right: firstRight } = await first.evaluate(
                    el => {
                        const rect = el.getBoundingClientRect();
                        return {
                            top: rect.top,
                            left: rect.left,
                            bottom: rect.top + rect.height,
                            right: rect.left + rect.width,
                        };
                    },
                );

                const second = li.nth(1);
                const { top: secondTop, left: secondLeft, right: secondRight } = await second.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });
                // Ensure the second item is on the same row as the first
                expect(secondTop).toBe(firstTop);
                expect(secondLeft).toBeGreaterThan(firstLeft);

                const third = li.nth(2);
                const { top: thirdTop, left: thirdLeft, right: thirdRight } = await third.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });
                // Ensure the third item is on the same row as the firs
                expect(thirdTop).toBe(firstTop);
                expect(thirdLeft).toBeGreaterThan(firstLeft);

                const fourth = li.nth(3);
                const { top: fourthTop, left: fourthLeft, right: fourthRight } = await fourth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });
                // Ensure the fourth item is on the next row, with a gap
                expect(fourthTop).toBeGreaterThan(firstTop);
                expect(fourthLeft).toBe(firstLeft);
                expect(fourthRight).toBe(firstRight);
                expect(fourthTop).toBeGreaterThan(firstBottom + 20);

                const fifth = li.nth(4);
                const { top: fifthTop, left: fifthLeft, right: fifthRight } = await fifth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });
                // Ensure the fifth item is on the next row
                expect(fifthTop).toBeGreaterThan(firstTop);
                expect(fifthLeft).toBe(secondLeft);
                expect(fifthRight).toBe(secondRight);

                const sixth = li.nth(5);
                const { top: sixthTop, left: sixthLeft, right: sixthRight } = await sixth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });

                // Ensure the sixth item is on the next row
                expect(sixthTop).toBeGreaterThan(firstTop);
                expect(sixthLeft).toBe(thirdLeft);
                expect(sixthRight).toBe(thirdRight);
            });
            test('tablet displays correctly', async ({ page }) => {
                await page.goto('http://localhost:2020/?user=public');
                await page.setViewportSize({ width: 840, height: 900 });

                const panel = page.getByTestId('help-navigation-panel');
                const li = panel.locator('li');
                await expect(li).toHaveCount(6);

                const first = li.nth(0).locator(':scope > div');
                const { top: firstTop, left: firstLeft, bottom: firstBottom, right: firstRight } = await first.evaluate(
                    el => {
                        const rect = el.getBoundingClientRect();
                        return {
                            top: rect.top,
                            left: rect.left,
                            bottom: rect.top + rect.height,
                            right: rect.left + rect.width,
                        };
                    },
                );

                const second = li.nth(1).locator(':scope > div');
                const { top: secondTop, left: secondLeft, right: secondRight } = await second.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });

                // Ensure the second item is on the same row as the first
                expect(secondTop).toBe(firstTop);
                expect(secondLeft).toBeGreaterThan(firstLeft);

                const third = li.nth(2).locator(':scope > div');
                const { top: thirdTop, left: thirdLeft, right: thirdRight } = await third.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });

                // Ensure the third item is on the second row
                expect(thirdTop).toBeGreaterThan(firstTop);
                expect(thirdLeft).toBe(firstLeft);
                expect(thirdRight).toBe(firstRight);

                const fourth = li.nth(3).locator(':scope > div');
                const { top: fourthTop, left: fourthLeft, right: fourthRight } = await fourth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });

                // Ensure the fourth item is on the second row, with a gap
                expect(fourthTop).toBe(thirdTop);
                expect(fourthLeft).toBe(secondLeft);
                expect(fourthTop).toBeGreaterThan(firstBottom + 20);
                expect(fourthRight).toBe(secondRight);

                const fifth = li.nth(4).locator(':scope > div');
                const { top: fifthTop, left: fifthLeft, right: fifthRight } = await fifth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });

                // Ensure the fifth item is on the third row
                expect(fifthTop).toBeGreaterThan(secondTop);
                expect(fifthLeft).toBe(firstLeft);
                expect(fifthRight).toBe(firstRight);

                const sixth = li.nth(5).locator(':scope > div');
                const { top: sixthTop, left: sixthLeft, right: sixthRight } = await sixth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });

                // Ensure the sixth item is on the third row
                expect(sixthTop).toBe(fifthTop);
                expect(sixthLeft).toBe(fourthLeft);
                expect(sixthRight).toBe(secondRight);
            });

            test('mobile displays correctly', async ({ page }) => {
                await page.goto('http://localhost:2020/?user=public');
                await page.setViewportSize({ width: 320, height: 480 });

                const panel = page.getByTestId('help-navigation-panel');
                await panel.scrollIntoViewIfNeeded();
                const li = panel.locator('li');
                // Check that there are 6 items
                await expect(li).toHaveCount(6);

                // we have a 6 x 1 grid at mobile
                const first = li.nth(0);
                const { top: firstTop, left: firstLeft } = await first.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left };
                });

                const second = li.nth(1);
                const { top: secondTop, left: secondLeft } = await second.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left };
                });

                // Ensure the second item is below the first
                expect(secondTop).toBeGreaterThan(firstTop);
                expect(secondLeft).toBe(firstLeft);

                const third = li.nth(2);
                const { top: thirdTop, left: thirdLeft, bottom: thirdBottom } = await third.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, bottom: rect.top + rect.height };
                });
                // Ensure the third item is below the second
                expect(thirdTop).toBeGreaterThan(secondTop);
                expect(thirdLeft).toBe(firstLeft);

                const fourth = li.nth(3);
                const { top: fourthTop } = await fourth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top };
                });

                // Ensure the fourth item is below the third, with a gap
                expect(fourthTop).toBeGreaterThan(thirdTop);
                expect(fourthTop).toBeGreaterThan(thirdBottom + 20);

                const fifth = li.nth(4);
                const { top: fifthTop, left: fifthLeft } = await fifth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left };
                });

                // Ensure the fifth item is on below the fourth
                expect(fifthTop).toBeGreaterThan(fourthTop);
                expect(fifthLeft).toBe(firstLeft);

                const sixth = li.nth(5);
                const { top: sixthTop, left: sixthLeft } = await sixth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left };
                });

                // Ensure the sixth item is on below the fifth
                expect(sixthTop).toBeGreaterThan(fifthTop);
                expect(sixthLeft).toBe(firstLeft);
            });
        });
        test.describe('is accessible', () => {
            test('at desktop', async ({ page }) => {
                await page.goto('http://localhost:2020/?user=public');
                await page.setViewportSize({ width: 1300, height: 1000 });
                await page.getByTestId('help-navigation-panel').scrollIntoViewIfNeeded();
                await assertAccessibility(page, '[data-testid="help-navigation-panel"]');
            });
            test('at tablet', async ({ page }) => {
                await page.goto('http://localhost:2020/?user=public');
                await page.setViewportSize({ width: 1000, height: 900 });
                await page.getByTestId('help-navigation-panel').scrollIntoViewIfNeeded();
                await assertAccessibility(page, '[data-testid="help-navigation-panel"]');
            });
            test('at mobile', async ({ page }) => {
                await page.goto('http://localhost:2020/?user=public');
                await page.setViewportSize({ width: 320, height: 480 });
                await page.getByTestId('help-navigation-panel').scrollIntoViewIfNeeded();
                await assertAccessibility(page, '[data-testid="help-navigation-panel"]');
            });
        });
    });
});
