import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(() => ({
    '&.saveButton': {
        '&:disabled': {
            color: 'rgba(0, 0, 0, 0.26)',
            boxShadow: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
        },
    },
    '&.previewButton': {
        marginRight: 10,
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
                    <StyledButton
                        color="primary"
                        data-testid="admin-promopanel-form-button-preview"
                        variant="contained"
                        children={'Preview'}
                        disabled={
                            !!!values.title || values.title.length < 1 || !!!values.content || values.content.length < 1
                        }
                        onClick={previewPromoPanel}
                        className={'previewButton'}
                    />
                    <StyledButton
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
                        className={'saveButton'}
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

export default PromoPanelContentButtons;
