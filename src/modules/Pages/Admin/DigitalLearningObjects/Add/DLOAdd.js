import React from 'react';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
// import { makeStyles } from '@mui/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

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

export const DLOAdd = (
    {
        // actions,
        // dlorItemCreating,
        // dlorItemError,
        // dlorItem
    },
) => {
    // const classes = useStyles();
    return (
        <StandardPage title="DLOR Management">
            <StandardCard title="Create Dlor">
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl
                                variant="standard"
                                fullWidth
                                // className={classes.typingArea}
                            >
                                <InputLabel htmlFor="object_title">Dlor title</InputLabel>
                                <Input
                                    id="object_title"
                                    // onChange={handleChange('object_title')}
                                    // value={values.object_title}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl
                                variant="standard"
                                // className={classes.typingArea}
                                fullWidth
                                // title={locale.form.tooltips.adminNotesField}
                            >
                                <InputLabel htmlFor="object_description">Description of Object</InputLabel>
                                <Input
                                    id="object_description"
                                    multiline
                                    // onChange={handleChange('admin_notes')}
                                    rows={6}
                                    // value={values.admin_notes}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl
                                variant="standard"
                                // className={classes.typingArea}
                                fullWidth
                                // title={locale.form.tooltips.adminNotesField}
                            >
                                <InputLabel htmlFor="object_summary">Summary of Object</InputLabel>
                                <Input
                                    id="object_summary"
                                    multiline
                                    // onChange={handleChange('admin_notes')}
                                    rows={2}
                                    // value={values.admin_notes}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl
                                variant="standard"
                                // className={classes.typingArea}
                                fullWidth
                                // title={locale.form.tooltips.adminNotesField}
                            >
                                <FormLabel id="object_embed_type_label">Object inclusion type</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-object_embed_type_label-group-label"
                                    defaultValue="link"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="link" control={<Radio />} label="Link" />
                                    <FormControlLabel value="embed" control={<Radio />} label="Embedded" disabled />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3} align="left">
                            <Button
                                color="secondary"
                                children="Cancel"
                                data-testid="admin-alerts-form-button-cancel"
                                onClick={() => navigateToListPage()}
                                variant="contained"
                            />
                        </Grid>
                        <Grid item xs={9} align="right">
                            <Button
                                color="primary"
                                data-testid="admin-alerts-form-button-save"
                                variant="contained"
                                children="Save"
                                // disabled={!isFormValid}
                                // onClick={saveAlerts}
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
