import React from 'react';
import PropTypes from 'prop-types';
import { useConfirmationState } from 'hooks';

import { Box, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import locale from '../testTag.locale';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

const AssetTypeDialogPopup = props => {
    AssetTypeDialogPopup.propTypes = {
        isAssetTypeDialogOpen: PropTypes.bool.isRequired,
        assetTypeValid: PropTypes.bool.isRequired,
        setAssetTypeValid: PropTypes.func.isRequired,
        actions: PropTypes.object,
        setAssetTypeDialogOpen: PropTypes.func.isRequired,
        saveAssetTypeSaving: PropTypes.bool,
        saveAssetTypeSuccess: PropTypes.any,
        saveAssetTypeError: PropTypes.any,
        isMobileView: PropTypes.bool,
        classes: PropTypes.object.isRequired,
        initConfig: PropTypes.object,
        initConfigLoading: PropTypes.bool,
        initConfigError: PropTypes.any,
    };
    AssetTypeDialogPopup.defaultProps = {
        isMobileView: false,
    };
    const {
        isAssetTypeDialogOpen,
        assetTypeValid,
        setAssetTypeValid,
        actions,
        setAssetTypeDialogOpen,
        saveAssetTypeSaving,
        saveAssetTypeSuccess,
        saveAssetTypeError,
        isMobileView,
        classes,
    } = props;

    const [formValues, setValues] = React.useState({
        asset_type_name: '',
        asset_type_class: '',
        asset_type_power_rating: '',
        asset_type: '',
        asset_type_notes: '',
    });
    const handleChange = prop => event => {
        let propValue = !!event.target.value ? event.target.value : event.target.checked;
        if (propValue === false) {
            // it returns false when we clear a text field
            propValue = '';
        }

        setValues({
            ...formValues,
            [prop]: propValue,
        });

        setAssetTypeValid(formValues.asset_type_name.length > 0);
    };

    const closeAssetTypeDialog = () => {
        setAssetTypeDialogOpen(false);
    };

    const [
        isSaveSuccessConfirmationOpen,
        showSaveSuccessConfirmation,
        hideSaveSuccessConfirmation,
    ] = useConfirmationState();

    const [
        isSaveFailureConfirmationOpen,
        showSaveFailureConfirmation,
        hideSaveFailureConfirmation,
    ] = useConfirmationState();

    React.useEffect(() => {
        !!saveAssetTypeSuccess && showSaveSuccessConfirmation();
        !!saveAssetTypeError && showSaveFailureConfirmation();
    }, [saveAssetTypeSuccess, saveAssetTypeError, showSaveSuccessConfirmation, showSaveFailureConfirmation]);

    function saveAssetTypeAndReload() {
        actions.saveAssetTypeAndReload(formValues);
    }

    function handleSuccessfulSave() {
        hideSaveSuccessConfirmation();
        closeAssetTypeDialog();
    }

    function handleFailedSave() {
        hideSaveFailureConfirmation();
        closeAssetTypeDialog();
    }

    if (!!isAssetTypeDialogOpen) {
        return (
            <React.Fragment>
                <ConfirmationBox
                    actionButtonColor="primary"
                    actionButtonVariant="contained"
                    confirmationBoxId="tnt-assettype-add-success"
                    onAction={handleSuccessfulSave}
                    onClose={handleSuccessfulSave}
                    hideCancelButton
                    isOpen={isSaveSuccessConfirmationOpen}
                    locale={locale.form.asset.assetType.saveSuccess}
                />
                <ConfirmationBox
                    actionButtonColor="primary"
                    actionButtonVariant="contained"
                    confirmationBoxId="tnt-assettype-add-failed"
                    onAction={handleFailedSave}
                    onClose={handleFailedSave}
                    hideCancelButton
                    isOpen={isSaveFailureConfirmationOpen}
                    locale={locale.form.asset.assetType.saveFailure}
                />
                <Dialog
                    onClose={/* istanbul ignore next */ () => closeAssetTypeDialog()}
                    aria-label="Asset Type Editor"
                    role="dialog"
                    open={!!isAssetTypeDialogOpen}
                    PaperProps={{
                        id: 'asset-type-dialog',
                        style: {
                            backgroundColor: '#fff',
                            color: '#000',
                            height: '40em',
                        },
                        'aria-label': 'Manage asset type',
                    }}
                >
                    <DialogTitle
                        style={{ borderBottom: '1px solid #d7d1cc' }}
                        children={
                            <React.Fragment>
                                <p style={{ paddingLeft: 24, margin: '10px 0 0 0', float: 'left' }}>
                                    {locale.form.asset.assetType.addNewLabel}
                                </p>{' '}
                                <IconButton
                                    style={{ float: 'right' }}
                                    onClick={closeAssetTypeDialog}
                                    aria-label="Click to close asset type dialog"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </React.Fragment>
                        }
                    />
                    <DialogContent>
                        <Grid
                            container
                            spacing={0}
                            style={{
                                backgroundColor: '#000020 !important',
                                color: '#FFFFFF !important',
                                padding: 20,
                            }}
                        >
                            <Grid item xs={12} style={{ padding: '8px 0' }}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <TextField
                                        id="asset_type_name"
                                        data-testid="asset_type_name_field"
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        onChange={handleChange('asset_type_name')}
                                        label="Asset type name"
                                        required
                                        value={formValues?.asset_type_name ?? ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} style={{ padding: '8px 0' }}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <TextField
                                        id="asset_type_class"
                                        data-testid="asset_type_class"
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        onChange={handleChange('asset_type_class')}
                                        label="Asset type class"
                                        value={formValues?.asset_type_class ?? ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} style={{ padding: '8px 0' }}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <TextField
                                        id="asset_type_power_rating"
                                        data-testid="asset_type_power_rating"
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        onChange={handleChange('asset_type_power_rating')}
                                        label="Asset type power rating"
                                        value={formValues?.asset_type_power_rating ?? ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} style={{ padding: '8px 0' }}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <TextField
                                        id="asset_type"
                                        data-testid="asset_type"
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        onChange={handleChange('asset_type')}
                                        label="Asset type (a longer version of the name, if needed)"
                                        value={formValues?.asset_type ?? ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} style={{ padding: '8px 0' }}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <TextField
                                        id="asset_type_notes"
                                        data-testid="asset_type_notes"
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        onChange={handleChange('asset_type_notes')}
                                        label="Notes"
                                        value={formValues?.asset_type_notes ?? ''}
                                        multiline
                                        rows={4}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions style={{ borderTop: '1px solid #d7d1cc' }}>
                        <Box display={'flex'} justifyContent={'flex-end'} style={{ paddingRight: 24, margin: 0 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!assetTypeValid || saveAssetTypeSaving}
                                onClick={saveAssetTypeAndReload}
                                fullWidth={isMobileView}
                                data-testid="testntagAssetTypeSubmitButton"
                            >
                                {saveAssetTypeSaving ? (
                                    <CircularProgress
                                        color="inherit"
                                        size={25}
                                        id="saveInspectionSpinner"
                                        data-testid="saveInspectionSpinner"
                                    />
                                ) : (
                                    locale.form.buttons.save
                                )}
                            </Button>
                        </Box>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
    return null;
};

export default React.memo(AssetTypeDialogPopup);
