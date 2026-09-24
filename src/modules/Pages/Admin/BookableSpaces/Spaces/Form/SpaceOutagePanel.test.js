import React from 'react';
import moment from 'moment';
import { fireEvent, waitFor } from '@testing-library/react';

import * as adminHelpers from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';
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
        jest.restoreAllMocks();
        jest.clearAllMocks();
        window.confirm = jest.fn(() => true);
        jest.spyOn(adminHelpers, 'displayToastMessage').mockImplementation(() => {});
        jest.spyOn(adminHelpers, 'displayToastErrorMessage').mockImplementation(() => {});
    });

    it('shows the add-mode notice when the panel is used before a space record exists', () => {
        rtlRender(<SpaceOutagePanel {...defaultProps} mode="add" spaceId={null} spaceOutageList={[]} />);

        expect(screen.getByTestId('space-outage-add-mode-notice')).toBeInTheDocument();
        expect(screen.getByText(/Save this space first/i)).toBeInTheDocument();
    });

    it('shows the loading, error, and empty states for outage lists', () => {
        const { rerender } = rtlRender(
            <SpaceOutagePanel {...defaultProps} spaceOutageList={[]} spaceOutageListLoading={true} />, 
        );

        expect(screen.getByText('Loading closures')).toBeInTheDocument();

        rerender(
            <SpaceOutagePanel
                {...defaultProps}
                spaceOutageList={[]}
                spaceOutageListLoading={false}
                spaceOutageListError={new Error('Failed to load closures')}
            />,
        );
        expect(screen.getByText('Unable to load space closures right now. Please try again later.')).toBeInTheDocument();

        rerender(
            <SpaceOutagePanel {...defaultProps} spaceOutageList={[]} spaceOutageListLoading={false} spaceOutageListError={null} />,
        );
        expect(screen.getByText('No closures have been recorded for this space.')).toBeInTheDocument();
    });

    it('shows a warning when the new draft overlaps an existing closure window', () => {
        const existingStart = moment().add(10, 'days').hours(9).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
        const existingEnd = moment().add(10, 'days').hours(13).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');

        rtlRender(
            <SpaceOutagePanel
                {...defaultProps}
                spaceOutageList={[
                    {
                        space_outage_id: 7,
                        space_outage_start: existingStart,
                        space_outage_end: existingEnd,
                        space_outage_reason: 'Existing closure',
                    },
                ]}
            />,
        );

        fireEvent.change(screen.getByTestId('space-outage-start'), {
            target: { value: moment().add(10, 'days').hours(10).minutes(0).format('YYYY-MM-DDTHH:mm') },
        });
        fireEvent.change(screen.getByTestId('space-outage-end'), {
            target: { value: moment().add(10, 'days').hours(12).minutes(0).format('YYYY-MM-DDTHH:mm') },
        });
        fireEvent.change(screen.getByTestId('space-outage-reason'), { target: { value: 'Planned upgrade' } });

        expect(screen.getByTestId('space-outage-warning')).toBeInTheDocument();
        expect(screen.getByText('This closure overlaps another closure window already recorded for this space.')).toBeInTheDocument();
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

    it('does not auto-fill the end date when the start is set and no end is already set', () => {
        const futureStart = getFutureDateTime(8);

        rtlRender(<SpaceOutagePanel {...defaultProps} spaceOutageList={[]} />);

        fireEvent.change(screen.getByTestId('space-outage-start'), { target: { value: futureStart } });

        expect(screen.getByTestId('space-outage-end')).toHaveValue('');
    });

    it('shows the invalid-date warning immediately when the start is after the end', () => {
        rtlRender(<SpaceOutagePanel {...defaultProps} spaceOutageList={[]} />);

        fireEvent.change(screen.getByTestId('space-outage-start'), { target: { value: '2026-04-24T18:00' } });
        fireEvent.change(screen.getByTestId('space-outage-end'), { target: { value: '2026-04-24T12:00' } });

        expect(screen.getByText('The end date and time must be after the start.')).toBeInTheDocument();
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

    it('shows an error toast when the save API responds with an unsuccessful status', async () => {
        const props = {
            ...defaultProps,
            spaceOutageList: [],
        };
        props.actions.createBookableSpaceOutage.mockResolvedValue({ status: 'ERROR', message: 'Save failed' });

        rtlRender(<SpaceOutagePanel {...props} />);

        fireEvent.change(screen.getByTestId('space-outage-start'), { target: { value: '2026-04-24T08:00' } });
        fireEvent.change(screen.getByTestId('space-outage-end'), { target: { value: '2026-04-24T14:00' } });
        fireEvent.change(screen.getByTestId('space-outage-reason'), { target: { value: 'Repair work' } });
        fireEvent.click(screen.getByTestId('space-outage-save-button'));

        await waitFor(() => {
            expect(adminHelpers.displayToastErrorMessage).toHaveBeenCalledWith(expect.stringContaining('Save failed'));
        });
    });

    it('shows an error toast when the save call throws', async () => {
        const props = {
            ...defaultProps,
            spaceOutageList: [],
        };
        props.actions.createBookableSpaceOutage.mockRejectedValue(new Error('Save threw an error'));

        rtlRender(<SpaceOutagePanel {...props} />);

        fireEvent.change(screen.getByTestId('space-outage-start'), { target: { value: '2026-04-24T08:00' } });
        fireEvent.change(screen.getByTestId('space-outage-end'), { target: { value: '2026-04-24T14:00' } });
        fireEvent.change(screen.getByTestId('space-outage-reason'), { target: { value: 'Repair work' } });
        fireEvent.click(screen.getByTestId('space-outage-save-button'));

        await waitFor(() => {
            expect(adminHelpers.displayToastErrorMessage).toHaveBeenCalledWith('Save threw an error');
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

    it('stops the delete when the user cancels confirmation', async () => {
        const futureStart = moment().add(1, 'year').format('YYYY-MM-DD HH:mm:ss');
        const props = {
            ...defaultProps,
            spaceOutageList: [
                {
                    space_outage_id: 3,
                    space_outage_start: futureStart,
                    space_outage_end: moment(futureStart, 'YYYY-MM-DD HH:mm:ss').add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                    space_outage_reason: 'Future outage',
                },
            ],
        };
        window.confirm = jest.fn(() => false);

        rtlRender(<SpaceOutagePanel {...props} />);

        fireEvent.click(screen.getByTestId('space-outage-delete-3'));

        await waitFor(() => {
            expect(props.actions.deleteBookableSpaceOutage).not.toHaveBeenCalled();
        });
    });

    it('shows an error toast when the delete API responds with an unsuccessful status', async () => {
        const futureStart = moment().add(1, 'year').format('YYYY-MM-DD HH:mm:ss');
        const props = {
            ...defaultProps,
            spaceOutageList: [
                {
                    space_outage_id: 4,
                    space_outage_start: futureStart,
                    space_outage_end: moment(futureStart, 'YYYY-MM-DD HH:mm:ss').add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                    space_outage_reason: 'Future outage',
                },
            ],
        };
        props.actions.deleteBookableSpaceOutage.mockResolvedValue({ status: 'ERROR', message: 'Delete failed' });

        rtlRender(<SpaceOutagePanel {...props} />);

        fireEvent.click(screen.getByTestId('space-outage-delete-4'));

        await waitFor(() => {
            expect(adminHelpers.displayToastErrorMessage).toHaveBeenCalledWith(expect.stringContaining('Delete failed'));
        });
    });

    it('clears the edit state when the currently edited outage is deleted', async () => {
        const futureStart = moment().add(1, 'year').format('YYYY-MM-DD HH:mm:ss');
        const props = {
            ...defaultProps,
            spaceOutageList: [
                {
                    space_outage_id: 5,
                    space_outage_start: futureStart,
                    space_outage_end: moment(futureStart, 'YYYY-MM-DD HH:mm:ss').add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                    space_outage_reason: 'Future outage',
                },
            ],
        };
        props.actions.deleteBookableSpaceOutage.mockResolvedValue({ status: 'OK' });
        props.actions.loadBookableSpaceOutages.mockResolvedValue({ status: 'OK' });

        rtlRender(<SpaceOutagePanel {...props} />);

        fireEvent.click(screen.getByTestId('space-outage-edit-5'));
        expect(screen.getByTestId('space-outage-cancel-button')).toHaveTextContent('Cancel edit');

        fireEvent.click(screen.getByTestId('space-outage-delete-5'));

        await waitFor(() => {
            expect(screen.getByTestId('space-outage-cancel-button')).toHaveTextContent('Clear');
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
