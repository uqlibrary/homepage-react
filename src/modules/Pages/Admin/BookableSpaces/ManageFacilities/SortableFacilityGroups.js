import React from 'react';
import PropTypes from 'prop-types';

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const StyledDragRowListitem = styled('li')(() => ({
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '5px',
    padding: '5px',
    alignItems: 'center',
}));

export const SortableFacilityGroups = ({ facilityTypeGroupList }) => {
    if (!facilityTypeGroupList || facilityTypeGroupList?.length === 0) {
        return null;
    }

    const DraggableListItem = React.memo(({ group, index, moveItem, handleChange, handleDelete }) => {
        const ref = React.useRef(null);
        const [, drop] = useDrop({
            accept: 'LIST_ITEM',
            drop(draggedItem) {
                /* istanbul ignore else */
                if (draggedItem.index !== index) {
                    moveItem(draggedItem.index, index);
                    draggedItem.index = index;
                }
            },
        });

        const [{ isDragging }, drag] = useDrag({
            type: 'LIST_ITEM',
            group: { index },
            collect: monitor => ({
                isDragging: monitor.isDragging(),
            }),
        });

        drag(drop(ref));

        return (
            <StyledDragRowListitem ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        data-testid={`admin-series-remove-object-button-${index}`}
                        onClick={() => {
                            handleDelete(index, item.object_public_uuid);
                        }}
                        title={'Remove object from series'}
                        style={{ minWidth: 60 }}
                        aria-label="Add a date set"
                        size="large"
                        color="secondary"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'transparent', // Remove hover background effect
                            },
                        }}
                    >
                        <DragIndicatorIcon />
                    </IconButton>
                </div>
                <span data-testid={`spaces-facility-group-edit-draggable-title-${group?.facility_type_group_id}`}>
                    {group?.facility_type_group_name}
                </span>
            </StyledDragRowListitem>
        );
    });

    return (
        <>
            <Typography component={'h3'} variant={'h6'}>
                Sort Filter type Groups
            </Typography>
            <DndProvider backend={HTML5Backend} style={{ marginBottom: '1rem' }}>
                <ul>
                    {(
                        facilityTypeGroupList?.sort((a, b) =>
                            a.facility_type_group_name.localeCompare(b.facility_type_group_name),
                        ) || []
                    )
                        ?.sort((a, b) => a.facility_type_group_order - b.facility_type_group_order)
                        .map((group, index) => {
                            return (
                                <DraggableListItem xs={12} key={`facility-group-sort-item-${index}`} group={group}>
                                    {group.facility_type_group_name}
                                </DraggableListItem>
                            );
                        })}
                </ul>
            </DndProvider>
        </>
    );
};
SortableFacilityGroups.propTypes = {
    facilityTypeGroupList: PropTypes.array,
};

export default React.memo(SortableFacilityGroups);
