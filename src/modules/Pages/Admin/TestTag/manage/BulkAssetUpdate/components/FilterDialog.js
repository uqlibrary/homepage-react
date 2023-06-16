import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import * as actions from 'data/actions';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import { useDataTableRow, useDataTableColumns } from '../../../SharedComponents/DataTable/DataTableHooks';
import { useLocation, useSelectLocation } from '../../../SharedComponents/LocationPicker/LocationPickerHooks';
import AutoLocationPicker from '../../../SharedComponents/LocationPicker/AutoLocationPicker';

export const useStyles = makeStyles(theme => ({
    alternateActionButtonClass: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.warning.main,
        '&:hover': {
            backgroundColor: theme.palette.warning.dark,
        },
    },
    alertPanel: {
        marginTop: 10,
    },
    actionButtons: {
        marginTop: 10,
    },
    dialogPaper: {
        minHeight: '30vh',
        maxHeight: '50vh',
    },
}));

export const FilterDialog = ({
    id,
    isOpen = false,
    isBusy = false,
    locationLocale,
    locale,
    config,
    onCancel,
    onProceed,
}) => {
    const classes = useStyles();
    const { row, setRow } = useDataTableRow();

    const store = useSelector(state => state.get('testTagLocationReducer'));
    const { location, setLocation } = useLocation();
    const { selectedLocation } = useSelectLocation({
        location,
        setLocation,
        setRow,
        actions,
        store,
    });
    const { columns } = useDataTableColumns({
        config,
        locale: locale.form.columns,
    });

    useEffect(() => {
        console.log(location, selectedLocation);
    }, [location, selectedLocation]);

    return (
        <Dialog
            classes={{ paper: classes.dialogPaper }}
            style={{ padding: 6 }}
            open={isOpen}
            data-testid={`dialogbox-${id}`}
            fullWidth
        >
            <DialogTitle data-testid="message-title">{locale?.title}</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <AutoLocationPicker
                        actions={actions}
                        location={location}
                        setLocation={setLocation}
                        locale={locationLocale}
                    />
                </Grid>
                <Grid container spacing={4} className={classes.actionButtons}>
                    <Grid item xs={12} sm={6} container justifyContent="flex-start">
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            id="actionDialog-cancelButton"
                            data-testid="actionDialog-cancelButton"
                            color={'default'}
                            disabled={!!isBusy}
                        >
                            {locale.button.cancel}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} container justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onProceed}
                            id="actionDialog-proceedButton"
                            data-testid="actionDialog-proceedButton"
                            disabled={!!isBusy}
                        >
                            {locale.button.submit}
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item padding={3} style={{ flex: 1 }}>
                        <DataTable rows={row} columns={columns} rowId={'asset_id'} />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

FilterDialog.propTypes = {
    dialogueContent: PropTypes.any,
    isOpen: PropTypes.bool,
    locale: PropTypes.object.isRequired,
    locationLocale: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    id: PropTypes.string,
    onCancel: PropTypes.func,
    onProceed: PropTypes.func,
    isBusy: PropTypes.bool,
};

export default React.memo(FilterDialog);
