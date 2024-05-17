import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useCookies } from 'react-cookie';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
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

export const DLOTeamEdit = ({ actions, dlorTeam, dlorTeamLoading, dlorTeamError, account }) => {
    const { dlorTeamId } = useParams();
    const classes = useStyles();
    const [cookies, setCookie] = useCookies();
    console.log('DLOTeamEdit', dlorTeamId, ' l=', dlorTeamLoading, '; e=', dlorTeamError, '; d=', dlorTeam);

    const [formValues, setFormValues] = React.useState(null);

    React.useEffect(() => {
        if (!!dlorTeam && !dlorTeamLoading && !dlorTeamError) {
            setFormValues({
                team_name: dlorTeam.team_name,
                team_manager: dlorTeam.team_manager,
                team_email: dlorTeam.team_email,
            });
        }
    }, [dlorTeam, dlorTeamLoading, dlorTeamError]);

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

    const teamManagementLink = () => {
        const userString = getUserPostfix();
        return `${fullPath}/admin/dlor/team/manage${userString}`;
    };

    const handleChange = (prop, value) => e => {
        console.log('handleChange', prop, e.target);
        const theNewValue = e.target.value;
        const newValues = { ...formValues, [prop]: theNewValue };
        setFormValues(newValues);
    };

    const saveChanges = () => {
        console.log('saveChanges', dlorTeamId, formValues);
        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', formValues);
        }

        actions.updateDlorTeam(dlorTeamId, formValues);
    };

    return (
        <StandardPage title="Digital learning hub - Edit Team">
            <Grid container spacing={2} style={{ marginBottom: 25 }}>
                <Grid item xs={12}>
                    <div className={classes.titleBlock}>
                        <Typography component={'p'} variant={'h6'} data-testid="dlor-detailpage-sitelabel">
                            <a data-testid="dlor-edit-form-homelink" href={adminHomepageLink()}>
                                Digital learning hub admin
                            </a>
                            <ArrowForwardIcon style={{ height: 15 }} />
                            <a data-testid="dlor-edit-form-tmlink" href={teamManagementLink()}>
                                Team management
                            </a>
                        </Typography>
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {(() => {
                    if (!!dlorTeamLoading || (!dlorTeamError && !dlorTeam)) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <div style={{ minHeight: 600 }}>
                                    <InlineLoader message="Loading" />
                                </div>
                            </Grid>
                        );
                    } else if (!!dlorTeamError) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <Typography variant="body1" data-testid="dlor-teamItem-error">
                                    {dlorTeamError}
                                </Typography>
                            </Grid>
                        );
                    } else if (!!dlorTeam) {
                        return (
                            <>
                                <Grid item xs={12} data-testid="dlor-team-item-list">
                                    <Grid container key={`list-team-${dlorTeam?.team_id}`}>
                                        <form id="dlor-editTeam-form" style={{ width: '100%' }}>
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
                                        data-testid="admin-dlor-teamedit-save-button"
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
    dlorTeamLoading: PropTypes.bool,
    dlorTeamError: PropTypes.any,
    account: PropTypes.object,
};

export default DLOTeamEdit;
