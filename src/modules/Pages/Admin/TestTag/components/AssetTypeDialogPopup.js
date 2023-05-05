import React from 'react';
import PropTypes from 'prop-types';

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

const AssetTypeDialogPopup = props => {
    AssetTypeDialogPopup.propTypes = {
        isAssetTypeDialogOpen: PropTypes.bool.isRequired,
        assetTypeValid: PropTypes.bool.isRequired,
        setAssetTypeValid: PropTypes.func.isRequired,
        saveAssetType: PropTypes.func.isRequired,
        setAssetTypeDialogOpen: PropTypes.func.isRequired,
        handleChange: PropTypes.func.isRequired,
        saveAssetTypeSaving: PropTypes.bool,
        isMobileView: PropTypes.bool,
        classes: PropTypes.object.isRequired,
    };
    AssetTypeDialogPopup.defaultProps = {
        isMobileView: false,
    };
    const {
        isAssetTypeDialogOpen,
        assetTypeValid,
        setAssetTypeValid,
        saveAssetType,
        setAssetTypeDialogOpen,
        handleChange,
        saveAssetTypeSaving,
        isMobileView,
        classes,
    } = props;
    const closeAssetTypeDialog = () => {
        setAssetTypeDialogOpen(false);
    };
    if (!!isAssetTypeDialogOpen) {
        return (
            <Dialog
                onClose={/* istanbul ignore next */ () => closeAssetTypeDialog()}
                aria-label="Asset Type Editor"
                role="dialog"
                open={!!isAssetTypeDialogOpen}
                // maxWidth={'sx'}
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
                    // id="lightboxTitle"
                    // data-testid="panel-save-or-schedule-title"
                    style={{ borderBottom: '1px solid #d7d1cc' }}
                    children={
                        <React.Fragment>
                            <p style={{ paddingLeft: 24, margin: '10px 0 0 0', float: 'left' }}>Add an Asset type</p>{' '}
                            <IconButton
                                style={{ float: 'right' }}
                                // id="asset-type-dialog-close-button"
                                // data-testid="asset-type-dialog-close-button"
                                // data-analyticsid="asset-type-dialog-close-button"
                                onClick={() => closeAssetTypeDialog()}
                                aria-label="Click to close asset type dialog"
                                // style={{ color: 'white', marginTop: -16 }}
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
                        {/* <Grid item xs={12} style={{ padding: '8px 0' }}>*/}
                        {/*    asset_type_id*/}
                        {/* </Grid>*/}
                        <Grid item xs={12} style={{ padding: '8px 0' }}>
                            <FormControl className={classes.formControl} fullWidth>
                                <TextField
                                    id="asset_type_name"
                                    data-testid="asset_type_name"
                                    variant="standard"
                                    InputProps={{ fullWidth: true }}
                                    onChange={() => {
                                        handleChange();
                                        setAssetTypeValid(true);
                                    }}
                                    // updateKey="asset_type_name"
                                    label="Asset type name"
                                    required
                                    // InputLabelProps={{ htmlFor: 'asset_type_name-input' }}
                                    // {...locale.form.inspection.inspectionNotes}
                                    // disabled={disabled}
                                    // value={formValues?.inspection_notes ?? ''}
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
                                    onChange={handleChange}
                                    // updateKey="asset_type_class"
                                    label="Asset type class"
                                    // InputLabelProps={{ htmlFor: `${rest.id ?? ''}-input` }}
                                    // {...locale.form.inspection.inspectionNotes}
                                    // disabled={disabled}
                                    // value={formValues?.inspection_notes ?? ''}
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
                                    onChange={handleChange}
                                    // updateKey="asset_type_power_rating"
                                    label="Asset type power rating"
                                    // InputLabelProps={{ htmlFor: `${rest.id ?? ''}-input` }}
                                    // {...locale.form.inspection.inspectionNotes}
                                    // disabled={disabled}
                                    // value={formValues?.inspection_notes ?? ''}
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
                                    onChange={handleChange}
                                    // updateKey="asset_type"
                                    label="Asset type (a longer version of the name, if needed)"
                                    // InputLabelProps={{ htmlFor: `${rest.id ?? ''}-input` }}
                                    // {...locale.form.inspection.inspectionNotes}
                                    // disabled={disabled}
                                    // value={formValues?.inspection_notes ?? ''}
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
                                    onChange={handleChange}
                                    // updateKey="asset_type_notes"
                                    label="Notes"
                                    // InputLabelProps={{ htmlFor: `${rest.id ?? ''}-input` }}
                                    // {...locale.form.inspection.inspectionNotes}
                                    // disabled={disabled}
                                    // value={formValues?.inspection_notes ?? ''}
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
                            onClick={saveAssetType}
                            fullWidth={isMobileView}
                            id="testntagFormSubmitButton"
                            data-testid="testntagFormSubmitButton"
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
        );
    }
    return null;
};

export default React.memo(AssetTypeDialogPopup);
