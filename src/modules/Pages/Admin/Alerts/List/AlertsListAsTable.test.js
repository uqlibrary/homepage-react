import React from 'react';
import { rtlRender, userEvent, waitFor } from 'test-utils';
import AlertsListAsTable, {
    clearAllCheckboxes,
    confirmDeleteLocale,
    getNumberCheckboxesSelected,
    getUserRows,
    reEnableAllCheckboxes,
} from './AlertsListAsTable';
import { default as locale } from '../alertsadmin.locale';

jest.mock('../alerthelpers', () => {
    const actual = jest.requireActual('../alerthelpers');
    return {
        ...actual,
        systemList: [...actual.systemList, { slug: 'retired', title: 'Retired system', removed: true }],
    };
});

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

window.scrollTo = jest.fn();

function setup(testProps = {}, wrapInAlertList = false) {
    const props = {
        rows: [],
        headertag: 'Current alerts',
        alertsLoading: false,
        history: {},
        actions: {},
        deleteAlert: jest.fn(),
    };
    const table = <AlertsListAsTable {...props} {...testProps} />;
    return rtlRender(wrapInAlertList ? <div id="admin-alerts-list">{table}</div> : table);
}

const createAlert = (overrides = {}) => ({
    id: '1',
    title: 'Example alert',
    message: 'An alert message',
    body: 'An alert message',
    start: '2025-01-01 09:00:00',
    end: '2025-01-02 10:00:00',
    startDateDisplay: 'Wed 1 Jan 9am',
    endDateDisplay: 'Thu 2 Jan 10am',
    startDateLong: 'Wednesday 1 January 2025 9.00am',
    endDateLong: 'Thursday 2 January 2025 10.00am',
    priority_type: 'info',
    systems_shown: [],
    systems_hidden: [],
    ...overrides,
});

