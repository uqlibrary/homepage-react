import React from 'react';
import { rtlRender, screen, fireEvent, waitFor, WithRouter } from '../../../../../../utils/test-utils';
import DLOFilterManage from './DLOFilterManage';

const facetList = [
    {
        facet_type_id: 10,
        facet_type_name: 'Subject',
        facet_list: [
            {
                facet_id: 1,
                facet_name: 'Mathematics',
                facet_use_count: 1,
                facet_order: 1,
                facet_help: 'Math help',
                facet_show_help: true,
            },
            {
                facet_id: 2,
                facet_name: 'Science',
                facet_use_count: 2,
                facet_order: 0,
                facet_show_help: false,
            },
            {
                facet_id: 3,
                facet_name: 'History',
                facet_order: 3,
                facet_show_help: false,
            },
        ],
    },
    {
        facet_type_id: 11,
        facet_type_name: 'Format',
        facet_list: [],
    },
];

describe('DLOFilterManage', () => {
    it('loads filters when none are supplied', async () => {
        const actions = {
            loadAllFilters: jest.fn(),
            updateFacet: jest.fn(),
            createFacet: jest.fn(),
            deleteFacet: jest.fn(),
        };

        rtlRender(
            <WithRouter>
                <DLOFilterManage
                    actions={actions}
                    dlorFilterListLoading={false}
                    dlorFilterListError={null}
                    dlorFilterList={undefined}
                />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(actions.loadAllFilters).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText('Digital Learning Hub - Facet Management')).toBeInTheDocument();
    });

    it('renders facet groups and creates a new facet', async () => {
        const actions = {
            loadAllFilters: jest.fn(),
            updateFacet: jest.fn(),
            createFacet: jest.fn().mockResolvedValue({}),
            deleteFacet: jest.fn(),
        };

        rtlRender(
            <WithRouter>
                <DLOFilterManage
                    actions={actions}
                    dlorFilterListLoading={false}
                    dlorFilterListError={null}
                    dlorFilterList={facetList}
                />
            </WithRouter>,
        );

        expect(screen.getAllByText('Subject').length).toBeGreaterThan(0);
        expect(screen.getByText('1 object')).toBeInTheDocument();
        expect(screen.getByText('2 objects')).toBeInTheDocument();
        expect(screen.getByText('0 objects')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('add-facet-10'));

        expect(screen.getByText('Add new facet')).toBeInTheDocument();
        expect(screen.getByText(/In filter group:/)).toBeInTheDocument();
        expect(screen.getAllByText('Subject').length).toBeGreaterThan(0);
        expect(screen.getByTestId('admin-dlor-filter-confirm-button')).toBeDisabled();

        fireEvent.change(document.getElementById('facet_name'), { target: { value: 'History' } });
        fireEvent.change(document.getElementById('facet_order'), { target: { value: '4' } });
        fireEvent.change(document.getElementById('facet_help'), { target: { value: 'History help' } });
        fireEvent.click(document.getElementById('facet_show_help'));

        expect(screen.getByTestId('admin-dlor-filter-confirm-button')).not.toBeDisabled();

        fireEvent.click(screen.getByTestId('admin-dlor-filter-confirm-button'));

        await waitFor(() => {
            expect(actions.createFacet).toHaveBeenCalledTimes(1);
        });

        expect(actions.createFacet).toHaveBeenCalledWith(
            expect.objectContaining({
                facet_name: 'History',
                facet_type_id: 10,
                facet_order: '4',
                facet_help: 'History help',
                facet_show_help: true,
            }),
        );
    });

    it('edits an existing facet and cancels the modal when requested', async () => {
        const actions = {
            loadAllFilters: jest.fn(),
            updateFacet: jest.fn().mockResolvedValue({}),
            createFacet: jest.fn(),
            deleteFacet: jest.fn(),
        };

        rtlRender(
            <WithRouter>
                <DLOFilterManage
                    actions={actions}
                    dlorFilterListLoading={false}
                    dlorFilterListError={null}
                    dlorFilterList={facetList}
                />
            </WithRouter>,
        );

        fireEvent.click(screen.getByTestId('edit-facet-1'));

        expect(screen.getByText('Edit facet')).toBeInTheDocument();
        expect(screen.getByText('Original Name:')).toBeInTheDocument();
        expect(document.getElementById('facet_name')).toHaveValue('Mathematics');

        fireEvent.change(document.getElementById('facet_name'), { target: { value: 'Advanced Mathematics' } });
        fireEvent.change(document.getElementById('facet_order'), { target: { value: '' } });
        fireEvent.change(document.getElementById('facet_help'), { target: { value: '' } });
        fireEvent.click(screen.getByTestId('admin-dlor-filter-cancel-button'));

        expect(screen.queryByText('Edit facet')).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId('edit-facet-1'));
        fireEvent.change(document.getElementById('facet_name'), { target: { value: 'Advanced Mathematics' } });
        fireEvent.change(document.getElementById('facet_order'), { target: { value: '7' } });
        fireEvent.change(document.getElementById('facet_help'), { target: { value: 'Updated math help' } });
        fireEvent.click(document.getElementById('facet_show_help'));
        fireEvent.click(screen.getByTestId('admin-dlor-filter-confirm-button'));

        await waitFor(() => {
            expect(actions.updateFacet).toHaveBeenCalledTimes(1);
        });

        expect(actions.updateFacet).toHaveBeenCalledWith(
            1,
            expect.objectContaining({
                facet_name: 'Advanced Mathematics',
                facet_order: '7',
                facet_help: 'Updated math help',
                facet_show_help: false,
            }),
        );
    });

    it('deletes a facet after confirmation', async () => {
        const actions = {
            loadAllFilters: jest.fn(),
            updateFacet: jest.fn(),
            createFacet: jest.fn(),
            deleteFacet: jest.fn().mockResolvedValue({}),
        };

        rtlRender(
            <WithRouter>
                <DLOFilterManage
                    actions={actions}
                    dlorFilterListLoading={false}
                    dlorFilterListError={null}
                    dlorFilterList={facetList}
                />
            </WithRouter>,
        );

        fireEvent.click(screen.getByTestId('delete-facet-1'));

        expect(screen.getByText('Delete facet')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete the facet "Mathematics"?')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('cancel-alert-edit-save-succeeded'));
        await waitFor(() => {
            expect(screen.queryByText('Delete facet')).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('delete-facet-1'));
        fireEvent.click(screen.getByTestId('confirm-alert-edit-save-succeeded'));

        await waitFor(() => {
            expect(actions.deleteFacet).toHaveBeenCalledTimes(1);
        });

        expect(actions.deleteFacet).toHaveBeenCalledWith(1);
    });
});
