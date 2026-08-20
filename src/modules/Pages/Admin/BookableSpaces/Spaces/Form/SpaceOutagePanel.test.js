import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';

import { rtlRender, screen } from 'test-utils';

import SpaceOutagePanel from './SpaceOutagePanel';

describe('SpaceOutagePanel', () => {
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
        rtlRender(
            <SpaceOutagePanel
                {...defaultProps}
                spaceOutageList={[
                    {
                        space_outage_id: 1,
                        space_outage_start: '2000-01-01 09:00:00',
                        space_outage_end: '2000-01-01 10:00:00',
                        space_outage_reason: 'Past outage',
                    },
                    {
                        space_outage_id: 2,
                        space_outage_start: '2999-01-01 09:00:00',
                        space_outage_end: '2999-01-01 10:00:00',
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

        rtlRender(<SpaceOutagePanel {...props} />);

        fireEvent.change(screen.getByTestId('space-outage-start'), { target: { value: '2026-04-24T18:00' } });
        fireEvent.change(screen.getByTestId('space-outage-end'), { target: { value: '2026-04-24T12:00' } });
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
        props.actions.createBookableBulkOutage.mockResolvedValue({ status: 'OK' });
        props.actions.loadBookableSpaceOutages.mockResolvedValue({ status: 'OK' });

        rtlRender(<SpaceOutagePanel {...props} />);

        fireEvent.click(screen.getByTestId('space-outage-scope-floor'));
        fireEvent.change(screen.getByTestId('space-outage-start'), { target: { value: '2026-05-01T09:00' } });
        fireEvent.change(screen.getByTestId('space-outage-end'), { target: { value: '2026-05-01T17:00' } });
        fireEvent.change(screen.getByTestId('space-outage-reason'), { target: { value: 'Floor maintenance' } });
        fireEvent.click(screen.getByTestId('space-outage-save-button'));

        await waitFor(() => {
            expect(props.actions.createBookableBulkOutage).toHaveBeenCalledWith(
                expect.objectContaining({
                    space_outage_start: '2026-05-01 09:00:00',
                    space_outage_end: '2026-05-01 17:00:00',
                    space_outage_reason: 'Floor maintenance',
                }),
                'floor',
                77,
            );
        });
    });

    it('updates an existing outage when the user edits it', async () => {
        const props = {
            ...defaultProps,
            spaceOutageList: [
                {
                    space_outage_id: 12,
                    space_outage_start: '2026-06-01 09:00:00',
                    space_outage_end: '2026-06-01 12:00:00',
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
        const props = {
            ...defaultProps,
            spaceOutageList: [
                {
                    space_outage_id: 2,
                    space_outage_start: '2000-01-01 09:00:00',
                    space_outage_end: '2000-01-01 10:00:00',
                    space_outage_reason: 'Past outage',
                },
                {
                    space_outage_id: 3,
                    space_outage_start: '2999-01-01 09:00:00',
                    space_outage_end: '2999-01-01 10:00:00',
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
