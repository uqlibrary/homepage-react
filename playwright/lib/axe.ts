import AxeBuilder from '@axe-core/playwright';
import { expect, Page } from '../test';

export const defaultIncludedImpacts = ['minor', 'moderate', 'serious', 'critical'];
export const defaultDisabledRules = ['aria-required-children', 'aria-progressbar-name'];

export const assertAccessibility = async (
    page: Page,
    selector: string,
    options?: {
        rules?: string[];
        disabledRules?: string[];
        includedImpacts?: string[];
    },
) => {
    await expect(async () => await expect(page.locator(selector)).toBeVisible({ timeout: 500 })).toPass();

    const builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']);
    const includedImpacts = options?.includedImpacts || defaultIncludedImpacts;
    const disableRules = options?.disabledRules || defaultDisabledRules;

    builder.include(selector);
    if (options?.rules?.length) {
        builder.withRules(options.rules);
    }
    if (options?.disabledRules?.length) {
        builder.disableRules(disableRules);
    }
    const results = await builder.analyze();

    const filtered = results.violations
        .filter(violation => !violation.impact || !includedImpacts.length || includedImpacts.includes(violation.impact))
        .filter(violation => !violation.id || !disableRules.length || !disableRules.includes(violation.id));
    if (filtered.length > 0) {
        console.error('Accessibility Violations Found (filtered by impact):');
        console.table(
            filtered.map(violation => ({
                ruleId: violation.id,
                description: violation.description,
                impact: violation.impact,
                nodes: violation.nodes.length,
                helpUrl: violation.helpUrl,
            })),
        );
    }
    expect(filtered).toEqual([]);
};
