import React from 'react';
import PropTypes from 'prop-types';

import { createTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';

const defaultTheme = createTheme();

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

const RowMenuCell = ({ api, id, onRowEdit, onRowDelete }) => {
    const classes = useStyles();

    const handleEditClick = event => {
        event.stopPropagation();
        onRowEdit({ id, api });
    };

    const handleDeleteClick = event => {
        event.stopPropagation();
        onRowDelete({ id, api });
    };

    return (
        <div className={classes.root}>
            <IconButton
                color="inherit"
                className={classes.textPrimary}
                size="small"
                aria-label="edit"
                disabled={!!!onRowEdit}
                onClick={handleEditClick}
            >
                <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
                color="inherit"
                size="small"
                aria-label="delete"
                disabled={!!!onRowDelete}
                onClick={handleDeleteClick}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
        </div>
    );
};

RowMenuCell.propTypes = {
    api: PropTypes.object.isRequired,
    row: PropTypes.any,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    // setEditRowsModel: PropTypes.func.isRequired,
    onRowEdit: PropTypes.func.isRequired,
    onRowDelete: PropTypes.func,
};

export default React.memo(RowMenuCell);
