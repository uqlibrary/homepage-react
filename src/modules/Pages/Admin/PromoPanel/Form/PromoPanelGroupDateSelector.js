/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'html-react-parser';
import Button from '@material-ui/core/Button';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
// import { formatDate } from '../Spotlights/spotlighthelpers';

const moment = require('moment');

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const useStyles = makeStyles(theme => ({
    contentBox: {
        minWidth: '90%',
        paddingTop: 20,
        '& img': {
            maxWidth: 800,
            height: 800,
            border: '1px solid grey',
            textAlign: 'center',
        },
        '& li': {
            marginBottom: 10,
            padding: 10,
            '&:hover': {
                backgroundColor: theme.palette.secondary.main,
                transition: 'background-color 1s ease',
            },
            '& p': {
                marginBottom: 0,
                marginTop: 1,
            },
        },
        '& [aria-labelledby="lightboxTitle"]': {
            color: 'blue',
        },
    },
    dialogPaper: {
        // make the block take up more of the page
        width: 500,
    },
    link: {
        marginBottom: 10,
        marginRight: 10,
        cursor: 'pointer',
    },
}));
export const PromoPanelGroupDateSelector = ({
    isEditingDate,
    defaultStartDate,
    defaultEndDate,
    handleCloseGroupDate,
    handleSaveGroupDate,
    scheduleChangeIndex,
}) => {
    const classes = useStyles();

    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);

    useEffect(() => {
        setStartDate(defaultStartDate);
        setEndDate(defaultEndDate);
    }, [defaultStartDate, defaultEndDate]);

    const handleChange = event => value => {
        event === 'start'
            ? setStartDate(value.format('YYYY-MM-DD HH:mm'))
            : setEndDate(value.format('YYYY-MM-DD HH:mm'));
    };

    const handleGroupDateClose = () => {
        handleCloseGroupDate();
    };

    const handleGroupDateSave = () => {
        handleSaveGroupDate(scheduleChangeIndex, { start: startDate, end: endDate });
    };

    return (
        <React.Fragment>
            <Dialog
                open={isEditingDate}
                aria-labelledby="lightboxTitle"
                PaperProps={{ classes: { root: classes.dialogPaper } }}
            >
                <DialogTitle
                    id="lightboxTitle"
                    data-testid="panel-edit-date-title"
                    style={{ position: 'relative', borderBottom: '1px solid #d7d1cc', fontSize: 12 }}
                    children={<p style={{ lineHeight: 1, margin: 0 }}>{'Edit Schedule Dates'}</p>}
                />
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs>
                            <KeyboardDateTimePicker
                                id="admin-promopanel-group-start-date"
                                data-testid="admin-promopanel-group-start-date"
                                value={startDate}
                                label="Start date"
                                onChange={handleChange('start')}
                                minDate={startDate}
                                format="DD/MM/YYYY HH:mm a"
                                showTodayButton
                                todayLabel={'Today'}
                                autoOk
                                KeyboardButtonProps={{
                                    'aria-label': 'Start Date',
                                }}
                            />
                            {moment(startDate).isBefore(moment().subtract(1, 'minutes')) && (
                                <div className={classes.errorStyle}>This date is in the past.</div>
                            )}
                        </Grid>
                        <Grid item xs>
                            <KeyboardDateTimePicker
                                id="admin-promopanel-group-end-date"
                                data-testid="admin-promopanel-group-end-date"
                                value={endDate}
                                label="End date"
                                onChange={handleChange('end')}
                                minDate={startDate}
                                format="DD/MM/YYYY HH:mm a"
                                showTodayButton
                                todayLabel={'Today'}
                                autoOk
                                KeyboardButtonProps={{
                                    'aria-label': 'Start Date',
                                }}
                            />
                            {moment(endDate).isBefore(moment().subtract(1, 'minutes')) && (
                                <div className={classes.errorStyle}>This date is in the past.</div>
                            )}
                        </Grid>
                    </Grid>

                    <Grid item xs={12} align="right">
                        <Button
                            style={{ marginTop: 10 }}
                            color="secondary"
                            children="Cancel"
                            data-testid="admin-promopanel-group-button-cancel"
                            variant="contained"
                            onClick={handleGroupDateClose}
                        />
                        <Button
                            style={{ marginTop: 10 }}
                            color="primary"
                            children="Save"
                            data-testid="admin-promopanel-group-button-save"
                            variant="contained"
                            onClick={handleGroupDateSave}
                        />
                    </Grid>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

PromoPanelGroupDateSelector.propTypes = {
    isEditingDate: PropTypes.bool,
    defaultStartDate: PropTypes.any,
    defaultEndDate: PropTypes.any,
    scheduleChangeIndex: PropTypes.number,
    handleCloseGroupDate: PropTypes.func,
    handleSaveGroupDate: PropTypes.func,
};

PromoPanelGroupDateSelector.defaultProps = {
    previewGroup: [],
    previewContent: '',
    helpButtonLabel: 'Help',
    helpContent: 'test',
    scheduleChangeIndex: null,
};

export default PromoPanelGroupDateSelector;