describe('AlertsListAsTable', () => {
    afterEach(() => {
        mockNavigate.mockReset();
    });

    it('default values render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('shows a loading indicator while alerts are loading', () => {
        const { getByText, queryByTestId } = setup({ alertsLoading: true });

        expect(getByText('Loading')).toBeInTheDocument();
        expect(queryByTestId('alert-list-current')).not.toBeInTheDocument();
    });

    it('renders the empty state and singular/plural alert counts', () => {
        const { getByTestId, getByText, rerender } = setup();

        expect(getByTestId('headerRow-count-current')).toHaveTextContent('0 alert');
        expect(getByText('No alerts')).toBeInTheDocument();

        rerender(
            <AlertsListAsTable
                rows={[createAlert()]}
                headertag="Current alerts"
                alertsLoading={false}
                actions={{}}
                deleteAlert={jest.fn()}
            />,
        );
        expect(getByTestId('headerRow-count-current')).toHaveTextContent('1 alert');
    });

    it('renders alert details and applicable chips', () => {
        const { getByTestId, getByText } = setup({
            rows: [
                createAlert({
                    message: 'Notice [permanent]',
                    body: 'Notice [permanent][Read more](https://example.com)',
                    priority_type: 'urgent',
                    systems_shown: ['homepage'],
                }),
            ],
        });

        expect(getByText('Example alert')).toBeInTheDocument();
        expect(getByText('Notice')).toBeInTheDocument();
        expect(getByTestId('alert-list-urgent-chip-1')).toHaveTextContent('Urgent');
        expect(getByTestId('alert-list-link-chip-1')).toHaveTextContent('Link');
        expect(getByTestId('alert-list-permanent-chip-1')).toHaveTextContent('Permanent');
        expect(getByTestId('alert-list-system-chip-shown-1-homepage')).toHaveTextContent('Only shows on: Home page');
    });

    it('renders the extreme priority chip for extreme alerts', () => {
        const { getByTestId } = setup({
            rows: [createAlert({ priority_type: 'extreme' })],
        });

        expect(getByTestId('alert-list-urgent-chip-1')).toHaveTextContent('Extreme');
    });

    it('renders fallback and removed system chip details', () => {
        const { getByTestId } = setup({
            rows: [
                createAlert({ id: 'alert1', systems_shown: ['not-in-system-list'] }),
                createAlert({ id: 'alert2', systems_hidden: ['retired'] }),
            ],
        });

        const unknownSystemChip = getByTestId('alert-list-system-chip-shown-alert1-0');
        expect(unknownSystemChip).toHaveTextContent('Only shows on: Unrecognised');
        expect(unknownSystemChip).toHaveAttribute('title', 'This alert is restricted to the Unrecognised system');

        const retiredSystemChip = getByTestId('alert-list-system-chip-hidden-alert2-retired');
        expect(retiredSystemChip).toHaveTextContent('Hidden from: Retired system');
        expect(retiredSystemChip).toHaveAttribute('title', 'This alert is hidden from the Retired system system');
        expect(retiredSystemChip).toHaveClass('removedChip');
    });

    it('sorts alert rows by start date when requested', () => {
        const { container } = setup({
            rows: [
                createAlert({ id: 'later', start: '2025-01-02 09:00:00' }),
                createAlert({ id: 'earlier', start: '2025-01-01 09:00:00' }),
            ],
            alertOrder: 'forwardStart',
        });

        const rowIds = Array.from(container.querySelectorAll('tr.alert-data-row')).map(row => row.id);

        expect(rowIds).toEqual(['alert-list-row-earlier', 'alert-list-row-later']);
    });

    it('supports end-date sorting in both directions and preserves order for unknown modes', () => {
        const cases = [
            { alertOrder: 'forwardEnd', expectedIds: ['early', 'middle', 'late'] },
            { alertOrder: 'reverseEnd', expectedIds: ['late', 'middle', 'early'] },
            { alertOrder: 'unknown', expectedIds: ['middle', 'early', 'late'] },
        ];

        cases.forEach(({ alertOrder, expectedIds }) => {
            const { container, unmount } = setup({
                rows: [
                    createAlert({ id: 'middle', end: '2025-01-02 09:00:00' }),
                    createAlert({ id: 'early', end: '2025-01-01 09:00:00' }),
                    createAlert({ id: 'late', end: '2025-01-03 09:00:00' }),
                ],
                alertOrder,
            });
            const rowIds = Array.from(container.querySelectorAll('tr.alert-data-row')).map(row =>
                row.id.replace('alert-list-row-', ''),
            );

            expect(rowIds).toEqual(expectedIds);
            unmount();
        });
    });

    describe('pagination', () => {
        it('changes the displayed rows and range text when navigating between pages', async () => {
            const rows = Array.from({ length: 16 }, (_, index) =>
                createAlert({ id: `alert-${index + 1}`, title: `Alert ${index + 1}` }),
            );
            const { getByRole, getByTestId, getByText, queryByTestId } = setup({ rows });

            expect(getByTestId('alert-list-row-alert-1')).toBeInTheDocument();
            expect(queryByTestId('alert-list-row-alert-6')).not.toBeInTheDocument();
            expect(getByText('1–5 of 16')).toBeInTheDocument();

            await userEvent.click(getByRole('button', { name: 'next page' }));
            expect(getByTestId('alert-list-row-alert-6')).toBeInTheDocument();
            expect(queryByTestId('alert-list-row-alert-1')).not.toBeInTheDocument();
            expect(getByText('6–10 of 16')).toBeInTheDocument();

            await userEvent.click(getByRole('button', { name: 'next page' }));
            expect(getByTestId('alert-list-row-alert-11')).toBeInTheDocument();
            expect(queryByTestId('alert-list-row-alert-6')).not.toBeInTheDocument();
            expect(getByText('11–15 of 16')).toBeInTheDocument();

            await userEvent.click(getByRole('button', { name: 'previous page' }));
            expect(getByTestId('alert-list-row-alert-6')).toBeInTheDocument();
            expect(queryByTestId('alert-list-row-alert-11')).not.toBeInTheDocument();
            expect(getByText('6–10 of 16')).toBeInTheDocument();

            await userEvent.click(getByRole('button', { name: 'last page' }));
            expect(getByTestId('alert-list-row-alert-16')).toBeInTheDocument();
            expect(queryByTestId('alert-list-row-alert-6')).not.toBeInTheDocument();
            expect(getByText('16–16 of 16')).toBeInTheDocument();

            await userEvent.click(getByRole('button', { name: 'first page' }));
            expect(getByTestId('alert-list-row-alert-1')).toBeInTheDocument();
            expect(queryByTestId('alert-list-row-alert-16')).not.toBeInTheDocument();
            expect(getByText('1–5 of 16')).toBeInTheDocument();
        });

        it('shows the full result range when page size is changed to All', async () => {
            const rows = Array.from({ length: 16 }, (_, index) =>
                createAlert({ id: `alert-${index + 1}`, title: `Alert ${index + 1}` }),
            );
            const { getByRole, getByTestId, getByText } = setup({ rows });

            const pageSizeSelect = getByTestId('admin-alerts-list-paginator-select');
            await userEvent.selectOptions(pageSizeSelect, getByRole('option', { name: 'All' }));

            expect(getByTestId('alert-list-row-alert-16')).toBeInTheDocument();
            expect(getByText('1–16 of 16')).toBeInTheDocument();
        });
    });

    it('shows and hides bulk action buttons when alert selection changes', async () => {
        const { getByRole, getByTestId, getByText, queryByRole } = setup({ rows: [createAlert()] }, true);
        const header = getByTestId('headerRow-current');

        await userEvent.click(getByTestId('alert-list-item-checkbox-1'));

        expect(getByText('1 alert selected')).toBeInTheDocument();
        expect(header).toHaveClass('headerRowHighlighted');
        expect(getByTestId('alert-list-current-delete-button')).toBeInTheDocument();
        expect(getByTestId('alert-list-current-deselect-button')).toBeInTheDocument();

        await userEvent.click(getByTestId('alert-list-current-delete-button'));
        expect(getByText('Remove 1 alert?')).toBeInTheDocument();
        await userEvent.click(getByRole('button', { name: 'Cancel' }));

        await userEvent.click(getByTestId('alert-list-current-deselect-button'));

        expect(queryByRole('button', { name: 'Delete alert(s)' })).not.toBeInTheDocument();
        expect(queryByRole('button', { name: 'Deselect all' })).not.toBeInTheDocument();
        expect(header).not.toHaveClass('headerRowHighlighted');
    });

    it('disables checkboxes in other alert tables until the selection is cleared', async () => {
        const currentTableProps = {
            rows: [createAlert({ id: 'current-1' }), createAlert({ id: 'current-2' })],
            headertag: 'Current alerts',
            alertsLoading: false,
            actions: {},
            deleteAlert: jest.fn(),
        };
        const pastTableProps = {
            rows: [createAlert({ id: 'past-1' })],
            headertag: 'Past alerts',
            alertsLoading: false,
            actions: {},
            deleteAlert: jest.fn(),
        };
        const { getByTestId, getByRole } = rtlRender(
            <div id="admin-alerts-list">
                <AlertsListAsTable {...currentTableProps} />
                <AlertsListAsTable {...pastTableProps} />
            </div>,
        );

        await userEvent.click(getByTestId('alert-list-item-checkbox-current-1'));
        await userEvent.click(getByTestId('alert-list-item-checkbox-current-2'));

        expect(getByTestId('alert-list-item-checkbox-past-1')).toBeDisabled();

        await userEvent.click(getByRole('button', { name: 'Deselect all' }));

        expect(getByTestId('alert-list-item-checkbox-past-1')).not.toBeDisabled();
        expect(getByTestId('alert-list-item-checkbox-current-1')).not.toBeChecked();
        expect(getByTestId('alert-list-item-checkbox-current-2')).not.toBeChecked();
    });

    it('deletes selected alerts and reloads after successful deletion', async () => {
        const deleteAlert = jest.fn().mockResolvedValue({});
        const actions = { loadAllAlerts: jest.fn() };
        const { getByTestId, getByRole, getByText } = setup(
            {
                rows: [createAlert({ id: 'first' }), createAlert({ id: 'second' })],
                deleteAlert,
                actions,
            },
            true,
        );

        await userEvent.click(getByTestId('alert-list-item-checkbox-first'));
        await userEvent.click(getByTestId('alert-list-item-checkbox-second'));
        await userEvent.click(getByRole('button', { name: 'Delete alert(s)' }));

        expect(getByText('Remove 2 alerts?')).toBeInTheDocument();
        await userEvent.click(getByRole('button', { name: 'Proceed' }));

        await waitFor(() => {
            expect(deleteAlert).toHaveBeenCalledTimes(2);
            expect(actions.loadAllAlerts).toHaveBeenCalledTimes(2);
        });
        expect(deleteAlert).toHaveBeenNthCalledWith(1, 'first');
        expect(deleteAlert).toHaveBeenNthCalledWith(2, 'second');
    });

    it('shows an error confirmation when a selected alert cannot be deleted', async () => {
        const deleteAlert = jest.fn().mockRejectedValue(new Error('Delete failed'));
        const { getByTestId, getByRole, findByText } = setup({ rows: [createAlert()], deleteAlert }, true);

        await userEvent.click(getByTestId('alert-list-item-checkbox-1'));
        await userEvent.click(getByRole('button', { name: 'Delete alert(s)' }));
        await userEvent.click(getByRole('button', { name: 'Proceed' }));

        expect(await findByText('Record Deletion was not successful')).toBeInTheDocument();
    });

    describe('navigation', () => {
        it('navigates to the edit form from the main alert action', async () => {
            const { getByTestId } = setup({ rows: [createAlert()] });

            await userEvent.click(getByTestId('alert-list-item-edit-1'));

            expect(mockNavigate).toHaveBeenCalledWith('/admin/alerts/edit/1');
        });

        it('navigates to the clone form from the more-actions menu', async () => {
            const { getByRole, getByTestId } = setup({ rows: [createAlert()] });

            await userEvent.click(getByRole('button', { name: 'More actions' }));
            await userEvent.click(getByTestId('1-clone-button'));

            expect(mockNavigate).toHaveBeenCalledWith('/admin/alerts/clone/1');
        });

        it('uses the view action for past alerts', async () => {
            const { getByTestId } = setup({ rows: [createAlert()], headertag: 'Past alerts' });

            await userEvent.click(getByTestId('alert-list-item-view-1'));

            expect(mockNavigate).toHaveBeenCalledWith('/admin/alerts/view/1');
        });
    });

    describe('helper functions', () => {
        it('reEnableAllCheckboxes', () => {
            const { getAllByRole } = rtlRender(
                <div id="admin-alerts-list">
                    <div className="Mui-disabled">
                        <label>
                            <input type="checkbox" disabled />
                        </label>
                    </div>
                    <div className="Mui-disabled">
                        <label>
                            <input type="checkbox" disabled />
                        </label>
                    </div>
                </div>,
            );

            reEnableAllCheckboxes();

            expect(getAllByRole('checkbox').every(checkbox => !checkbox.disabled)).toBe(true);
            expect(document.querySelectorAll('#admin-alerts-list .Mui-disabled')).toHaveLength(0);
        });

        it('clearAllCheckboxes', () => {
            const { getAllByRole } = rtlRender(
                <div id="admin-alerts-list">
                    <label>
                        <input type="checkbox" defaultChecked />
                    </label>
                    <label>
                        <input type="checkbox" />
                    </label>
                </div>,
            );
            const [checkedBox, uncheckedBox] = getAllByRole('checkbox');

            clearAllCheckboxes();

            expect(checkedBox).not.toBeChecked();
            expect(uncheckedBox).not.toBeChecked();
        });

        it('getNumberCheckboxesSelected', () => {
            const { getAllByRole } = rtlRender(
                <div id="admin-alerts-list">
                    <table>
                        <tbody>
                            <tr className="alert-data-row">
                                <td>
                                    <input type="checkbox" defaultChecked />
                                </td>
                            </tr>
                            <tr className="alert-data-row">
                                <td>
                                    <input type="checkbox" defaultChecked />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="checkbox" defaultChecked />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>,
            );

            expect(getNumberCheckboxesSelected()).toBe(2);
            getAllByRole('checkbox')[0].checked = false;
            expect(getNumberCheckboxesSelected()).toBe(1);
        });

        it('getUserRows', () => {
            const createRows = () => [
                createAlert({ id: 'middle', start: '2025-01-02 09:00:00', end: '2025-01-02 09:00:00' }),
                createAlert({ id: 'early', start: '2025-01-01 09:00:00', end: '2025-01-01 09:00:00' }),
                createAlert({ id: 'late', start: '2025-01-03 09:00:00', end: '2025-01-03 09:00:00' }),
            ];

            expect(getUserRows(createRows(), 'forwardStart', 2)).toEqual({
                userows: expect.arrayContaining([expect.objectContaining({ id: 'early' })]),
                needsPaginator: true,
            });
            expect(getUserRows(createRows(), 'forwardStart', 2).userows.map(row => row.id)).toEqual([
                'early',
                'middle',
                'late',
            ]);
            expect(getUserRows(createRows(), 'forwardEnd', 2).userows.map(row => row.id)).toEqual([
                'early',
                'middle',
                'late',
            ]);
            expect(getUserRows(createRows(), 'reverseEnd', 2).userows.map(row => row.id)).toEqual([
                'late',
                'middle',
                'early',
            ]);
            expect(getUserRows(createRows(), 'unknown', 2).userows.map(row => row.id)).toEqual([
                'middle',
                'early',
                'late',
            ]);
            expect(getUserRows([], 'forwardEnd', 0)).toEqual({ userows: [], needsPaginator: false });
        });

        it('confirmDeleteLocale', () => {
            expect(confirmDeleteLocale(1)).toEqual({
                ...locale.listPage.confirmDelete,
                confirmationTitle: 'Remove 1 alert?',
            });
            expect(confirmDeleteLocale(2)).toEqual({
                ...locale.listPage.confirmDelete,
                confirmationTitle: 'Remove 2 alerts?',
            });
        });
    });
});
