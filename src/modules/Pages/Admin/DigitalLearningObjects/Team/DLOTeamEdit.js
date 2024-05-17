import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { useConfirmationState } from 'hooks';
import { getUserPostfix } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { fullPath } from 'config/routes';

const useStyles = makeStyles(theme => ({
    titleBlock: {
        '& p:first-child': {
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            fontSize: 16,
            '& a': {
                color: 'rgba(0, 0, 0, 0.87)',
                textDecoration: 'underline',
            },
        },
    },
}));

export const DLOTeamEdit = ({ actions, dlorTeam, dlorTeamItemLoading, dlorTeamItemError, account }) => {
    const { dlorTeamId } = useParams();
    const classes = useStyles();
    console.log('DLOTeamEdit', dlorTeamId, ' l=', dlorTeamItemLoading, '; e=', dlorTeamItemError, '; d=', dlorTeam);

    const [formValues, setFormValues] = React.useState(null);

    React.useEffect(() => {
        if (!!dlorTeam && !dlorTeamItemLoading && !dlorTeamItemError) {
            setFormValues(dlorTeam);
        }
    }, [dlorTeam, dlorTeamItemLoading, dlorTeamItemError]);

    React.useEffect(() => {
        if (!!dlorTeamId) {
            actions.loadADLORTeam(dlorTeamId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dlorTeamId]);

    const adminHomepageLink = () => {
        const userString = getUserPostfix();
        return `${fullPath}/admin/dlor${userString}`;
    };

    const handleChange = (prop, value) => e => {
        console.log('handleChange', prop, e.target);
    };

    const saveChanges = () => {
        console.log('saveChanges', dlorTeamId, formValues);
        actions.updateDlorTeam(dlorTeamId, formValues);
    };

    return (
        <StandardPage title="Digital learning hub - Team Management">
            <Grid container spacing={2} style={{ marginBottom: 25 }}>
                <Grid item xs={12}>
                    <div className={classes.titleBlock}>
                        <Typography component={'p'} variant={'h6'} data-testid="dlor-detailpage-sitelabel">
                            <ArrowBackIcon fontSize="small" />{' '}
                            <a href={adminHomepageLink()}>Digital learning hub admin</a>
                        </Typography>
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {(() => {
                    if (!!dlorTeamItemLoading) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <div style={{ minHeight: 600 }}>
                                    <InlineLoader message="Loading" />
                                </div>
                            </Grid>
                        );
                    } else if (!!dlorTeamItemError) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <Typography variant="body1" data-testid="dlor-teamItem-error">
                                    {dlorTeamItemError}
                                </Typography>
                            </Grid>
                        );
                    } else {
                        return (
                            <>
                                <Grid item xs={12} data-testid="dlor-team-item-list">
                                    <Grid container key={`list-team-${dlorTeam?.team_id}`}>
                                        <form id="dlor-editTeam-form" style={{ width: '100%' }}>
                                            {/* <Grid item xs={12}>*/}
                                            {/*    <p>{dlorTeam?.team_id}</p>*/}
                                            {/* </Grid>*/}
                                            <Grid item xs={12}>
                                                <FormControl variant="standard" fullWidth>
                                                    <InputLabel htmlFor="team_name">Team name *</InputLabel>
                                                    <Input
                                                        id="team_name"
                                                        data-testid="team_name"
                                                        required
                                                        value={formValues?.team_name || ''}
                                                        onChange={handleChange('team_name')}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl variant="standard" fullWidth>
                                                    <InputLabel htmlFor="team_manager">Name of Team Manager</InputLabel>
                                                    <Input
                                                        id="team_manager"
                                                        data-testid="team_manager"
                                                        value={formValues?.team_manager || ''}
                                                        onChange={handleChange('team_manager')}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl variant="standard" fullWidth>
                                                    <InputLabel htmlFor="team_email">
                                                        Email address to contact team
                                                    </InputLabel>
                                                    <Input
                                                        id="team_email"
                                                        data-testid="team_email"
                                                        value={formValues?.team_email || ''}
                                                        onChange={handleChange('team_email')}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </form>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} align="right">
                                    <Button
                                        color="primary"
                                        data-testid="admin-dlor-save-button-submit"
                                        variant="contained"
                                        children="Save"
                                        // disabled={!isFormValid}
                                        onClick={saveChanges}
                                        // className={classes.saveButton}
                                    />
                                </Grid>
                            </>
                        );
                    }
                })()}
            </Grid>
        </StandardPage>
    );
};

DLOTeamEdit.propTypes = {
    actions: PropTypes.any,
    dlorTeam: PropTypes.object,
    dlorTeamItemLoading: PropTypes.bool,
    dlorTeamItemError: PropTypes.any,
    account: PropTypes.object,
};

export default DLOTeamEdit;
