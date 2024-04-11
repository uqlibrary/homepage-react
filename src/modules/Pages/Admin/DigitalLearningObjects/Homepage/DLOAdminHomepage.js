import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

const useStyles = makeStyles(theme => ({
    sidebyside: {
        display: 'flex',
        justifyContent: 'space-between',
    },
}));

export const DLOAdminHomepage = ({ actions, dlorList, dlorListLoading, dlorListError, account }) => {
    const classes = useStyles();

    React.useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
        }
    }, [dlorList]);

    const navigateToAddPage = () => {
        const userString = getUserPostfix();
        window.location.href = `${fullPath}/admin/dlor/add${userString}`;
    };

    return (
        <StandardPage title="Digital learning hub Management">
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
            <Grid container spacing={2}>
                {(() => {
                    if (!!dlorListLoading) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <div style={{ minHeight: 600 }}>
                                    <InlineLoader message="Loading" />
                                </div>
                            </Grid>
                        );
                    } else if (!!dlorListError) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <Typography variant="body1" data-testid="dlor-homepage-error">
                                    {dlorListError}
                                </Typography>
                            </Grid>
                        );
                    } else if (!dlorList || dlorList.length === 0) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <Typography variant="body1" data-testid="dlor-homepage-noresult">
                                    We did not find any entries in the system - please try again later.
                                </Typography>
                            </Grid>
                        );
                    } else {
                        return (
                            <>
                                {!!dlorList &&
                                    dlorList.length > 0 &&
                                    dlorList.map((o, index) => {
                                        return (
                                            <Grid
                                                item
                                                xs={12}
                                                className={classes.sidebyside}
                                                key={o?.object_id}
                                                data-testid={`dlor-homepage-panel-${o?.object_public_uuid}`}
                                            >
                                                <div>
                                                    <Typography component={'h2'} variant={'h6'}>
                                                        {o?.object_title}
                                                    </Typography>
                                                    <Typography variant={'p'}>
                                                        <p>{o?.object_summary}</p>
                                                    </Typography>
                                                </div>
                                                <IconButton onClick={() => navigateToEditPage(o?.object_public_uuid)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Grid>
                                        );
                                    })}
                            </>
                        );
                    }
                })()}
            </Grid>
        </StandardPage>
    );
};

DLOAdminHomepage.propTypes = {
    actions: PropTypes.any,
    dlorList: PropTypes.array,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
    account: PropTypes.object,
};

export default DLOAdminHomepage;
