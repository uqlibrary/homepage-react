import React from 'react';
import { rtlRender, screen, fireEvent, waitFor, WithRouter } from '../../../../../../utils/test-utils';
import DLOBulkSchedule from './DLOBulkSchedule';

const baseDlorList = [
    { object_public_uuid: 'obj-1', object_title: 'Alpha object' },
    { object_public_uuid: 'obj-2', object_title: 'Beta object' },
    { object_public_uuid: 'obj-3', object_title: 'Gamma object' },
];

const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const scheduleRecord = ({
    id,
    name,
    running = false,
    processed = false,
    startDate = futureDate,
    endDate = futureDate,
    objects = ['obj-1'],
}) => ({
    schedule_id: id,
    schedule_name: name,
    schedule_running: running,
    schedule_processed: processed,
    schedule_start_date: startDate,
    schedule_end_date: endDate,
    schedule_objects: objects,
    schedule_status: true,
});

describe('DLOBulkSchedule', () => {
    beforeEach(() => {
        window.confirm = jest.fn(() => true);
        window.alert = jest.fn();
    });

    it('loads data when props are empty and renders the page structure', async () => {
        const actions = {
            loadCurrentDLORs: jest.fn(),
            loadDLORSchedules: jest.fn(),
            deleteDlorSchedule: jest.fn(),
            addDLORSchedule: jest.fn(),
            editDLORSchedule: jest.fn(),
        };

        rtlRender(
            <WithRouter>
                <DLOBulkSchedule
                    actions={actions}
                    dlorList={undefined}
                    dlorListLoading={false}
                    dlorListError={null}
                    dlorSchedule={undefined}
                    dlorScheduleLoading={false}
                    dlorScheduleError={null}
                />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(actions.loadCurrentDLORs).toHaveBeenCalledTimes(1);
            expect(actions.loadDLORSchedules).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText('Digital Learning Hub - Bulk Scheduling Management')).toBeInTheDocument();
        expect(screen.getByText('Create New Bulk Schedule')).toBeInTheDocument();
        expect(screen.getByTestId('schedule_name')).toBeInTheDocument();
    });

    it('shows existing schedules and can open a running schedule in view-only mode', async () => {
        const actions = {
            loadCurrentDLORs: jest.fn(),
            loadDLORSchedules: jest.fn(),
            deleteDlorSchedule: jest.fn(),
            addDLORSchedule: jest.fn(),
            editDLORSchedule: jest.fn(),
        };

        rtlRender(
            <WithRouter>
                <DLOBulkSchedule
                    actions={actions}
                    dlorList={baseDlorList}
                    dlorListLoading={false}
                    dlorListError={null}
                    dlorSchedule={[
                        scheduleRecord({
                            id: 'running-1',
                            name: 'Running schedule',
                            running: true,
                            startDate: futureDate,
                            endDate: futureDate,
                            objects: ['obj-1'],
                        }),
                        scheduleRecord({
                            id: 'pending-1',
                            name: 'Pending schedule',
                            running: false,
                            processed: false,
                            startDate: futureDate,
                            endDate: futureDate,
                            objects: ['obj-2'],
                        }),
                        scheduleRecord({
                            id: 'done-1',
                            name: 'Completed schedule',
                            running: false,
                            processed: true,
                            startDate: pastDate,
                            endDate: pastDate,
                            objects: ['obj-3'],
                        }),
                    ]}
                    dlorScheduleLoading={false}
                    dlorScheduleError={null}
                />
            </WithRouter>,
        );

        expect(screen.getByText('Running Schedules')).toBeInTheDocument();
        expect(screen.getByText('Pending Schedules')).toBeInTheDocument();
        expect(screen.getByText('Completed Schedules')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('running-schedule-edit-button-0'));

        expect(screen.getByText('Currently selected items for this schedule — 1 item')).toBeInTheDocument();
        expect(screen.getByText('Alpha object')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('schedule-close-button'));
        expect(screen.queryByText('Currently selected items for this schedule — 1 item')).not.toBeInTheDocument();
    });

    it('adds, removes, and saves selected items while preventing duplicate entries', async () => {
        const actions = {
            loadCurrentDLORs: jest.fn(),
            loadDLORSchedules: jest.fn(),
            deleteDlorSchedule: jest.fn(),
            addDLORSchedule: jest.fn().mockResolvedValue({}),
            editDLORSchedule: jest.fn(),
        };

        rtlRender(
            <WithRouter>
                <DLOBulkSchedule
                    actions={actions}
                    dlorList={baseDlorList}
                    dlorListLoading={false}
                    dlorListError={null}
                    dlorSchedule={[]}
                    dlorScheduleLoading={false}
                    dlorScheduleError={null}
                />
            </WithRouter>,
        );

        fireEvent.change(screen.getByTestId('schedule_name'), { target: { value: 'Test schedule' } });
        const startDateInput = screen.getByTestId('schedule-start-date').querySelector('input');
        const endDateInput = screen.getByTestId('schedule-end-date').querySelector('input');
        fireEvent.change(startDateInput, { target: { value: '01/01/2025' } });
        fireEvent.change(endDateInput, { target: { value: '10/01/2025' } });

        fireEvent.click(screen.getByTestId('schedule-add-items'));

        expect(screen.getByTestId('notify-lightbox-modal')).toBeInTheDocument();

        fireEvent.change(screen.getByTestId('dlor-search-input'), { target: { value: 'Beta' } });
        fireEvent.click(screen.getByTestId('add-schedule-item-0'));

        expect(screen.getByText('Beta object')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('remove-selected-item-0'));
        fireEvent.click(screen.getByTestId('add-schedule-item-0'));
        fireEvent.click(screen.getByTestId('schedule-confirm-items'));

        await waitFor(() => {
            expect(actions.addDLORSchedule).toHaveBeenCalledTimes(1);
        });

        expect(actions.addDLORSchedule).toHaveBeenCalledWith(
            expect.objectContaining({
                schedule_name: 'Test schedule',
                items: ['obj-2'],
            }),
        );
        expect(screen.getByText('Schedule saved successfully')).toBeInTheDocument();
    });

    it('deletes a schedule after confirmation and shows a delete error when rejected', async () => {
        const actions = {
            loadCurrentDLORs: jest.fn(),
            loadDLORSchedules: jest.fn(),
            deleteDlorSchedule: jest.fn().mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('Delete failed')),
            addDLORSchedule: jest.fn(),
            editDLORSchedule: jest.fn(),
        };

        rtlRender(
            <WithRouter>
                <DLOBulkSchedule
                    actions={actions}
                    dlorList={baseDlorList}
                    dlorListLoading={false}
                    dlorListError={null}
                    dlorSchedule={[
                        scheduleRecord({
                            id: 'pending-2',
                            name: 'Delete me',
                            running: false,
                            processed: false,
                            startDate: futureDate,
                            endDate: futureDate,
                            objects: ['obj-1'],
                        }),
                    ]}
                    dlorScheduleLoading={false}
                    dlorScheduleError={null}
                />
            </WithRouter>,
        );

        fireEvent.click(screen.getByTestId('pending-schedule-delete-button-0'));

        await waitFor(() => {
            expect(actions.deleteDlorSchedule).toHaveBeenCalledWith('pending-2');
            expect(screen.getByText('Schedule deleted successfully')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('pending-schedule-delete-button-0'));

        await waitFor(() => {
            expect(screen.getByText('Delete failed')).toBeInTheDocument();
        });
    });
});
