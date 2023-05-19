import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import { createTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

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

const RowMenuCell = ({ api, id, row, onRowSave }) => {
    const classes = useStyles();
    const isInEditMode = api.getRowMode(id) === 'edit';

    const handleEditClick = event => {
        event.stopPropagation();
        api.setRowMode(id, 'edit');
    };

    const handleSaveClick = event => {
        event.stopPropagation();
        api.commitRowChange(id);
        api.setRowMode(id, 'view');

        const row = api.getRow(id);
        api.updateRows([{ ...row, isNew: false }]);
        onRowSave(row);
    };

    const handleDeleteClick = event => {
        event.stopPropagation();
        api.updateRows([{ asset_type_id: row.asset_type_id, _action: 'delete' }]);
    };

    const handleCancelClick = event => {
        event.stopPropagation();
        api.setRowMode(id, 'view');

        const row = api.getRow(id);
        if (row.isNew) {
            api.updateRows([{ id, _action: 'delete' }]);
        }
    };

    if (isInEditMode) {
        return (
            <div className={classes.root}>
                <IconButton color="primary" size="small" aria-label="save" onClick={handleSaveClick}>
                    <SaveIcon fontSize="small" />
                </IconButton>
                <IconButton
                    color="inherit"
                    size="small"
                    aria-label="cancel"
                    className={classes.textPrimary}
                    onClick={handleCancelClick}
                >
                    <CancelIcon fontSize="small" />
                </IconButton>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <IconButton
                color="inherit"
                className={classes.textPrimary}
                size="small"
                aria-label="edit"
                onClick={handleEditClick}
            >
                <EditIcon fontSize="small" />
            </IconButton>
            <IconButton color="inherit" size="small" aria-label="delete" onClick={handleDeleteClick}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        </div>
    );
};

RowMenuCell.propTypes = {
    api: PropTypes.object.isRequired,
    row: PropTypes.any,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    onRowSave: PropTypes.func.isRequired,
};

export default RowMenuCell;
