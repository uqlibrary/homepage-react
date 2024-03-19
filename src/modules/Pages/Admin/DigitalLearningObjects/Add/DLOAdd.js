import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
// import { makeStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { useConfirmationState } from 'hooks';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

// const useStyles = makeStyles(theme => ({
//     typingArea: {
//         '& textarea ': {
//             backgroundColor: 'rgb(236, 236, 236, 0.5)',
//             borderRadius: 4,
//             padding: 10,
//         },
//         '& label': {
//             color: theme.typography.caption.color,
//             paddingLeft: 10,
//             paddingTop: 10,
//         },
//     },
// }));

export const DLOAdd = ({
    actions,
    dlorItemCreating,
    dlorItemError,
    dlorItem,
    dlorTeam,
    dlorTeamLoading,
    dlorTeamError,
}) => {
    console.log('DLOAdd creating=', dlorItemCreating, '; error=', dlorItemError, '; response=', dlorItem);
    console.log('DLOAdd creating team=', dlorTeamLoading, '; error=', dlorTeamError, '; response=', dlorTeam);
    // const classes = useStyles();

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const [saveStatus, setSaveStatus] = useState(null);

    const [formValues, setFormValues] = useState({
        object_title: '',
        object_description: '',
        object_summary: '',
        object_owning_team_id: 1,
        object_embed_type: 'link',
    });

    useEffect(() => {
        if (!dlorTeamError && !dlorTeamLoading && !dlorTeam) {
            actions.loadOwningTeams();
        }
    }, []);

    useEffect(() => {
        console.log('useEffect dlorItem=', dlorItem, ';dlorItemError', dlorItemError);
        if ((!!dlorItem && !!dlorItem.data?.object_id) || !!dlorItemError) {
            console.log('useEffect showing conf');
            setSaveStatus('complete');
            showConfirmation();
        }
    }, [showConfirmation, dlorItem, dlorItemError]);

    // useEffect(() => {
    //     if (!!dlorTeam && dlorTeam.length > 0) {
    //         setFormValues({
    //             ...formValues,
    //             ['object_owning_team_id']: dlorTeam.filter((t, index) => index === 0),
    //         });
    //     }
    // }, [dlorTeam]);

    const saveNewAlert = () => {
        return actions.createDLor();
    };

    const locale = {
        successMessage: {
            confirmationTitle: 'The object has been created',
            confirmationMessage: '',
            confirmButtonLabel: 'Return to list page',
        },
        errorMessage: {
            confirmationTitle: dlorItemError,
            confirmationMessage: '',
            confirmButtonLabel: 'Return to list page',
        },
    };

    const handleLeavePage = () => {
        window.alert('leave the page: TBA, where do we go on exit?');
    };

    if (!!dlorTeamError) {
        return (
            <StandardPage>
                <StandardCard>
                    {/* {getTitleBlock()}*/}
                    <Typography variant="body1" data-testid="dlor-addObject-error">
                        {dlorTeamError}
                    </Typography>
                </StandardCard>
            </StandardPage>
        );
    }

    return (
        <StandardPage title="DLOR Management">
            <StandardCard title="Create an Object for Digital learning objects">
                <form id="dlor-add-form">
                    {saveStatus === 'complete' && (
                        <ConfirmationBox
                            actionButtonColor="primary"
                            actionButtonVariant="contained"
                            confirmationBoxId="dlor-creation-outcome"
                            onAction={() => handleLeavePage()}
                            onClose={hideConfirmation}
                            hideCancelButton
                            isOpen={isOpen}
                            locale={!dlorItemError ? locale.successMessage : locale.errorMessage}
                        />
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl
                                variant="standard"
                                fullWidth
                                // className={classes.typingArea}
                            >
                                <InputLabel htmlFor="object_title">Object title</InputLabel>
                                <Input
                                    id="object_title"
                                    data-testid="object_title"
                                    // error={}
                                    required
                                    value={formValues?.object_title}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel htmlFor="object_description">Description of Object</InputLabel>
                                <Input
                                    id="object_description"
                                    data-testid="object_description"
                                    multiline
                                    required
                                    rows={6}
                                    value={formValues?.object_description}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl
                                variant="standard"
                                // className={classes.typingArea}
                                fullWidth
                            >
                                <InputLabel htmlFor="object_summary">Summary of Object</InputLabel>
                                <Input
                                    id="object_summary"
                                    data-testid="object_summary"
                                    multiline
                                    required
                                    rows={2}
                                    value={formValues?.object_summary}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl
                                variant="standard"
                                // className={classes.typingArea}
                                fullWidth
                            >
                                <FormLabel id="object_embed_type_label">Object inclusion type</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-object_embed_type_label-group-label"
                                    defaultValue="link"
                                    name="radio-buttons-group"
                                    value={formValues?.object_embed_type}
                                >
                                    <FormControlLabel value="link" control={<Radio />} label="Link" />
                                    <FormControlLabel value="embed" control={<Radio />} label="Embedded" disabled />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} style={{ minHeight: 95 }}>
                            <InputLabel id="object_owning_team_label">Owning Team</InputLabel>
                            {!!dlorTeam && (
                                <Select
                                    defaultValue={dlorTeam.filter((t, index) => index === 0)}
                                    value={formValues?.object_owning_team_id}
                                    aria-labelledby="object_owning_team_label"
                                    id="object_owning_team"
                                >
                                    {dlorTeam.map((t, index) => {
                                        console.log('index=', index);
                                        return (
                                            <MenuItem
                                                // selected={index === 0}
                                                key={t.team_id}
                                                value={t.team_id}
                                            >
                                                {t.team_name}
                                            </MenuItem>
                                        );
                                    })}
                                    <MenuItem disabled value="">
                                        Coming soon: create a team here
                                    </MenuItem>
                                </Select>
                            )}
                        </Grid>
                        <Grid item xs={3} align="left">
                            <Button
                                color="secondary"
                                children="Cancel"
                                data-testid="admin-dlor-add-button-cancel"
                                onClick={() => handleLeavePage()}
                                variant="contained"
                            />
                        </Grid>
                        <Grid item xs={9} align="right">
                            <Button
                                color="primary"
                                data-testid="admin-dlor-add-button-submit"
                                variant="contained"
                                children="Save"
                                // disabled={!isFormValid}
                                onClick={saveNewAlert}
                                // className={classes.saveButton}
                            />
                        </Grid>
                    </Grid>
                </form>
            </StandardCard>
        </StandardPage>
    );
};

export default DLOAdd;
