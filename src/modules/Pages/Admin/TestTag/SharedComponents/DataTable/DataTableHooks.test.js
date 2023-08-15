import { act, renderHook } from '@testing-library/react-hooks';
import { useDataTableRow, useDataTableColumns } from './DataTableHooks';

describe('DataTableHooks', () => {
    describe('useDataTableRow', () => {
        it('without transformer', () => {
            const data = [{ field: 'test 1A' }, { field: 'test 2A' }, { field: 'test 3A' }];
            const dataUpdate = [{ field: 'test 1A Updated' }];
            const { result, rerender } = renderHook(() => useDataTableRow(data));
            const { row, setRow } = result.current;
            expect(row).toEqual(data);
            act(() => {
                setRow(dataUpdate);
            });
            rerender();
            expect(result.current.row).toEqual(dataUpdate);
        });

        it('with transformer', () => {
            const transformer = data => data.map(item => ({ field: `${item.field} transformed` }));
            const data = [{ field: 'test 1A' }, { field: 'test 2A' }, { field: 'test 3A' }];
            const dataTransformed = [
                { field: 'test 1A transformed' },
                { field: 'test 2A transformed' },
                { field: 'test 3A transformed' },
            ];
            const dataUpdate = [{ field: 'test 1A Updated' }];
            const dataUpdateTransformed = [{ field: 'test 1A Updated transformed' }];
            const { result, rerender } = renderHook(() => useDataTableRow(data, transformer));
            const { row, setRow } = result.current;
            expect(row).toEqual(dataTransformed);
            act(() => {
                setRow(dataUpdate);
            });
            rerender();
            expect(result.current.row).toEqual(dataUpdateTransformed);
        });
    });

    describe('useDataTableColumns', () => {
        it('renders columns', () => {
            const locale = {
                asset_id: { label: 'ID' },
                asset_id_displayed: { label: 'Asset ID' },
                asset_type_name: { label: 'Type' },
                asset_location: { label: 'Location' },
                asset_status: { label: 'Status' },
            };
            const config = {
                fields: {
                    asset_id: {
                        fieldParams: { renderInTable: false },
                    },
                    asset_id_displayed: { fieldParams: { renderInTable: true } },
                    asset_type_name: { fieldParams: { renderInTable: true } },
                    asset_location: { fieldParams: { renderInTable: true } },
                    asset_status: { fieldParams: {} },
                },
            };

            const { result } = renderHook(() => useDataTableColumns({ config, locale }));
            const { columns } = result.current;

            expect(columns.length).toBe(Object.keys(locale).length);

            expect(columns[0]).toEqual(
                expect.objectContaining({ field: 'asset_id_displayed', headerName: 'Asset ID', renderInTable: true }),
            );
            expect(columns[1]).toEqual(
                expect.objectContaining({ field: 'asset_type_name', headerName: 'Type', renderInTable: true }),
            );
            expect(columns[2]).toEqual(
                expect.objectContaining({ field: 'asset_location', headerName: 'Location', renderInTable: true }),
            );
            expect(columns[3]).toEqual(expect.objectContaining({ field: 'asset_status', headerName: 'Status' }));
            expect(columns[4]).toEqual(expect.objectContaining({ field: '', renderCell: expect.anything() }));
        });

        it('renders columns without actions', () => {
            const locale = {
                asset_id: { label: 'ID' },
                asset_id_displayed: { label: 'Asset ID' },
                asset_type_name: { label: 'Type' },
                asset_location: { label: 'Location' },
                asset_status: { label: 'Status' },
            };
            const config = {
                fields: {
                    asset_id: {
                        fieldParams: { renderInTable: false },
                    },
                    asset_id_displayed: { fieldParams: { renderInTable: true } },
                    asset_type_name: { fieldParams: { renderInTable: true } },
                    asset_location: { fieldParams: { renderInTable: true } },
                    asset_status: { fieldParams: {} },
                },
            };

            const { result } = renderHook(() => useDataTableColumns({ config, locale, withActions: false }));
            const { columns } = result.current;

            expect(columns.length).toBe(Object.keys(locale).length - 1); // 4

            expect(columns[3]).not.toEqual(expect.objectContaining({ field: '', renderCell: expect.anything() }));
        });

        it('renders columns (coverage)', () => {
            const locale = {
                asset_id: { label: 'ID' },
                asset_id_displayed: { label: 'Asset ID' },
                asset_type_name: { label: 'Type' },
                asset_location: { label: 'Location' },
                asset_status: { label: 'Status' },
            };
            const config = {
                fields: {
                    asset_id: {
                        fieldParams: { renderInTable: false },
                    },
                    asset_id_displayed: { fieldParams: { renderInTable: true } },
                    asset_type_name: { fieldParams: { renderInTable: true } },
                    asset_location: { fieldParams: { renderInTable: true } },
                    asset_status: { fieldParams: {} },
                },
            };

            const shouldDisableEdit = jest.fn();
            const shouldDisableDelete = jest.fn();
            const getTooltips = jest.fn();

            const { result } = renderHook(() =>
                useDataTableColumns({
                    config,
                    locale,
                    getTooltips,
                    shouldDisableEdit,
                    shouldDisableDelete,
                    actionTooltips: {},
                    actionDataFieldKeys: {},
                }),
            );
            const { columns } = result.current;

            expect(columns.length).toBe(Object.keys(locale).length);
            expect(columns[4]).toEqual(expect.objectContaining({ field: '', renderCell: expect.anything() }));
            // here - need a few more for coverage
            columns[4].renderCell({ row: {} });
        });
    });
});
