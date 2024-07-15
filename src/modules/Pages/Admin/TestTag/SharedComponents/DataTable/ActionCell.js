import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Tooltip from '@mui/material/Tooltip';

import { getDataFieldParams } from './utils';

const rootId = 'action_cell';

const StyledWrapper = styled('div')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,

    '& .textPrimary': {
        color: theme.palette.text.primary,
    },
}));

const defaultEditIcon = <EditIcon fontSize="small" />;
const defaultDeleteIcon = <DeleteIcon fontSize="small" />;

const ActionCell = ({
    api,
    id,
    handleEditClick,
    handleDeleteClick,
    disableEdit = false,
    disableDelete = false,
    editIcon = defaultEditIcon,
    deleteIcon = defaultDeleteIcon,
    dataFieldKeys = {},
    tooltips,
}) => {
    const componentId = `${rootId}-${id}`;

    const { dataFieldName, dataFieldValue } = getDataFieldParams(api.getRow(id), dataFieldKeys);

    const onEditClick = event => {
        event.stopPropagation();
        handleEditClick?.({ id, api });
    };

    const onDeleteClick = event => {
        event.stopPropagation();
        handleDeleteClick?.({ id, api });
    };

    const editButton = (
        <IconButton
            id={`${componentId}-edit-button`}
            data-testid={`${componentId}-edit-button`}
            {...(!!dataFieldValue ? { ['data-field']: dataFieldName, ['data-value']: dataFieldValue } : {})}
            data-action="edit"
            color="inherit"
            className={'textPrimary'}
            size="small"
            aria-label="edit"
            disabled={disableEdit}
            onClick={onEditClick}
        >
            {editIcon}
        </IconButton>
    );

    const deleteButton = (
        <IconButton
            id={`${componentId}-delete-button`}
            data-testid={`${componentId}-delete-button`}
            {...(!!dataFieldValue ? { ['data-field']: dataFieldName, ['data-value']: dataFieldValue } : {})}
            data-action="delete"
            color="inherit"
            size="small"
            aria-label="delete"
            disabled={disableDelete}
            onClick={onDeleteClick}
        >
            {deleteIcon}
        </IconButton>
    );

    return (
        <StyledWrapper>
            {!!handleEditClick && (
                <>
                    {!!tooltips && !!tooltips?.edit && (
                        <Tooltip
                            title={
                                disableEdit ? tooltips?.editDisabled ?? /* istanbul ignore next */ '' : tooltips?.edit
                            }
                            id={'tooltip-edit'}
                            data-testid={'tooltip-edit'}
                            TransitionProps={{ timeout: 300 }}
                        >
                            <span>{editButton}</span>
                        </Tooltip>
                    )}
                    {(!!!tooltips || !!!tooltips?.edit) && editButton}
                </>
            )}
            {!!handleDeleteClick && (
                <>
                    {!!tooltips && !!tooltips?.delete && (
                        <Tooltip
                            title={
                                disableDelete
                                    ? tooltips?.deleteDisabled ?? /* istanbul ignore next */ ''
                                    : tooltips.delete
                            }
                            id={'tooltip-delete'}
                            data-testid={'tooltip-delete'}
                            TransitionProps={{ timeout: 300 }}
                        >
                            <span>{deleteButton}</span>
                        </Tooltip>
                    )}
                    {(!!!tooltips || !!!tooltips?.delete) && deleteButton}
                </>
            )}
        </StyledWrapper>
    );
};

ActionCell.propTypes = {
    api: PropTypes.object.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    handleEditClick: PropTypes.func,
    handleDeleteClick: PropTypes.func,
    disableEdit: PropTypes.bool,
    disableDelete: PropTypes.bool,
    editIcon: PropTypes.node,
    deleteIcon: PropTypes.node,
    dataFieldKeys: PropTypes.object,
    tooltips: PropTypes.shape({
        edit: PropTypes.string,
        delete: PropTypes.string,
        editDisabled: PropTypes.string,
        deleteDisabled: PropTypes.string,
    }),
};

export default React.memo(ActionCell);
