import React from 'react';

const mockDndDrag = jest.fn();
const mockDndDrop = jest.fn();

jest.mock('react-dnd', () => ({
    // eslint-disable-next-line react/prop-types
    DndProvider: ({ children }) => <>{children}</>,
    useDrag: (...args) => mockDndDrag(...args),
    useDrop: (...args) => mockDndDrop(...args),
}));

jest.mock('react-dnd-html5-backend', () => ({
    HTML5Backend: {},
}));

import { act, fireEvent, rtlRender, screen, waitFor } from 'test-utils';
import { getFlatFacilityTypeList } from 'modules/Pages/BookableSpaces/Shared/spacesHelpers';
import { orderFacilityTypeGroups } from './facilityGroupOrderHelpers';
import { BookableSpacesManageFacilities } from './BookableSpacesManageFacilities';

describe('BookableSpacesManageFacilities', () => {
    const defaultProps = {
        actions: {
            loadAllFacilityTypes: jest.fn(),
            loadAllBookableSpacesRooms: jest.fn(),
            updateSpacesFacilityGroupList: jest.fn().mockResolvedValue({}),
            createSpacesFacilityType: jest.fn().mockResolvedValue({}),
            updateSpacesFacilityType: jest.fn().mockResolvedValue({}),
            deleteSpacesFacilityType: jest.fn().mockResolvedValue({}),
        },
        facilityTypeList: {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Study spaces',
                        facility_type_children: [
                            {
                                facility_type_id: 101,
                                facility_type_name: 'Laptop friendly',
                                filter_display_on: 'simple',
                                hide_in_public_filter_list: false,
                            },
                        ],
                    },
                    {
                        facility_type_group_id: 2,
                        facility_type_group_name: 'Amenities',
                        facility_type_children: [
                            {
                                facility_type_id: 102,
                                facility_type_name: 'Print',
                                filter_display_on: 'both',
                                hide_in_public_filter_list: true,
                            },
                        ],
                    },
                ],
            },
        },
        facilityTypeListError: false,
        facilityTypeListLoading: false,
        bookableSpacesRoomList: {
            data: {
                locations: [{ facility_types: [{ facility_type_id: 101 }] }],
            },
        },
        facilityTypeUpdating: false,
        facilityTypeUpdateError: null,
        facilityTypeUpdated: null,
        facilityTypeAddGroupError: null,
        facilityTypeGroupAdded: null,
        facilityTypeGroupListError: null,
        facilityTypeGroupListLoading: false,
    };

    it('flattens groups and orders them for display', () => {
        expect(getFlatFacilityTypeList(defaultProps.facilityTypeList)).toHaveLength(2);
        expect(orderFacilityTypeGroups(defaultProps.facilityTypeList.data.facility_type_groups)).toHaveLength(2);
    });

    beforeEach(() => {
        mockDndDrag.mockImplementation(() => [{ isDragging: false }, jest.fn()]);
        mockDndDrop.mockImplementation(() => [{}, jest.fn()]);
        if (!HTMLDialogElement.prototype.showModal) {
            HTMLDialogElement.prototype.showModal = function showModal() {
                this.setAttribute('open', 'open');
            };
        }
        if (!HTMLDialogElement.prototype.close) {
            HTMLDialogElement.prototype.close = function close() {
                this.removeAttribute('open');
            };
        }
        jest.useRealTimers();
    });

    it('renders the facility management screen headings', async () => {
        rtlRender(
            <BookableSpacesManageFacilities
                {...defaultProps}
                facilityTypeList={null}
                facilityTypeListLoading={null}
                facilityTypeListError={null}
            />,
        );

        expect(screen.getByText('Spaces')).toBeInTheDocument();
        expect(screen.getByText('Manage Facility types')).toBeInTheDocument();
        await waitFor(() => expect(defaultProps.actions.loadAllFacilityTypes).toHaveBeenCalled());
    });

    it('shows the loading state while facility type data is still being loaded', () => {
        rtlRender(<BookableSpacesManageFacilities {...defaultProps} facilityTypeListLoading facilityTypeUpdating />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('shows the API error state when facility type loading fails', () => {
        rtlRender(
            <BookableSpacesManageFacilities {...defaultProps} facilityTypeListError facilityTypeListLoading={false} />,
        );

        expect(screen.getByTestId('apiError')).toHaveTextContent('Something went wrong - please try again later.');
    });

    it('runs the DraggableListItem reorder logic when a list item is dropped onto a different index', async () => {
        jest.useFakeTimers();
        const updateSpacesFacilityGroupList = jest.fn().mockResolvedValue({});
        const actions = {
            ...defaultProps.actions,
            updateSpacesFacilityGroupList,
        };

        mockDndDrop.mockImplementation(config => {
            const props = { ...config };
            return [
                {},
                ref => {
                    if (ref && typeof props.drop === 'function') {
                        ref.drop = props.drop;
                    }
                    return ref;
                },
            ];
        });

        rtlRender(<BookableSpacesManageFacilities {...defaultProps} actions={actions} />);

        fireEvent.click(screen.getByTestId('facility-group-order'));

        const dropConfig = mockDndDrop.mock.calls[0][0];
        await act(async () => {
            dropConfig.drop({ index: 1 });
            jest.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(updateSpacesFacilityGroupList).toHaveBeenCalled();
        });
    });

    it('does not reorder when a dropped item is already in the target position', async () => {
        jest.useFakeTimers();
        const updateSpacesFacilityGroupList = jest.fn().mockResolvedValue({});
        const actions = {
            ...defaultProps.actions,
            updateSpacesFacilityGroupList,
        };

        mockDndDrop.mockImplementation(config => {
            const props = { ...config };
            return [
                {},
                ref => {
                    if (ref && typeof props.drop === 'function') {
                        ref.drop = props.drop;
                    }
                    return ref;
                },
            ];
        });

        rtlRender(<BookableSpacesManageFacilities {...defaultProps} actions={actions} />);
        fireEvent.click(screen.getByTestId('facility-group-order'));

        const dropConfig = mockDndDrop.mock.calls[0][0];
        await act(async () => {
            dropConfig.drop({ index: 0 });
            jest.advanceTimersByTime(1000);
        });

        expect(updateSpacesFacilityGroupList).not.toHaveBeenCalled();
    });

    it('ignores invalid reorder indices before the payload is built', async () => {
        jest.useFakeTimers();
        const updateSpacesFacilityGroupList = jest.fn().mockResolvedValue({});
        const actions = {
            ...defaultProps.actions,
            updateSpacesFacilityGroupList,
        };

        mockDndDrop.mockImplementation(config => {
            const props = { ...config };
            return [
                {},
                ref => {
                    if (ref && typeof props.drop === 'function') {
                        ref.drop = props.drop;
                    }
                    return ref;
                },
            ];
        });

        rtlRender(<BookableSpacesManageFacilities {...defaultProps} actions={actions} />);
        fireEvent.click(screen.getByTestId('facility-group-order'));

        const dropConfig = mockDndDrop.mock.calls[0][0];
        await act(async () => {
            dropConfig.drop({ index: 99 });
            jest.advanceTimersByTime(1000);
        });

        expect(updateSpacesFacilityGroupList).not.toHaveBeenCalled();
    });

    it('saves an edited facility type with hidden and display settings', async () => {
        const actions = {
            ...defaultProps.actions,
            updateSpacesFacilityType: jest.fn().mockResolvedValue({}),
        };

        rtlRender(<BookableSpacesManageFacilities {...defaultProps} actions={actions} />);

        fireEvent.click(screen.getByTestId('edit-facility-type-101-button'));

        const nameInput = document.getElementById('facility_type_name');
        fireEvent.change(nameInput, { target: { value: 'Laptop friendly updated' } });

        const hideField = document.getElementById('hide_in_public_filter_list');
        fireEvent.click(hideField);

        fireEvent.click(document.getElementById('saveButton'));

        await waitFor(() => {
            expect(actions.updateSpacesFacilityType).toHaveBeenCalledWith(
                expect.objectContaining({
                    facility_type_id: '101',
                    facility_type_name: 'Laptop friendly updated',
                    filter_display_on: 'simple',
                    hide_in_public_filter_list: true,
                }),
            );
        });
    });

    it('deletes a facility type after confirmation', async () => {
        const actions = {
            ...defaultProps.actions,
            deleteSpacesFacilityType: jest.fn().mockResolvedValue({}),
        };

        rtlRender(<BookableSpacesManageFacilities {...defaultProps} actions={actions} />);

        fireEvent.click(screen.getByTestId('edit-facility-type-101-button'));
        fireEvent.click(document.getElementById('deleteButton'));
        fireEvent.click(document.getElementById('confDialogOkButton'));

        await waitFor(() => {
            expect(actions.deleteSpacesFacilityType).toHaveBeenCalledWith(101);
        });
    });

    it('adds a new child facility type to an existing group', async () => {
        const actions = {
            ...defaultProps.actions,
            createSpacesFacilityType: jest.fn().mockResolvedValue({}),
        };

        rtlRender(<BookableSpacesManageFacilities {...defaultProps} actions={actions} />);

        fireEvent.click(document.getElementById('add-group-1-button'));

        const newFacilityName = document.getElementById('newFacilityType');
        fireEvent.change(newFacilityName, { target: { value: 'Collaborative tables' } });

        const viewSelect = document.getElementById('filter_display_on');
        fireEvent.change(viewSelect, { target: { value: 'both' } });

        fireEvent.click(document.getElementById('saveButton'));

        await waitFor(() => {
            expect(actions.createSpacesFacilityType).toHaveBeenCalledWith(
                expect.objectContaining({
                    facility_type__group_id: '1',
                    facility_type_name: 'Collaborative tables',
                    filter_display_on: 'both',
                }),
            );
        });
    });

    it('creates a new facility group and first type from the add-group form', async () => {
        const actions = {
            ...defaultProps.actions,
            createSpacesFacilityTypeGroup: jest.fn().mockResolvedValue({ data: { facility_type_group_id: 99 } }),
            createSpacesFacilityType: jest.fn().mockResolvedValue({}),
        };

        rtlRender(<BookableSpacesManageFacilities {...defaultProps} actions={actions} />);

        fireEvent.click(screen.getByTestId('facility-group-add'));

        fireEvent.change(document.getElementById('newGroupname'), {
            target: { value: 'New group' },
        });
        fireEvent.change(document.getElementById('firstGroupEntry'), {
            target: { value: 'First type' },
        });
        fireEvent.change(document.getElementById('facility_type_group_help'), {
            target: { value: 'Helpful description' },
        });

        fireEvent.click(document.getElementById('saveButton'));

        await waitFor(() => {
            expect(actions.createSpacesFacilityTypeGroup).toHaveBeenCalledWith(
                expect.objectContaining({
                    facility_type_group_name: 'New group',
                    facility_type_group_help: 'Helpful description',
                    facility_type_group_order: 0,
                }),
            );
        });

        await waitFor(() => {
            expect(actions.createSpacesFacilityType).toHaveBeenCalledWith(
                expect.objectContaining({
                    facility_type__group_id: 99,
                    facility_type_name: 'First type',
                    filter_display_on: 'both',
                }),
            );
        });
    });

    it('updates and deletes a facility group from the edit-group dialog', async () => {
        const actions = {
            ...defaultProps.actions,
            updateSpacesFacilityGroupSingle: jest.fn().mockResolvedValue({}),
            deleteSpacesFacilityTypeGroup: jest.fn().mockResolvedValue({}),
        };

        rtlRender(<BookableSpacesManageFacilities {...defaultProps} actions={actions} />);

        fireEvent.click(screen.getByTestId('edit-group-1-button'));
        fireEvent.change(document.getElementById('facility_type_group_name'), {
            target: { value: 'Study spaces updated' },
        });
        fireEvent.click(document.getElementById('saveButton'));

        await waitFor(() => {
            expect(actions.updateSpacesFacilityGroupSingle).toHaveBeenCalledWith(
                expect.objectContaining({
                    facility_type_group_name: 'Study spaces updated',
                }),
                '1',
            );
        });

        fireEvent.click(screen.getByTestId('edit-group-1-button'));
        fireEvent.click(document.getElementById('deleteButton'));
        fireEvent.click(document.getElementById('confDialogOkButton'));

        await waitFor(() => {
            expect(actions.deleteSpacesFacilityTypeGroup).toHaveBeenCalledWith(1);
        });
    });
});
