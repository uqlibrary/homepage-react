import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

const expectWithinOnePixel = (actual: number, expected: number) => {
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(1);
};

const waitForLayoutToSettle = async page => {
    await page.waitForLoadState('networkidle');
    await page.evaluate(async () => {
        if (document.fonts?.ready) {
            await document.fonts.ready;
        }
        await new Promise(resolve => requestAnimationFrame(() => resolve(null)));
        await new Promise(resolve => requestAnimationFrame(() => resolve(null)));
    });
};

const waitForTabletBig6Grid = async li => {
    await expect
        .poll(async () => {
            const tops = await li.evaluateAll(elements =>
                elements.map(el => (el.firstElementChild || el).getBoundingClientRect().top),
            );

            if (tops.length !== 6) {
                return false;
            }

            return (
                Math.abs(tops[0] - tops[1]) <= 1 &&
                tops[2] > tops[0] + 1 &&
                Math.abs(tops[2] - tops[3]) <= 1 &&
                tops[4] > tops[2] + 1 &&
                Math.abs(tops[4] - tops[5]) <= 1
            );
        })
        .toBe(true);
};

const waitForDesktopBig6Grid = async li => {
    await expect
        .poll(async () => {
            const tops = await li.evaluateAll(elements => elements.map(el => el.getBoundingClientRect().top));

            if (tops.length !== 6) {
                return false;
            }

            return (
                Math.abs(tops[0] - tops[1]) <= 1 &&
                Math.abs(tops[1] - tops[2]) <= 1 &&
                tops[3] > tops[0] + 1 &&
                Math.abs(tops[3] - tops[4]) <= 1 &&
                Math.abs(tops[4] - tops[5]) <= 1
            );
        })
        .toBe(true);
};

test.describe('header', () => {
    test.describe('Big 6 Nav', () => {
        test.describe('displays correctly', () => {
            test('desktop displays correctly', async ({ page }) => {
                await page.goto('http://localhost:2020/?user=public');
                await page.setViewportSize({ width: 1300, height: 1000 });
                await waitForLayoutToSettle(page);

                const panel = page.getByTestId('help-navigation-panel');
                const li = panel.locator('li');
                await expect(li).toHaveCount(6);
                await waitForDesktopBig6Grid(li);

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
                expectWithinOnePixel(secondTop, firstTop);
                expect(secondLeft).toBeGreaterThan(firstLeft);

                const third = li.nth(2);
                const { top: thirdTop, left: thirdLeft, right: thirdRight } = await third.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });
                // Ensure the third item is on the same row as the firs
                expectWithinOnePixel(thirdTop, firstTop);
                expect(thirdLeft).toBeGreaterThan(firstLeft);

                const fourth = li.nth(3);
                const { top: fourthTop, left: fourthLeft, right: fourthRight } = await fourth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });
                // Ensure the fourth item is on the next row, with a gap
                expect(fourthTop).toBeGreaterThan(firstTop);
                expectWithinOnePixel(fourthLeft, firstLeft);
                expectWithinOnePixel(fourthRight, firstRight);
                expect(fourthTop).toBeGreaterThan(firstBottom + 20);

                const fifth = li.nth(4);
                const { top: fifthTop, left: fifthLeft, right: fifthRight } = await fifth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });
                // Ensure the fifth item is on the next row
                expect(fifthTop).toBeGreaterThan(firstTop);
                expectWithinOnePixel(fifthLeft, secondLeft);
                expectWithinOnePixel(fifthRight, secondRight);

                const sixth = li.nth(5);
                const { top: sixthTop, left: sixthLeft, right: sixthRight } = await sixth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });

                // Ensure the sixth item is on the next row
                expect(sixthTop).toBeGreaterThan(firstTop);
                expectWithinOnePixel(sixthLeft, thirdLeft);
                expectWithinOnePixel(sixthRight, thirdRight);
            });
            test('tablet displays correctly', async ({ page }) => {
                await page.goto('http://localhost:2020/?user=public');
                await page.setViewportSize({ width: 840, height: 900 });
                await waitForLayoutToSettle(page);

                const panel = page.getByTestId('help-navigation-panel');
                const li = panel.locator('li');
                await expect(li).toHaveCount(6);
                await waitForTabletBig6Grid(li);

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
                expectWithinOnePixel(secondTop, firstTop);
                expect(secondLeft).toBeGreaterThan(firstLeft);

                const third = li.nth(2).locator(':scope > div');
                const { top: thirdTop, left: thirdLeft, right: thirdRight } = await third.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });

                // Ensure the third item is on the second row
                expect(thirdTop).toBeGreaterThan(firstTop);
                expectWithinOnePixel(thirdLeft, firstLeft);
                expectWithinOnePixel(thirdRight, firstRight);

                const fourth = li.nth(3).locator(':scope > div');
                const { top: fourthTop, left: fourthLeft, right: fourthRight } = await fourth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });

                // Ensure the fourth item is on the second row, with a gap
                expectWithinOnePixel(fourthTop, thirdTop);
                expectWithinOnePixel(fourthLeft, secondLeft);
                expect(fourthTop).toBeGreaterThan(firstBottom + 20);
                expectWithinOnePixel(fourthRight, secondRight);

                const fifth = li.nth(4).locator(':scope > div');
                const { top: fifthTop, left: fifthLeft, right: fifthRight } = await fifth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });

                // Ensure the fifth item is on the third row
                expect(fifthTop).toBeGreaterThan(secondTop);
                expectWithinOnePixel(fifthLeft, firstLeft);
                expectWithinOnePixel(fifthRight, firstRight);

                const sixth = li.nth(5).locator(':scope > div');
                const { top: sixthTop, left: sixthLeft, right: sixthRight } = await sixth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, right: rect.left + rect.width };
                });

                // Ensure the sixth item is on the third row
                expectWithinOnePixel(sixthTop, fifthTop);
                expectWithinOnePixel(sixthLeft, fourthLeft);
                expectWithinOnePixel(sixthRight, secondRight);
            });

            test('mobile displays correctly', async ({ page }) => {
                await page.goto('http://localhost:2020/?user=public');
                await page.setViewportSize({ width: 320, height: 480 });
                await waitForLayoutToSettle(page);

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
                expectWithinOnePixel(secondLeft, firstLeft);

                const third = li.nth(2);
                const { top: thirdTop, left: thirdLeft, bottom: thirdBottom } = await third.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left, bottom: rect.top + rect.height };
                });
                // Ensure the third item is below the second
                expect(thirdTop).toBeGreaterThan(secondTop);
                expectWithinOnePixel(thirdLeft, firstLeft);

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
                expectWithinOnePixel(fifthLeft, firstLeft);

                const sixth = li.nth(5);
                const { top: sixthTop, left: sixthLeft } = await sixth.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    return { top: rect.top, left: rect.left };
                });

                // Ensure the sixth item is on below the fifth
                expect(sixthTop).toBeGreaterThan(fifthTop);
                expectWithinOnePixel(sixthLeft, firstLeft);
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
