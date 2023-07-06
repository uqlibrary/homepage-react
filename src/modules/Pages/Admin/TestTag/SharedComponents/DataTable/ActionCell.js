import React from 'react';
import PropTypes from 'prop-types';

import { createTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';

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

const ActionCell = ({ api, id, handleEditClick, handleDeleteClick }) => {
    const componentId = `${rootId}-${id}`;
    const classes = useStyles();

    const onEditClick = event => {
        event.stopPropagation();
        handleEditClick?.({ id, api });
    };

    const onDeleteClick = event => {
        event.stopPropagation();
        handleDeleteClick?.({ id, api });
    };

    return (
        <div className={classes.root}>
            {!!handleEditClick && (
                <IconButton
                    id={`${componentId}-edit-button`}
                    data-testid={`${componentId}-edit-button`}
                    color="inherit"
                    className={classes.textPrimary}
                    size="small"
                    aria-label="edit"
                    disabled={!!!handleEditClick}
                    onClick={onEditClick}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            )}

            {!!handleDeleteClick && (
                <IconButton
                    id={`${componentId}-delete-button`}
                    data-testid={`${componentId}-delete-button`}
                    color="inherit"
                    size="small"
                    aria-label="delete"
                    disabled={!!!handleDeleteClick}
                    onClick={onDeleteClick}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )}
        </div>
    );
};

ActionCell.propTypes = {
    api: PropTypes.object.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    handleEditClick: PropTypes.func,
    handleDeleteClick: PropTypes.func,
};

export default React.memo(ActionCell);
