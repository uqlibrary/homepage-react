import { expect, Page } from '@uq/pw/test';
import { default as locale } from '../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

export const assertTitles = async (page: Page, subTitle: string) => {
    await expect(page.locator('h1')).toContainText(locale.pages.general.pageTitle);
    await expect(page.locator('h2').getByText(subTitle)).toBeVisible();
};

export const getFieldValue = async (page: Page, dataField: string, rowIndex: number) =>
    page.locator(`div[data-rowindex='${rowIndex}'] > div[data-field='${dataField}']`);

export const forcePageRefresh = async (page: Page) => {
    await page.getByTestId('test_tag_header-navigation-dashboard').click();
    await page.goBack();
};
