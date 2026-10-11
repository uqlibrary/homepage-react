import React from 'react';

import { rtlRender, screen } from 'test-utils';
import { OpeningHoursDown } from './OpeningHoursDown';
import { spaceOpeningHours } from 'modules/Pages/BookableSpaces/Shared/spacesHelpers';

jest.mock('modules/Pages/BookableSpaces/Shared/spacesHelpers', () => ({
    spaceOpeningHours: jest.fn(),
}));

describe('OpeningHoursDown', () => {
    const baseSpace = {
        space_id: 42,
        space_library_name: 'UQ Library',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns null while weekly hours are still loading', () => {
        const { container } = rtlRender(
            <OpeningHoursDown
                weeklyHoursLoading
                weeklyHoursError={false}
                weeklyHours={{ locations: [{ departments: [{ lid: 77 }] }] }}
                bookableSpace={baseSpace}
            />,
        );

        expect(container).toBeEmptyDOMElement();
        expect(spaceOpeningHours).not.toHaveBeenCalled();
    });

    it('renders an error message when the hours request failed', () => {
        rtlRender(
            <OpeningHoursDown
                weeklyHoursLoading={false}
                weeklyHoursError="Network error"
                weeklyHours={{ locations: [{ departments: [{ lid: 77 }] }] }}
                bookableSpace={baseSpace}
            />,
        );

        expect(screen.getByTestId('space-42-weekly-hours-error')).toHaveTextContent(
            'General opening hours currently unavailable - please try again later.',
        );
        expect(spaceOpeningHours).not.toHaveBeenCalled();
    });

    it('returns an empty result when the location has no opening hours', () => {
        const { container } = rtlRender(
            <OpeningHoursDown
                weeklyHoursLoading={false}
                weeklyHoursError={false}
                weeklyHours={{ locations: [] }}
                bookableSpace={baseSpace}
            />,
        );

        expect(container).toBeEmptyDOMElement();
        expect(spaceOpeningHours).not.toHaveBeenCalled();
    });

    it('returns an empty result when there are no opening entries to show', () => {
        spaceOpeningHours.mockReturnValue([]);

        const { container } = rtlRender(
            <OpeningHoursDown
                weeklyHoursLoading={false}
                weeklyHoursError={false}
                weeklyHours={{ locations: [{ departments: [{ lid: 77 }] }] }}
                bookableSpace={baseSpace}
            />,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders the short list of opening hours, highlighting today', () => {
        spaceOpeningHours.mockReturnValue([
            { dayName: 'Today', rendered: '9:00am–5:00pm' },
            { dayName: 'Tomorrow', rendered: '9:00am–5:00pm' },
            { dayName: 'Saturday', rendered: 'Closed' },
        ]);

        rtlRender(
            <OpeningHoursDown
                weeklyHoursLoading={false}
                weeklyHoursError={false}
                weeklyHours={{ locations: [{ departments: [{ lid: 77 }] }] }}
                bookableSpace={baseSpace}
            />,
        );

        expect(screen.getByText('UQ Library opening hours')).toBeInTheDocument();
        expect(screen.getByTestId('space-42-openingHours')).toBeInTheDocument();
        expect(screen.getByText('Today')).toBeInTheDocument();
        expect(screen.getByText('Tomorrow')).toBeInTheDocument();
        expect(screen.queryByText('Saturday')).not.toBeInTheDocument();
    });

    it('renders the full list when showShortList is false', () => {
        spaceOpeningHours.mockReturnValue([
            { dayName: 'Today', rendered: '9:00am–5:00pm' },
            { dayName: 'Tomorrow', rendered: '9:00am–5:00pm' },
            { dayName: 'Saturday', rendered: 'Closed' },
        ]);

        rtlRender(
            <OpeningHoursDown
                weeklyHoursLoading={false}
                weeklyHoursError={false}
                weeklyHours={{ locations: [{ departments: [{ lid: 77 }] }] }}
                bookableSpace={baseSpace}
                showShortList={false}
            />,
        );

        expect(screen.getByText('Saturday')).toBeInTheDocument();
    });
});
