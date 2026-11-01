import { test as base } from '@playwright/test';
import { collectCoverageAsync } from '@uq/pw/lib/coverage/istanbul/collectCoverageAsync';
import { istanbulReportPartialsDir, istanbulStructureDir } from '@uq/pw/lib/constants';

export * from '@playwright/test';

let test = base;

test = test.extend({
    // mock API calls
    page: async ({ page }, use) => {
        await page.route('https://www.googletagmanager.com/**', route => {
            route.fulfill({
                status: 204,
                body: '',
            });
        });
        await page.route('https://**.sentry.io/**', route => {
            route.fulfill({
                status: 200,
                body: '{}',
            });
        });
        await page.route('https://api.library.uq.edu.au/**', route => {
            route.fulfill({
                status: 200,
                body: '{}',
            });
        });
        // Serve the UQ reusable web components as an empty stub so e2e tests do not fetch them (and the
        // fonts/images they pull) from the live CDN — that made every test depend on external hosts being
        // up and reachable. Tests that assert on the real header/footer (breadcrumbs, header/footer
        // presence) are handled separately.
        await page.route('https://assets.library.uq.edu.au/reusable-webcomponents/**', route => {
            route.fulfill({
                status: 200,
                body: '',
            });
        });
        // Block the external font hosts the app's own index.html and theme pull from, for the same reason:
        // an empty stylesheet loads no @font-face, so the browser falls back to a system font and makes no
        // network call. Nothing asserts on the fonts, so this only affects rendering, not test logic.
        for (const fontHost of [
            'https://static.uq.net.au/**',
            'https://fonts.googleapis.com/**',
            'https://fonts.gstatic.com/**',
        ]) {
            await page.route(fontHost, route => route.fulfill({ status: 200, body: '' }));
        }
        // next
        await use(page);
    },
});

// enable istanbul coverage collecting
if (process?.env?.NODE_ENV === 'cc') {
    test = test.extend({
        context: async ({ context }, use) => {
            await collectCoverageAsync(context, use, istanbulReportPartialsDir, istanbulStructureDir);
        },
    });
}

export { test };
