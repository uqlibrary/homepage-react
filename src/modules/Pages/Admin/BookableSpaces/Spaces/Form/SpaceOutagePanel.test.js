import React from 'react';
import moment from 'moment';
import { fireEvent, waitFor } from '@testing-library/react';

import { rtlRender, screen } from 'test-utils';

import SpaceOutagePanel from './SpaceOutagePanel';

describe('SpaceOutagePanel', () => {
    const getFutureDateTime = (hour, dayOffset = 365, minute = 0) =>
        moment()
            .add(dayOffset, 'days')
            .hours(hour)
            .minutes(minute)
            .seconds(0)
            .format('YYYY-MM-DDTHH:mm');

    const defaultProps = {
        actions: {
            loadBookableSpaceOutages: jest.fn(),
            createBookableSpaceOutage: jest.fn(),
            createBookableBulkOutage: jest.fn(),
            updateBookableSpaceOutage: jest.fn(),
            deleteBookableSpaceOutage: jest.fn(),
        },
        mode: 'edit',
        spaceId: 123,
        spaceName: 'Audit Test Space',
        spaceOutageListLoading: false,
        spaceOutageListError: null,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        window.confirm = jest.fn(() => true);
    });

    it('shows the add-mode notice when the panel is used before a space record exists', () => {
        rtlRender(<SpaceOutagePanel {...defaultProps} mode="add" spaceId={null} spaceOutageList={[]} />);

        expect(screen.getByTestId('space-outage-add-mode-notice')).toBeInTheDocument();
        expect(screen.getByText(/Save this space first/i)).toBeInTheDocument();
    });

    it('locks past outages from edit and delete actions', () => {
        const pastStart = moment().subtract(2, 'years').format('YYYY-MM-DD HH:mm:ss');
        const futureStart = moment().add(1, 'year').format('YYYY-MM-DD HH:mm:ss');

        rtlRender(
            <SpaceOutagePanel
                {...defaultProps}
                spaceOutageList={[
                    {
                        space_outage_id: 1,
                        space_outage_start: pastStart,
                        space_outage_end: moment(pastStart, 'YYYY-MM-DD HH:mm:ss').add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                        space_outage_reason: 'Past outage',
                    },
                    {
                        space_outage_id: 2,
                        space_outage_start: futureStart,
                        space_outage_end: moment(futureStart, 'YYYY-MM-DD HH:mm:ss').add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                        space_outage_reason: 'Upcoming outage',
                    },
                ]}
            />,
        );

        expect(screen.getByTestId('space-outage-scheduled-heading')).toHaveTextContent('Current and upcoming closures');
        expect(screen.getByTestId('space-outage-past-heading')).toHaveTextContent('Past closures');

        expect(screen.getByTestId('space-outage-edit-1')).toBeDisabled();
        expect(screen.getByTestId('space-outage-delete-1')).toBeDisabled();

        expect(screen.getByTestId('space-outage-edit-2')).not.toBeDisabled();
        expect(screen.getByTestId('space-outage-delete-2')).not.toBeDisabled();
    });

    it('defaults the end to 11:59pm on the same day when the start is set and no end is already set', () => {
        const futureStart = getFutureDateTime(8);
        const expectedEnd = `${futureStart.slice(0, 10)}T23:59`;

        rtlRender(<SpaceOutagePanel {...defaultProps} spaceOutageList={[]} />);

        fireEvent.change(screen.getByTestId('space-outage-start'), { target: { value: futureStart } });

        expect(screen.getByTestId('space-outage-end')).toHaveValue(expectedEnd);
    });

    it('saves space_outage_show_time_public from the admin checkbox', async () => {
        const props = {
            ...defaultProps,
            spaceOutageList: [],
        };
        props.actions.createBookableSpaceOutage.mockResolvedValue({ status: 'OK' });
        props.actions.loadBookableSpaceOutages.mockResolvedValue({ status: 'OK' });

        rtlRender(<SpaceOutagePanel {...props} />);

        fireEvent.change(screen.getByTestId('space-outage-start'), { target: { value: '2026-04-24T08:00' } });
        fireEvent.change(screen.getByTestId('space-outage-end'), { target: { value: '2026-04-24T14:00' } });
        fireEvent.change(screen.getByTestId('space-outage-reason'), { target: { value: 'Replacing carpet' } });
        fireEvent.click(screen.getByTestId('space-outage-show-time-public'));
        fireEvent.click(screen.getByTestId('space-outage-save-button'));

        await waitFor(() => {
            expect(props.actions.createBookableSpaceOutage).toHaveBeenCalledWith(
                expect.objectContaining({
                    space_outage_show_time_public: false,
                }),
            );
        });
    });

    it('validates the draft and stops a save when the closure dates are invalid', async () => {
        const props = {
            ...defaultProps,
            spaceOutageList: [],
        };
        const futureStart = getFutureDateTime(18);
        const earlierEnd = getFutureDateTime(12);

        rtlRender(<SpaceOutagePanel {...props} />);

        fireEvent.change(screen.getByTestId('space-outage-start'), { target: { value: futureStart } });
        fireEvent.change(screen.getByTestId('space-outage-end'), { target: { value: earlierEnd } });
        fireEvent.change(screen.getByTestId('space-outage-reason'), { target: { value: 'Repair work' } });
        fireEvent.click(screen.getByTestId('space-outage-save-button'));

        await waitFor(() => {
            expect(props.actions.createBookableSpaceOutage).not.toHaveBeenCalled();
        });
    });

    it('creates a bulk outage for the selected floor scope', async () => {
        const props = {
            ...defaultProps,
            floorId: 77,
            libraryId: null,
            campusId: null,
            spaceOutageList: [],
        };
        const bulkStart = getFutureDateTime(9);
        const bulkEnd = getFutureDateTime(17);
        props.actions.createBookableBulkOutage.mockResolvedValue({ status: 'OK' });
        props.actions.loadBookableSpaceOutages.mockResolvedValue({ status: 'OK' });

        rtlRender(<SpaceOutagePanel {...props} />);

        fireEvent.click(screen.getByTestId('space-outage-scope-floor'));
        fireEvent.change(screen.getByTestId('space-outage-start'), { target: { value: bulkStart } });
        fireEvent.change(screen.getByTestId('space-outage-end'), { target: { value: bulkEnd } });
        fireEvent.change(screen.getByTestId('space-outage-reason'), { target: { value: 'Floor maintenance' } });
        fireEvent.click(screen.getByTestId('space-outage-save-button'));

        await waitFor(() => {
            expect(props.actions.createBookableBulkOutage).toHaveBeenCalledWith(
                expect.objectContaining({
                    space_outage_start: `${bulkStart.slice(0, 10)} 09:00:00`,
                    space_outage_end: `${bulkEnd.slice(0, 10)} 17:00:00`,
                    space_outage_reason: 'Floor maintenance',
                }),
                'floor',
                77,
            );
        });
    });

    it('updates an existing outage when the user edits it', async () => {
        const startDate = moment().add(200, 'days').hours(9).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
        const endDate = moment().add(200, 'days').hours(12).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
        const props = {
            ...defaultProps,
            spaceOutageList: [
                {
                    space_outage_id: 12,
                    space_outage_start: startDate,
                    space_outage_end: endDate,
                    space_outage_reason: 'Original reason',
                    space_outage_show_time_public: true,
                },
            ],
        };
        props.actions.updateBookableSpaceOutage.mockResolvedValue({ status: 'OK' });
        props.actions.loadBookableSpaceOutages.mockResolvedValue({ status: 'OK' });

        rtlRender(<SpaceOutagePanel {...props} />);

        fireEvent.click(screen.getByTestId('space-outage-edit-12'));
        fireEvent.change(screen.getByTestId('space-outage-reason'), { target: { value: 'Updated reason' } });
        fireEvent.click(screen.getByTestId('space-outage-save-button'));

        await waitFor(() => {
            expect(props.actions.updateBookableSpaceOutage).toHaveBeenCalledWith(
                expect.objectContaining({
                    space_id: 123,
                    space_outage_reason: 'Updated reason',
                }),
                12,
            );
        });
    });

    it('prevents deleting a past outage and confirms deletions for active ones', async () => {
        const pastStart = moment().subtract(2, 'years').format('YYYY-MM-DD HH:mm:ss');
        const futureStart = moment().add(1, 'year').format('YYYY-MM-DD HH:mm:ss');
        const props = {
            ...defaultProps,
            spaceOutageList: [
                {
                    space_outage_id: 2,
                    space_outage_start: pastStart,
                    space_outage_end: moment(pastStart, 'YYYY-MM-DD HH:mm:ss').add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                    space_outage_reason: 'Past outage',
                },
                {
                    space_outage_id: 3,
                    space_outage_start: futureStart,
                    space_outage_end: moment(futureStart, 'YYYY-MM-DD HH:mm:ss').add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                    space_outage_reason: 'Future outage',
                },
            ],
        };
        props.actions.deleteBookableSpaceOutage.mockResolvedValue({ status: 'OK' });
        props.actions.loadBookableSpaceOutages.mockResolvedValue({ status: 'OK' });
        window.confirm = jest.fn(() => true);

        rtlRender(<SpaceOutagePanel {...props} />);

        fireEvent.click(screen.getByTestId('space-outage-delete-2'));
        expect(window.confirm).not.toHaveBeenCalled();

        fireEvent.click(screen.getByTestId('space-outage-delete-3'));

        await waitFor(() => {
            expect(props.actions.deleteBookableSpaceOutage).toHaveBeenCalledWith(3);
        });
    });
});
