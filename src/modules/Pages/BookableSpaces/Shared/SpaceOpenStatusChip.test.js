import React from 'react';

import { rtlRender, screen } from 'test-utils';

import { SpaceOpenStatusChip } from './SpaceOpenStatusChip';

describe('SpaceOpenStatusChip', () => {
    const pad = value => String(value).padStart(2, '0');
    const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const formatDateTime = date =>
        `${formatDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

    const buildWeeklyHoursForDay = (dayName, date, openTime, closeTime) => ({
        locations: [
            {
                departments: [
                    {
                        lid: 77,
                        weeks: [
                            {
                                [dayName]: {
                                    date: formatDate(date),
                                    open: openTime,
                                    close: closeTime,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    });

    beforeEach(() => {
        jest.useRealTimers();
    });

    it('renders nothing while hours are still loading', () => {
        rtlRender(
            <SpaceOpenStatusChip
                space={{ space_outages: [], space_opening_hours_id: 77 }}
                weeklyHoursLoading
                weeklyHoursError={false}
            />,
        );

        expect(screen.queryByTestId('spaces-journey-open-status-chip-open')).not.toBeInTheDocument();
        expect(screen.queryByTestId('spaces-journey-open-status-chip-closed')).not.toBeInTheDocument();
    });

    it('renders nothing when the hours request failed', () => {
        rtlRender(
            <SpaceOpenStatusChip
                space={{ space_outages: [], space_opening_hours_id: 77 }}
                weeklyHours={null}
                weeklyHoursLoading={false}
                weeklyHoursError
            />,
        );

        expect(screen.queryByTestId('spaces-journey-open-status-chip-open')).not.toBeInTheDocument();
    });

    it('renders a current outage as currently closed', () => {
        const now = new Date(2026, 3, 24, 10, 0, 0, 0);
        jest.useFakeTimers().setSystemTime(now.getTime());

        rtlRender(
            <SpaceOpenStatusChip
                space={{
                    space_outages: [
                        {
                            space_outage_start: formatDateTime(new Date(2026, 3, 24, 9, 0, 0, 0)),
                            space_outage_end: formatDateTime(new Date(2026, 3, 24, 18, 0, 0, 0)),
                            space_outage_reason: 'Maintenance',
                        },
                    ],
                }}
                weeklyHours={buildWeeklyHoursForDay('Friday', new Date(2026, 3, 24), '09:00:00', '17:00:00')}
                weeklyHoursLoading={false}
                weeklyHoursError={false}
            />,
        );

        expect(screen.getByTestId('spaces-journey-open-status-chip-closed')).toHaveTextContent('Currently closed');
    });

    it('renders an upcoming outage as closing soon', () => {
        const now = new Date(2026, 3, 24, 9, 0, 0, 0);
        jest.useFakeTimers().setSystemTime(now.getTime());

        rtlRender(
            <SpaceOpenStatusChip
                space={{
                    space_outages: [
                        {
                            space_outage_start: formatDateTime(new Date(2026, 3, 25, 9, 0, 0, 0)),
                            space_outage_end: formatDateTime(new Date(2026, 3, 25, 18, 0, 0, 0)),
                            space_outage_reason: 'Lift works',
                        },
                    ],
                }}
                weeklyHours={buildWeeklyHoursForDay('Friday', new Date(2026, 3, 24), '09:00:00', '17:00:00')}
                weeklyHoursLoading={false}
                weeklyHoursError={false}
            />,
        );

        expect(screen.getByTestId('spaces-journey-open-status-chip-closing-soon')).toHaveTextContent('Closing soon');
    });

    it('renders open now when the current opening period is active', () => {
        jest.useFakeTimers().setSystemTime(new Date(2026, 3, 24, 10, 0, 0, 0).getTime());

        rtlRender(
            <SpaceOpenStatusChip
                space={{ space_outages: [], space_opening_hours_id: 77 }}
                weeklyHours={buildWeeklyHoursForDay('Friday', new Date(2026, 3, 24), '09:00:00', '17:00:00')}
                weeklyHoursLoading={false}
                weeklyHoursError={false}
            />,
        );

        expect(screen.getByTestId('spaces-journey-open-status-chip-open')).toHaveTextContent('Open now');
    });

    it('renders closed when the current opening period has already ended', () => {
        jest.useFakeTimers().setSystemTime(new Date(2026, 3, 24, 18, 0, 0, 0).getTime());

        rtlRender(
            <SpaceOpenStatusChip
                space={{ space_outages: [], space_opening_hours_id: 77 }}
                weeklyHours={buildWeeklyHoursForDay('Friday', new Date(2026, 3, 24), '09:00:00', '17:00:00')}
                weeklyHoursLoading={false}
                weeklyHoursError={false}
            />,
        );

        expect(screen.getByTestId('spaces-journey-open-status-chip-closed')).toHaveTextContent('Currently closed');
    });

    it('covers the closing-soon status branch and reports the current warning behavior', () => {
        jest.useFakeTimers().setSystemTime(new Date(2026, 3, 24, 16, 30, 0, 0).getTime());
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { container } = rtlRender(
            <SpaceOpenStatusChip
                space={{ space_outages: [], space_opening_hours_id: 77 }}
                weeklyHours={buildWeeklyHoursForDay('Friday', new Date(2026, 3, 24), '15:30:00', '17:00:00')}
                weeklyHoursLoading={false}
                weeklyHoursError={false}
            />,
        );

        expect(container).toBeEmptyDOMElement();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Functions are not valid as a React child'),
            expect.anything(),
        );
        consoleErrorSpy.mockRestore();
    });
});
