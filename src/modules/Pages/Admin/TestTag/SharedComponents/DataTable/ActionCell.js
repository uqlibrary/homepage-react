import React from 'react';
import PropTypes from 'prop-types';

import { createTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import Tooltip from '@material-ui/core/Tooltip';

import { getDataFieldParams } from './utils';

const defaultTheme = createTheme();
const rootId = 'action_cell';

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: theme.spacing(1),
            color: theme.palette.text.secondary,
        },
        textPrimary: {
            color: theme.palette.text.primary,
        },
    }),
    { defaultTheme },
);

const defaultEditIcon = <EditIcon fontSize="small" />;
const defaultDeleteIcon = <DeleteIcon fontSize="small" />;

const ActionCell = ({
    api,
    id,
    handleEditClick,
    handleDeleteClick,
    disableEdit,
    disableDelete,
    editIcon = defaultEditIcon,
    deleteIcon = defaultDeleteIcon,
    dataFieldKeys,
    tooltips,
}) => {
    const componentId = `${rootId}-${id}`;
    const classes = useStyles();

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
            className={classes.textPrimary}
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
        <div className={classes.root}>
            {!!handleEditClick && (
                <>
                    {!!tooltips && !!tooltips?.edit && (
                        <Tooltip
                            title={tooltips.edit}
                            id={'tooltip-edit'}
                            data-testid={'tooltip-edit'}
                            TransitionProps={{ timeout: 300 }}
                        >
                            {editButton}
                        </Tooltip>
                    )}
                    {(!!!tooltips || !!!tooltips?.edit) && editButton}
                </>
            )}
            {!!handleDeleteClick && (
                <>
                    {!!tooltips && !!tooltips?.delete && (
                        <Tooltip
                            title={tooltips.delete}
                            id={'tooltip-delete'}
                            data-testid={'tooltip-delete'}
                            TransitionProps={{ timeout: 300 }}
                        >
                            {deleteButton}
                        </Tooltip>
                    )}
                    {(!!!tooltips || !!!tooltips?.delete) && deleteButton}
                </>
            )}
        </div>
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
    tooltips: PropTypes.object,
};

export default React.memo(ActionCell);
