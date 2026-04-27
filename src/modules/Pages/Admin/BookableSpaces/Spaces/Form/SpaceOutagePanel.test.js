import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';

import { rtlRender, screen } from 'test-utils';

import SpaceOutagePanel from './SpaceOutagePanel';

describe('SpaceOutagePanel', () => {
    const defaultProps = {
        actions: {
            loadBookableSpaceOutages: jest.fn(),
            createBookableSpaceOutage: jest.fn(),
            updateBookableSpaceOutage: jest.fn(),
            deleteBookableSpaceOutage: jest.fn(),
        },
        mode: 'edit',
        spaceId: 123,
        spaceName: 'Audit Test Space',
        spaceOutageListLoading: false,
        spaceOutageListError: null,
    };

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
});
