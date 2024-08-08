import React from 'react';
import { rtlRender } from 'test-utils';
import PersonalisedPanel from './PersonalisedPanel';
function setup(testProps = {}) {
    const props = {
        account: { id: 'uqtest' },
        author: { aut_id: 79324 },
        loans: { recordNumber: 'vanilla' },
        printBalance: {
            balance: '12.50',
            cardNumber: '36122190182095876',
            email: 'k.lane@uq.edu.au',
            retrievedAt: '2020-11-25T11:50:15+00:00',
        },
        possibleRecords: 10,
        incompleteNTRORecords: { total: 18, took: 104, per_page: 20, current_page: 1, from: 1, to: 18 },
    };
    return rtlRender(<PersonalisedPanel {...props} {...testProps} />);
}

describe('PersonalisedPanel', () => {
    it('default values render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
