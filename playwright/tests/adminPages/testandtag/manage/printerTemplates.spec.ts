import { test, expect, Page } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertTitles, forcePageRefresh, getFieldValue } from '../helpers';
import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

test.describe('Test and Tag Manage Printer Templates', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/manage/printertemplates?user=uqtesttag');
        await page.setViewportSize({ width: 1300, height: 1000 });
    });

    test('page is accessible and renders base', async ({ page }) => {
        await assertTitles(page, locale.pages.manage.printertemplates.header.pageSubtitle(null, 'Library'));
        await forcePageRefresh(page);
        await expect(
            (await getFieldValue(page, 'printer_template_name', 0)).getByText('UQL Standard Template'),
        ).toBeVisible();
        await expect((await getFieldValue(page, 'printer_template_name', 1)).getByText('UQL Template B')).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test.describe('Printer template editor', () => {
        const addChip = async (page: Page, value: string) => {
            await page.getByTestId('identifiers-input').fill(value);
            await page.getByTestId('identifiers-input').press('Enter');
        };
        const removeChipByIndex = async (page: Page, index: number) => {
            const chip = await page.locator('[name=identifiers] .MuiChip-root [data-testid="CancelIcon"]').nth(index);
            await chip.click();
        };
        const assertErrorStateForField = async (
            page: Page,
            label: string,
            helperText: string,
            visible = true,
            assertActionButton = true,
        ) => {
            if (visible) {
                await expect(page.getByTestId(label)).toHaveClass(/Mui-error/);
                await expect(page.getByText(helperText)).toBeVisible();
                if (assertActionButton) {
                    await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();
                }
            } else {
                await expect(page.getByTestId(label)).not.toHaveClass(/Mui-error/);
                await expect(page.getByText(helperText)).not.toBeVisible();
                if (assertActionButton) {
                    await expect(page.getByTestId('update_dialog-action-button')).toBeEnabled();
                }
            }
        };

        test.describe('Adding a printer template', () => {
            test.beforeEach(async ({ page }) => {
                await assertTitles(page, locale.pages.manage.printertemplates.header.pageSubtitle(null, 'Library'));
                await forcePageRefresh(page);
                await expect(
                    (await getFieldValue(page, 'printer_template_name', 0)).getByText('UQL Standard Template'),
                ).toBeVisible();
                await expect(
                    (await getFieldValue(page, 'printer_template_name', 1)).getByText('UQL Template B'),
                ).toBeVisible();

                // Click the first edit button
                await page.getByRole('button', { name: 'Add printer template' }).click();
                await assertAccessibility(page, '[data-testid="StandardPage"]');

                await expect(
                    page
                        .getByTestId('update_dialog-printer-template-management')
                        .locator('h2')
                        .getByText('Add new printer template'),
                ).toBeVisible();
            });

            test('default state as expected', async ({ page }) => {
                await expect(page.getByTestId('printer_template_name-input')).toHaveValue('');
                await expect(page.locator('.MuiChip-root')).not.toBeVisible();
                await expect(page.getByTestId('data_table-vars-input').getByRole('row')).toHaveCount(1); // inc header
                await expect(page.getByTestId('printer_template_code-input')).toHaveValue('');
                await expect(page.getByTestId('printer_template_current_flag_cb-input')).toBeChecked();

                await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();

                // Click Cancel
                await page.getByTestId('update_dialog-cancel-button').click();
                await expect(
                    page
                        .getByTestId('update_dialog-printer-template-management')
                        .locator('h2')
                        .getByText('Add new printer template'),
                ).not.toBeVisible();
            });

            test('can create new template', async ({ page }) => {
                const addTestRow = async () => {
                    await expect(page.getByRole('menuitem', { name: 'Save' })).toBeVisible();

                    await page
                        .locator('[data-field="printer_template_var_name"] input')
                        .pressSequentially('testname', { delay: 50 });
                    await page.keyboard.press('Tab');

                    await page
                        .locator('[data-field="printer_template_var_label"] input')
                        .pressSequentially('test label', { delay: 50 });
                    await page.keyboard.press('Tab');

                    await page
                        .locator('[data-field="printer_template_var_value"] input')
                        .pressSequentially('100', { delay: 50 });

                    await page.waitForTimeout(500);
                };

                await expect(page.getByTestId('printer_template_name-input')).toHaveValue('');
                await assertErrorStateForField(
                    page,
                    'printer_template_name-label',
                    'A printer template name is required',
                );
                await page.getByTestId('printer_template_name-input').fill('UQL Standard Template updated');
                await assertErrorStateForField(
                    page,
                    'printer_template_name-label',
                    'A printer template name is required',
                    false,
                    false,
                );

                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                    true,
                    false,
                );

                // PRINTER IDENTIFIERS
                await addChip(page, 'PRINTER_TEST');
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                    false,
                    false,
                );

                // add button should be disabled
                await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();

                // add identifier already in use by other template
                await addChip(page, 'PRINTER_01');
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                    true,
                    false,
                );
                await removeChipByIndex(page, 1); // remove conflicting identifier
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                    false,
                    false,
                );
                const chipCount = await page.locator('[name=identifiers] .MuiChip-root').all();
                await expect(chipCount.length).toBe(1);

                // add duplicate identifier for this template
                await addChip(page, 'PRINTER_TEST'); // shouldnt be added
                const newChipCount = await page.locator('[name=identifiers] .MuiChip-root').all();
                await expect(newChipCount.length).toBe(chipCount.length);

                // add identifier that's too long
                await addChip(page, 'a'.repeat(256));
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                    true,
                    false,
                );

                await removeChipByIndex(page, 1); // remove too long identifier
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                    false,
                    false,
                );

                // add button still disabled
                await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();

                // USER VARS
                await assertErrorStateForField(
                    page,
                    'data_table-vars-label',
                    'One or more defined variables are missing from the template code. All variables must be included in the printer template code as {{VARNAME}}',
                    false,
                    false,
                );
                await page.getByRole('button', { name: 'Add template variable' }).click();
                await expect(page.getByRole('menuitem', { name: 'Save' })).toBeVisible();

                await page.getByRole('menuitem', { name: 'Save' }).click();
                await expect(page.getByTestId('confirmation_alert-error')).toHaveText(
                    'All fields must be completed before saving.',
                );
                await page.getByRole('menuitem', { name: 'Cancel' }).click();
                await expect(page.getByRole('menuitem', { name: 'Save' })).not.toBeVisible();

                // add row
                await page.getByRole('button', { name: 'Add template variable' }).click();
                await addTestRow();
                await page.getByRole('menuitem', { name: 'Save' }).click();

                await expect(page.getByRole('menuitem', { name: 'Save' })).not.toBeVisible();
                await expect(page.locator('[data-field="printer_template_var_name"] input')).not.toBeVisible();
                await expect(page.locator('[data-field="printer_template_var_label"] input')).not.toBeVisible();
                await expect(page.locator('[data-field="printer_template_var_value"] input')).not.toBeVisible();
                await assertErrorStateForField(
                    page,
                    'data_table-vars-label',
                    'One or more defined variables are missing from the template code. All variables must be included in the printer template code as {{VARNAME}}',
                    true,
                    false,
                );
                // delete new row to remove error state
                await page
                    .getByTestId('data_table-vars-input')
                    .locator('[data-rowindex]')
                    .first()
                    .getByRole('menuitem', { name: 'Delete' })
                    .click();
                await assertErrorStateForField(
                    page,
                    'data_table-vars-label',
                    'One or more defined variables are missing from the template code. All variables must be included in the printer template code as {{VARNAME}}',
                    false,
                    false,
                );

                // add row again
                await page.getByRole('button', { name: 'Add template variable' }).click();
                await addTestRow();
                await page.getByRole('menuitem', { name: 'Save' }).click();
                await assertErrorStateForField(
                    page,
                    'data_table-vars-label',
                    'One or more defined variables are missing from the template code. All variables must be included in the printer template code as {{VARNAME}}',
                    true,
                    false,
                );

                // add button still disabled
                await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();

                // The accordion is open by default in Add mode, so it should already be expanded
                await expect(page.getByRole('button', { name: 'Printer template code' })).toHaveAttribute(
                    'aria-expanded',
                    'true',
                );
                await expect(page.getByTestId('printer_template_code-input')).toBeVisible();
                await page.getByTestId('printer_template_code-input').clear();
                await expect(page.getByTestId('printer_template_code-input')).toHaveValue('');
                await assertErrorStateForField(
                    page,
                    'printer_template_code-label',
                    'Printer template code is required and must include defined placeholder variables',
                    true,
                    false,
                );

                await page.getByTestId('printer_template_code-input').pressSequentially('{{TESTNAME}}', { delay: 50 });
                await expect(page.getByTestId('printer_template_code-input')).toHaveValue('{{TESTNAME}}');

                // finally, add button should be enabled
                await assertErrorStateForField(
                    page,
                    'printer_template_code-label',
                    'Printer template code is required and must include defined placeholder variables',
                    false,
                );

                const currentTemplateCheckbox = page.getByTestId('printer_template_current_flag_cb-input');
                await expect(currentTemplateCheckbox).toBeChecked();
                await currentTemplateCheckbox.click();
                await expect(currentTemplateCheckbox).not.toBeChecked();
                await currentTemplateCheckbox.click();
                await expect(currentTemplateCheckbox).toBeChecked();

                await page.getByTestId('update_dialog-action-button').click();
                await expect(
                    page
                        .getByTestId('update_dialog-printer-template-management')
                        .locator('h2')
                        .getByText('Edit printer template'),
                ).not.toBeVisible();
                await expect(page.getByTestId('confirmation_alert-success')).toHaveText(
                    'Request successfully completed',
                );
            });
        });

        test.describe('Editing a printer template', () => {
            test.beforeEach(async ({ page }) => {
                await assertTitles(page, locale.pages.manage.printertemplates.header.pageSubtitle(null, 'Library'));
                await forcePageRefresh(page);
                await expect(
                    (await getFieldValue(page, 'printer_template_name', 0)).getByText('UQL Standard Template'),
                ).toBeVisible();
                await expect(
                    (await getFieldValue(page, 'printer_template_name', 1)).getByText('UQL Template B'),
                ).toBeVisible();

                // Click the first edit button
                await page.getByTestId('action_cell-1-edit-button').click();
                await assertAccessibility(page, '[data-testid="StandardPage"]');

                await expect(
                    page
                        .getByTestId('update_dialog-printer-template-management')
                        .locator('h2')
                        .getByText('Edit printer template'),
                ).toBeVisible();
            });

            test('default state as expected', async ({ page }) => {
                await expect(page.getByTestId('printer_template_name-input')).toHaveValue('UQL Standard Template');
                await expect(page.getByRole('button', { name: 'PRINTER_01' })).toBeVisible();
                await expect(page.getByRole('button', { name: 'PRINTER_01' })).toBeVisible();
                await expect(page.getByTestId('data_table-vars-input').getByRole('row')).toHaveCount(17);
                await expect(page.getByTestId('printer_template_code-input')).toHaveValue(/\^XA\^FO\{\{LOGOX\}\}/); // partial regexp match
                await expect(page.getByTestId('printer_template_current_flag_cb-input')).toBeChecked();
                // Click Cancel
                await page.getByTestId('update_dialog-cancel-button').click();
                await expect(
                    page
                        .getByTestId('update_dialog-printer-template-management')
                        .locator('h2')
                        .getByText('Edit printer template'),
                ).not.toBeVisible();
            });

            test('Saves as expected', async ({ page }) => {
                // Save without any changes
                await page.getByRole('button', { name: 'Update' }).click();
                await expect(
                    page
                        .getByTestId('update_dialog-printer-template-management')
                        .locator('h2')
                        .getByText('Edit printer template'),
                ).not.toBeVisible();
                await expect(page.getByTestId('confirmation_alert-success')).toHaveText(
                    'Request successfully completed',
                );
            });

            test('name validation functions correctly', async ({ page }) => {
                await assertErrorStateForField(
                    page,
                    'printer_template_name-label',
                    'A printer template name is required',
                    false,
                );
                await page.getByTestId('printer_template_name-input').clear();
                // enter empty string
                await expect(page.getByTestId('printer_template_name-input')).toHaveValue('');
                await assertErrorStateForField(
                    page,
                    'printer_template_name-label',
                    'A printer template name is required',
                );
                // enter valid name
                await page.getByTestId('printer_template_name-input').clear();
                await expect(page.getByTestId('printer_template_name-input')).toHaveValue('');
                await page.getByTestId('printer_template_name-input').fill('UQL Standard Template updated');
                await assertErrorStateForField(
                    page,
                    'printer_template_name-label',
                    'A printer template name is required',
                    false,
                );
            });

            test('identifiers validation functions correctly', async ({ page }) => {
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                    false,
                );
                const cancelIcon = await page
                    .locator('[name=identifiers] .MuiChip-root [data-testid="CancelIcon"]')
                    .first();
                while (await cancelIcon.isVisible()) {
                    await cancelIcon.click();
                }
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                );

                // add valid identifier
                await addChip(page, 'PRINTER_TEST');
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                    false,
                );

                // add identifier already in use by other template
                await addChip(page, 'PRINTER_03');
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                );
                await removeChipByIndex(page, 1); // remove conflicting identifier
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                    false,
                );
                // add duplicate identifier for this template
                await addChip(page, 'PRINTER_TEST');
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                );
                await removeChipByIndex(page, 1); // remove duplicate identifier
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                    false,
                );

                // add identifier that's too long
                await addChip(page, 'a'.repeat(256));
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                );
                await removeChipByIndex(page, 1); // remove too long identifier
                await assertErrorStateForField(
                    page,
                    'identifiers-label',
                    'A printer identifier is required and must not have been used with another template.',
                    false,
                );
            });

            test('user variables validation functions correctly', async ({ page }) => {
                await assertErrorStateForField(
                    page,
                    'data_table-vars-label',
                    'One or more defined variables are missing from the template code. All variables must be included in the printer template code as {{VARNAME}}',
                    false,
                );
                await page.getByRole('button', { name: 'Add template variable' }).click();
                await expect(page.getByRole('menuitem', { name: 'Save' })).toBeVisible();

                await page.getByRole('menuitem', { name: 'Save' }).click();
                await expect(page.getByTestId('confirmation_alert-error')).toHaveText(
                    'All fields must be completed before saving.',
                );
                await page.getByRole('menuitem', { name: 'Cancel' }).click();
                await expect(page.getByRole('menuitem', { name: 'Save' })).not.toBeVisible();
                const addTestRow = async () => {
                    await expect(page.getByRole('menuitem', { name: 'Save' })).toBeVisible();

                    await page
                        .locator('[data-field="printer_template_var_name"] input')
                        .pressSequentially('testname', { delay: 50 });
                    await page.keyboard.press('Tab');

                    await page
                        .locator('[data-field="printer_template_var_label"] input')
                        .pressSequentially('test label', { delay: 50 });
                    await page.keyboard.press('Tab');

                    await page
                        .locator('[data-field="printer_template_var_value"] input')
                        .pressSequentially('100', { delay: 50 });

                    await page.waitForTimeout(500);
                };
                // add row
                await page.getByRole('button', { name: 'Add template variable' }).click();
                await addTestRow();
                await page.getByRole('menuitem', { name: 'Save' }).click();

                await expect(page.getByRole('menuitem', { name: 'Save' })).not.toBeVisible();
                await expect(page.locator('[data-field="printer_template_var_name"] input')).not.toBeVisible();
                await expect(page.locator('[data-field="printer_template_var_label"] input')).not.toBeVisible();
                await expect(page.locator('[data-field="printer_template_var_value"] input')).not.toBeVisible();
                await assertErrorStateForField(
                    page,
                    'data_table-vars-label',
                    'One or more defined variables are missing from the template code. All variables must be included in the printer template code as {{VARNAME}}',
                );
                // delete new row to remove error state
                await page
                    .getByTestId('data_table-vars-input')
                    .locator('[data-rowindex]')
                    .first()
                    .getByRole('menuitem', { name: 'Delete' })
                    .click();
                await assertErrorStateForField(
                    page,
                    'data_table-vars-label',
                    'One or more defined variables are missing from the template code. All variables must be included in the printer template code as {{VARNAME}}',
                    false,
                );

                // add row again
                await page.getByRole('button', { name: 'Add template variable' }).click();
                await addTestRow();
                await page.getByRole('menuitem', { name: 'Save' }).click();
                await assertErrorStateForField(
                    page,
                    'data_table-vars-label',
                    'One or more defined variables are missing from the template code. All variables must be included in the printer template code as {{VARNAME}}',
                );

                // now check error is removed if we update the template code
                await page.getByRole('button', { name: 'Printer template code' }).click();
                await expect(page.getByTestId('printer_template_code-input')).toBeVisible();
                await page.getByTestId('printer_template_code-input').pressSequentially('{{TESTNAME}}', { delay: 50 });
                await assertErrorStateForField(
                    page,
                    'data_table-vars-label',
                    'One or more defined variables are missing from the template code. All variables must be included in the printer template code as {{VARNAME}}',
                    false,
                );
            });

            test('template printer code validates as expected', async ({ page }) => {
                await assertErrorStateForField(
                    page,
                    'printer_template_code-label',
                    'Printer template code is required and must include defined placeholder variables',
                    false,
                );
                await page.getByRole('button', { name: 'Printer template code' }).click();
                await expect(page.getByTestId('printer_template_code-input')).toBeVisible();
                await page.getByTestId('printer_template_code-input').clear();
                await expect(page.getByTestId('printer_template_code-input')).toHaveValue('');
                await assertErrorStateForField(
                    page,
                    'printer_template_code-label',
                    'Printer template code is required and must include defined placeholder variables',
                );
                await assertErrorStateForField(
                    page,
                    'data_table-vars-label',
                    'One or more defined variables are missing from the template code. All variables must be included in the printer template code as {{VARNAME}}',
                );
                await page.getByTestId('printer_template_code-input').pressSequentially('{{TESTVAR}}', { delay: 50 });
                await assertErrorStateForField(
                    page,
                    'printer_template_code-label',
                    'Printer template code is required and must include defined placeholder variables',
                    false,
                    false,
                );
                // vars error should still be visible as the template code is missing a bunch of placeholders
                await assertErrorStateForField(
                    page,
                    'data_table-vars-label',
                    'One or more defined variables are missing from the template code. All variables must be included in the printer template code as {{VARNAME}}',
                    true,
                    false,
                );
            });

            test('current template checkbox functions as expected', async ({ page }) => {
                const currentTemplateCheckbox = page.getByTestId('printer_template_current_flag_cb-input');
                await expect(currentTemplateCheckbox).toBeChecked();
                await currentTemplateCheckbox.click();
                await expect(currentTemplateCheckbox).not.toBeChecked();
                await currentTemplateCheckbox.click();
                await expect(currentTemplateCheckbox).toBeChecked();
            });
        });
    });
});
