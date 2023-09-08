import React from 'react';
import { rtlRender } from 'test-utils';

import FooterRow from './FooterRow';

function setup(testProps = {}, renderer = rtlRender) {
    const locale = { form: { totalInspections: count => `Test counter: ${count}` } };
    const { ...props } = testProps;

    return renderer(<FooterRow locale={locale} {...props} />);
}

describe('FooterRow', () => {
    it('renders component', () => {
        const { getByTestId } = setup({ count: 100 });
        expect(getByTestId('data_table_total-user-inspections')).toHaveTextContent('Test counter: 100');
    });
});
