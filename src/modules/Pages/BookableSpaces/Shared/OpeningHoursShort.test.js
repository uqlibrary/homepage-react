import React from 'react';

import { rtlRender, screen } from 'test-utils';
import OpeningHoursShort from './OpeningHoursShort';
import { spaceOpeningHours } from 'modules/Pages/BookableSpaces/Shared/spacesHelpers';

jest.mock('modules/Pages/BookableSpaces/Shared/spacesHelpers', () => ({
    spaceOpeningHours: jest.fn(),
}));

describe('OpeningHoursShort', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns null while weekly hours are still loading', () => {
        const { container } = rtlRender(
            <OpeningHoursShort
                weeklyHoursLoading={true}
                weeklyHoursError={false}
                weeklyHours={{}}
                bookableSpace={{ space_opening_hours_id: 77 }}
            />,
        );

        expect(container).toBeEmptyDOMElement();
        expect(spaceOpeningHours).not.toHaveBeenCalled();
    });

    it('returns null when the hours request returned an error', () => {
        const { container } = rtlRender(
            <OpeningHoursShort
                weeklyHoursLoading={false}
                weeklyHoursError="Network error"
                weeklyHours={{}}
                bookableSpace={{ space_opening_hours_id: 77 }}
            />,
        );

        expect(container).toBeEmptyDOMElement();
        expect(spaceOpeningHours).not.toHaveBeenCalled();
    });

    it('returns null when the selected location has no opening hours', () => {
        const { container } = rtlRender(
            <OpeningHoursShort
                weeklyHoursLoading={false}
                weeklyHoursError={false}
                weeklyHours={{ locations: [] }}
                bookableSpace={{ space_opening_hours_id: 77 }}
            />,
        );

        expect(container).toBeEmptyDOMElement();
        expect(spaceOpeningHours).not.toHaveBeenCalled();
    });

    it('returns null when there are no opening entries to display', () => {
        spaceOpeningHours.mockReturnValue([]);

        const { container } = rtlRender(
            <OpeningHoursShort
                weeklyHoursLoading={false}
                weeklyHoursError={false}
                weeklyHours={{ locations: [{ departments: [{ lid: 77 }] }] }}
                bookableSpace={{ space_opening_hours_id: 77 }}
            />,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders today’s opening hours for the selected space', () => {
        spaceOpeningHours.mockReturnValue([{ dayName: 'Today', rendered: '9:00am–5:00pm' }]);

        rtlRender(
            <OpeningHoursShort
                weeklyHoursLoading={false}
                weeklyHoursError={false}
                weeklyHours={{ locations: [{ departments: [{ lid: 77 }] }] }}
                bookableSpace={{ space_opening_hours_id: 77 }}
            />,
        );

        expect(screen.getByText('Opening hours')).toBeInTheDocument();
        expect(screen.getByText(/Today: 9:00am–5:00pm/i)).toBeInTheDocument();
    });
});
