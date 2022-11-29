import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, useTheme } from '@material-ui/core';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Chip from '@material-ui/core/Chip';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const moment = require('moment');

const useTestPanelStyles = makeStyles(theme => ({
    card: props => ({
        borderColor: !props.pass ? theme.palette.error.main : theme.palette.success.main,
        [theme.breakpoints.down('xs')]: {
            borderTopWidth: 10,
        },
        [theme.breakpoints.up('sm')]: {
            borderLeftWidth: 10,
        },
    }),
    chip: props => ({
        backgroundColor: !props.pass ? theme.palette.error.main : theme.palette.success.main,
        color: theme.palette.primary.contrastText,
    }),
    chipIcon: {
        color: theme.palette.primary.contrastText,
    },
    pastTestLabel: {
        fontWeight: 'bold',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}));

const LastTestPanel = ({
    asset,
    currentLocation,
    dateFormatPattern,
    testStatusEnums,
    locale,
    disabled = false,
    forceOpen = false,
} = {}) => {
    LastTestPanel.propTypes = {
        asset: PropTypes.object.isRequired,
        currentLocation: PropTypes.object.isRequired,
        dateFormatPattern: PropTypes.string.isRequired,
        testStatusEnums: PropTypes.object.isRequired,
        locale: PropTypes.object.isRequired,
        disabled: PropTypes.bool,
        forceOpen: PropTypes.bool,
    };

    const {
        asset_status: assetStatus,
        last_location: lastLocation,
        last_test: lastTest,
        asset_next_test_due_date: nextTestDate,
    } = asset;
    const didPass = lastTest?.test_status === testStatusEnums.CURRENT.value;

    const theme = useTheme();
    const classes = useTestPanelStyles({ pass: didPass });
    const [testPanelExpanded, setTestPanelExpanded] = useState(!disabled);
    const [mismatchingLocation, setMismatchingLocation] = useState(false);

    useEffect(() => {
        console.log(
            'lasttestpanel',
            asset?.asset_id,
            currentLocation.formSiteId,
            currentLocation.formBuildingId,
            currentLocation.formFloorId,
            currentLocation.formRoomId,
        );
        if (!!asset?.asset_id) {
            setMismatchingLocation(
                currentLocation.formSiteId !== lastLocation?.site_id ||
                    currentLocation.formBuildingId !== lastLocation?.building_id ||
                    currentLocation.formFloorId !== lastLocation?.floor_id ||
                    currentLocation.formRoomId !== lastLocation?.room_id,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        asset?.asset_id,
        currentLocation.formSiteId,
        currentLocation.formBuildingId,
        currentLocation.formFloorId,
        currentLocation.formRoomId,
    ]);

    useEffect(() => {
        if (disabled) {
            setTestPanelExpanded(false);
        }
    }, [disabled]);

    return (
        <StandardCard
            variant="outlined"
            noPadding={!(forceOpen || testPanelExpanded)}
            title={
                <>
                    <Typography component={'span'} variant={'h6'} color={disabled ? 'textSecondary' : 'textPrimary'}>
                        {locale.title(disabled ? locale.statusUnavailableLabel : '')}
                    </Typography>
                    {!!!disabled && (
                        <>
                            <Chip
                                icon={
                                    didPass ? (
                                        <DoneIcon classes={{ root: classes.chipIcon }} />
                                    ) : (
                                        <ClearIcon classes={{ root: classes.chipIcon }} />
                                    )
                                }
                                classes={{ root: classes.chip }}
                                label={didPass ? testStatusEnums.CURRENT.label : testStatusEnums.FAILED.label}
                                component={'span'}
                            />
                            {!!mismatchingLocation && (
                                <ReportProblemOutlinedIcon style={{ color: theme.palette.warning.main }} />
                            )}
                        </>
                    )}
                </>
            }
            headerAction={
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: forceOpen || testPanelExpanded,
                    })}
                    aria-expanded={forceOpen || testPanelExpanded}
                    aria-label={locale.aria.collapseButtonLabel}
                    onClick={() => !forceOpen && setTestPanelExpanded(!testPanelExpanded)}
                    disabled={disabled}
                >
                    <ExpandMoreIcon />
                </IconButton>
            }
            className={!disabled ? classes.card : ''}
        >
            <Collapse in={forceOpen || testPanelExpanded} timeout="auto">
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography component={'span'} className={classes.pastTestLabel}>
                            {locale.statusLabel}
                        </Typography>
                        <Typography component={'span'}>
                            {assetStatus?.toUpperCase() ?? locale.statusUnknownLabel}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography component={'span'} className={classes.pastTestLabel}>
                            {locale.testDateLabel}
                        </Typography>
                        <Typography component={'span'}>
                            {!!lastTest?.test_date && moment(lastTest.test_date).format(dateFormatPattern)}
                        </Typography>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} sm={6} lg={!!mismatchingLocation ? 2 : 3}>
                            <Typography component={'span'} className={classes.pastTestLabel}>
                                {locale.siteLabel}
                            </Typography>
                            <Typography component={'span'}>{lastLocation?.site_id_displayed}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <Typography component={'span'} className={classes.pastTestLabel}>
                                {locale.buildingLabel}
                            </Typography>
                            <Typography component={'span'}>{lastLocation?.building_id_displayed}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={!!mismatchingLocation ? 2 : 3}>
                            <Typography component={'span'} className={classes.pastTestLabel}>
                                {locale.floorLabel}
                            </Typography>
                            <Typography component={'span'}>{lastLocation?.floor_id_displayed}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={!!mismatchingLocation ? 2 : 3}>
                            <Typography component={'span'} className={classes.pastTestLabel}>
                                {locale.roomLabel}
                            </Typography>
                            <Typography component={'span'}>{lastLocation?.room_id_displayed}</Typography>
                        </Grid>
                        {!!mismatchingLocation && (
                            <Grid item xs={12} lg={3}>
                                <ReportProblemOutlinedIcon
                                    style={{
                                        color: theme.palette.warning.main,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    fontSize="small"
                                />
                                <Typography
                                    component={'span'}
                                    className={classes.pastTestLabel}
                                    style={{ color: theme.palette.warning.main }}
                                >
                                    {locale.alertLocationMismatch}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                    {!didPass && (
                        <Grid item xs={12}>
                            <Typography component={'p'} className={classes.pastTestLabel}>
                                {locale.failReasonLabel}
                            </Typography>
                            <Typography component={'p'}>{lastTest?.test_fail_reason ?? locale.labelNone}</Typography>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Typography component={'p'} className={classes.pastTestLabel}>
                            {locale.testNotesLabel}
                        </Typography>
                        <Typography component={'p'}>{lastTest?.test_notes ?? locale.labelNone}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography component={'span'} className={classes.pastTestLabel}>
                            {locale.nextTestDateLabel}
                        </Typography>
                        <Typography component={'span'}>
                            {!!nextTestDate && moment(nextTestDate).format(dateFormatPattern)}
                        </Typography>
                    </Grid>
                </Grid>
            </Collapse>
        </StandardCard>
    );
};

export default React.memo(LastTestPanel);
