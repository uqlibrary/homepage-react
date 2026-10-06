import React from 'react';
import { rtlRender } from 'test-utils';
import { ASKUS_SPRINGSHARE_ID, FRYER_SPRINGSHARE_ID } from 'config/locale';

import BusynessBar from './BusynessBar';
import { VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING } from '../helpers';

const location = { lid: 3823, isCurrentlyOpen: true, busyness: 25 };

function setup(testProps = {}) {
    return rtlRender(<BusynessBar location={{ ...location, ...testProps }} />);
}

describe('BusynessBar', () => {
    it.each([
        [25, 'Not busy'],
        [50, 'Moderately busy'],
        [75, 'Quite busy'],
        [76, 'Very busy'],
    ])('renders %s percent occupancy with the %s aria-label', (busyness, ariaLabel) => {
        const { getByRole } = setup({ busyness });

        expect(getByRole('progressbar', { name: ariaLabel })).toHaveAttribute('aria-valuenow', String(busyness));
    });

    it('omits occupancy for AskUs', () => {
        const { container } = setup({ lid: ASKUS_SPRINGSHARE_ID });

        expect(container).toBeEmptyDOMElement();
    });

    it('shows appointment information for Fryer', () => {
        const { getByText, queryByRole } = setup({ lid: FRYER_SPRINGSHARE_ID });

        expect(getByText('By appointment')).toBeInTheDocument();
        expect(queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('shows a closed state', () => {
        const { getByText } = setup({ isCurrentlyOpen: false });

        expect(getByText('Closed')).toBeInTheDocument();
    });

    it('does not render a bar without occupancy data', () => {
        const { container } = setup({ busyness: null });

        expect(container).toBeEmptyDOMElement();
    });

    it('shows when occupancy data is unavailable', () => {
        const { getByText } = setup({ busyness: VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING });

        expect(getByText('Data not available')).toBeInTheDocument();
    });
});
