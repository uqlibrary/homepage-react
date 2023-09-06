import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    contentRequired: {
        color: '#990000',
        paddingTop: 10,
        display: 'block',
        fontSize: 14,
    },
    saveButton: {
        '&:disabled': {
            color: 'rgba(0, 0, 0, 0.26)',
            boxShadow: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
        },
    },
    previewButton: {
        marginRight: 10,
    },
    checkbox: {
        paddingLeft: 0,
        '&.Mui-checked': {
            color: 'black',
        },
    },
    promoPanelForm: {
        '& label': {
            minHeight: '1.1em',
        },
    },
    errorStyle: {
        color: '#c80000',
        marginTop: 3,
        fontSize: '0.75rem',
    },
    typingArea: {
        '& textarea ': {
            backgroundColor: 'rgb(236, 236, 236, 0.5)',
            borderRadius: 4,
            padding: 10,
        },
        '& label': {
            color: '#000',
            paddingLeft: 10,
            paddingTop: 10,
        },
    },
    charactersRemaining: {
        textAlign: 'right',
        color: '#504e4e',
        fontSize: '0.8em',
    },
}));

export const PromoPanelContentButtons = ({
    values,
    isEdit,
    promoPanelSaving,
    previewPromoPanel,
    navigateToListPage,
    confirmSavePromo,
    savePromoPanel,
}) => {
    const classes = useStyles();
    return (
        <>
            <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                <Grid item xs={3} align="left">
                    <Button
                        color="secondary"
                        children="Cancel"
                        data-testid="admin-promopanel-form-button-cancel"
                        onClick={() => navigateToListPage()}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={9} align="right">
                    <Button
                        color="primary"
                        data-testid="admin-promopanel-form-button-preview"
                        variant="contained"
                        children={'Preview'}
                        disabled={
                            !!!values.title || values.title.length < 1 || !!!values.content || values.content.length < 1
                        }
                        onClick={previewPromoPanel}
                        className={classes.previewButton}
                    />
                    <Button
                        color="primary"
                        data-testid="admin-promopanel-form-button-save"
                        variant="contained"
                        children={isEdit ? 'Save' : 'Create'}
                        disabled={
                            promoPanelSaving ||
                            !!!values.title ||
                            values.title.length < 1 ||
                            !!!values.content ||
                            values.content.length < 1
                        }
                        onClick={values.is_default_panel ? confirmSavePromo : savePromoPanel}
                        className={classes.saveButton}
                    />
                </Grid>
            </Grid>
        </>
    );
};

PromoPanelContentButtons.propTypes = {
    values: PropTypes.object,
    promoPanelSaving: PropTypes.bool,
    isEdit: PropTypes.bool,
    previewPromoPanel: PropTypes.func,
    navigateToListPage: PropTypes.func,
    confirmSavePromo: PropTypes.func,
    savePromoPanel: PropTypes.func,
};

PromoPanelContentButtons.defaultProps = {};

export default PromoPanelContentButtons;
