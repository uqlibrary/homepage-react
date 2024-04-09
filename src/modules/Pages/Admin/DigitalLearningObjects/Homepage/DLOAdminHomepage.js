import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { getUserPostfix } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { fullPath } from 'config/routes';

const useStyles = makeStyles(theme => ({}));

const navigateToAddPage = () => {
    const userString = getUserPostfix();
    window.location.href = `${fullPath}/admin/dlor/add${userString}`;
};

export const DLOAdminHomepage = ({ actions }) => {
    const classes = useStyles();

    return (
        <StandardPage title="Digital learning hub Management">
            <StandardCard>
                <Grid container spacing={2}>
                    <Grid item xs={10} />
                    <Grid item xs={2}>
                        <Button
                            children="Add object"
                            color="primary"
                            data-testid="admin-dlor-visit-add-button"
                            onClick={() => navigateToAddPage()}
                            variant="contained"
                        />
                    </Grid>
                </Grid>
            </StandardCard>
        </StandardPage>
    );
};

DLOAdminHomepage.propTypes = {
    actions: PropTypes.any,
};

export default DLOAdminHomepage;
