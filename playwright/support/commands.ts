import { Page } from '../test';

export async function rendersALoggedOutUser(page: Page, hasPanels: (page: Page, options: string[]) => Promise<void>) {
    await page.context().clearCookies();
    await page.goto('/?user=public');
    await page.setViewportSize({ width: 1300, height: 1000 });
    await hasPanels(page, []);
}
