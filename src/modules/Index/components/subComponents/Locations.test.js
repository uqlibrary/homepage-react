import React from 'react';
import Locations from './Locations';
import { rtlRender, WithRouter } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(
        <WithRouter>
            <Locations {...testProps} />
        </WithRouter>,
    );
}

describe('Locations panel', () => {
    it('should render loading panel', () => {
        const props = {
            libHoursLoading: true,
            libHoursError: false,
            libHours: null,
            vemcountLoading: true,
            vemcountError: false,
            vemcount: null,
        };
        const { getByTestId } = setup({ ...props });
        expect(getByTestId('hours-loader')).toBeInTheDocument();
    });
    it('should render error panel', () => {
        const props = {
            libHoursLoading: false,
            libHoursError: true,
            libHours: null,
            vemcountLoading: false,
            vemcountError: true,
            vemcount: null,
        };
        const { getByTestId } = setup({ ...props });
        expect(getByTestId('locations-panel-content')).toBeInTheDocument();
    });
});
