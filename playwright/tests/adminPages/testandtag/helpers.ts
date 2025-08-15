import { Page } from '@uq/pw/test';

export const getFieldValue = async (page: Page, dataField: string, rowIndex: number) =>
    page.locator(`div[data-rowindex='${rowIndex}'] > div[data-field='${dataField}']`);

export const forcePageRefresh = async (page: Page) => {
    await page.getByTestId('test_tag_header-navigation-dashboard').click();
    await page.goBack();
};
