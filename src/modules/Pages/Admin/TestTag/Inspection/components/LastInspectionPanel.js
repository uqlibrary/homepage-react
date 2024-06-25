import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Chip from '@mui/material/Chip';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { isEmptyStr } from '../../helpers/helpers';
import locale from '../../testTag.locale';
import { statusEnum } from '../utils/helpers';

const moment = require('moment');
const testStatusEnum = statusEnum(locale.pages.inspect.config);

const componentId = 'last_inspection_panel';

const StyledChip = styled(Chip, {
    shouldForwardProp: prop => prop !== 'pass',
})(({ theme, pass }) => ({
    backgroundColor: !pass ? theme.palette.error.main : theme.palette.success.main,
    color: theme.palette.primary.contrastText,
    marginRight: theme.spacing(1),

    '& .MuiChip-icon': {
        color: theme.palette.primary.contrastText,
    },
}));

const StyledStandardCard = styled(StandardCard, {
    shouldForwardProp: prop => prop !== 'pass',
})(({ theme, pass }) => ({
    '&.card': {
        marginTop: theme.spacing(2),
    },
    '&.cardActive': {
        borderColor: !pass ? theme.palette.error.main : theme.palette.success.main,
        [theme.breakpoints.down('sm')]: {
            borderTopWidth: 10,
        },
        [theme.breakpoints.up('sm')]: {
            borderLeftWidth: 10,
        },
    },

    '& .title': {
        display: 'block',
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            display: 'inline',
            width: 'auto',
            paddingRight: theme.spacing(1),
        },
        [theme.breakpoints.down('sm')]: {
            paddingBottom: theme.spacing(1),
        },
    },

    '& .problemIconInline': {
        color: theme.palette.warning.main,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

const LastInspectionPanel = ({ asset, currentLocation, dateFormatPattern, disabled = false, forceOpen = false }) => {
    const formLocale = locale.pages.inspect.form.lastInspectionPanel;

    const {
        asset_status: assetStatus,
        last_location: lastLocation,
        last_inspection: lastTest,
        asset_next_test_due_date: nextTestDate,
        last_repair: lastRepair,
        last_discard: lastDiscard,
    } = asset;
    const didPass = lastTest?.inspect_status === testStatusEnum.PASSED.value;
    const isRepair = !isEmptyStr(lastRepair?.repair_date);
    const isDiscard = !isEmptyStr(lastDiscard?.discard_date);
    const theme = useTheme();

    const [testPanelExpanded, setTestPanelExpanded] = React.useState(!disabled);
    const [mismatchingLocation, setMismatchingLocation] = useState(false);

    useEffect(() => {
        /* istanbul ignore else */ if (!!asset?.asset_id) {
            setMismatchingLocation(
                currentLocation.site !== lastLocation?.site_id ||
                    currentLocation.building !== lastLocation?.building_id ||
                    currentLocation.floor !== lastLocation?.floor_id ||
                    currentLocation.room !== lastLocation?.room_id,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [asset?.asset_id, currentLocation.site, currentLocation.building, currentLocation.floor, currentLocation.room]);

    useEffect(() => {
        if (disabled) {
            setTestPanelExpanded(false);
        }
    }, [disabled]);

    return (
        <StyledStandardCard
            standardCardId={componentId}
            variant="outlined"
            noPadding={!(forceOpen || testPanelExpanded)}
            pass={didPass}
            title={
                <Box display="flex" flexWrap="wrap" alignItems="center">
                    <Typography
                        component={'span'}
                        variant={'h6'}
                        color={disabled ? 'textSecondary' : 'textPrimary'}
                        className={'title'}
                        id={`${componentId}-header-text`}
                        data-testid={`${componentId}-header-text`}
                    >
                        {asset.asset_id_displayed} {formLocale.title(disabled ? formLocale.statusUnavailableLabel : '')}
                    </Typography>
                    {!!!disabled && (
                        <>
                            <StyledChip
                                pass={didPass}
                                id={`${componentId}-header-${didPass ? 'pass' : 'fail'}-chip`}
                                data-testid={`${componentId}-header-${didPass ? 'pass' : 'fail'}-chip`}
                                icon={didPass ? <DoneIcon /> : <ClearIcon />}
                                label={didPass ? testStatusEnum.PASSED.label : testStatusEnum.FAILED.label}
                                component={'span'}
                            />
                            {!!mismatchingLocation && (
                                <Tooltip
                                    title={formLocale.alertLocationMismatch}
                                    id={`${componentId}-header-mismatch-tooltip`}
                                    data-testid={`${componentId}-header-mismatch-tooltip`}
                                    placement="bottom"
                                    TransitionProps={{ timeout: 300 }}
                                >
                                    <ReportProblemOutlinedIcon
                                        style={{ color: theme.palette.warning.main }}
                                        id={`${componentId}-header-mismatch-icon`}
                                        data-testid={`${componentId}-header-mismatch-icon`}
                                        aria-label={formLocale.alertLocationMismatch}
                                    />
                                </Tooltip>
                            )}
                        </>
                    )}
                </Box>
            }
            headerAction={
                <IconButton
                    id={`${componentId}-expand-button`}
                    data-testid={`${componentId}-expand-button`}
                    className={`expand${forceOpen || testPanelExpanded ? ' expandOpen' : ''}`}
                    aria-expanded={forceOpen || testPanelExpanded}
                    aria-label={formLocale.aria.collapseButtonLabel}
                    onClick={() => !forceOpen && setTestPanelExpanded(!testPanelExpanded)}
                    disabled={disabled}
                    size="large"
                >
                    <ExpandMoreIcon />
                </IconButton>
            }
            style={{ marginBottom: 30 }}
            className={`card${!disabled ? ' cardActive' : ''}`}
        >
            <Collapse in={forceOpen || testPanelExpanded} timeout="auto">
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography component={'span'} className={'pastTestLabel'}>
                            {formLocale.statusLabel}
                        </Typography>
                        <Typography
                            component={'span'}
                            id={`${componentId}-status`}
                            data-testid={`${componentId}-status`}
                        >
                            {assetStatus?.toUpperCase() ?? formLocale.statusUnknownLabel}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography component={'span'} className={'pastTestLabel'}>
                            {formLocale.testDateLabel}
                        </Typography>
                        <Typography component={'span'} id={`${componentId}-date`} data-testid={`${componentId}-date`}>
                            {!!lastTest?.inspect_date && moment(lastTest.inspect_date).format(dateFormatPattern)}
                        </Typography>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} sm={6}>
                            <Typography component={'span'} sx={{ fontWeight: 'bold' }}>
                                {formLocale.siteLabel}
                            </Typography>
                            <Typography
                                component={'span'}
                                id={`${componentId}-site`}
                                data-testid={`${componentId}-site`}
                            >
                                {lastLocation?.site_id_displayed ?? ''}
                                {lastLocation?.site_id_displayed ? ' - ' : ''}
                                {lastLocation?.site_name ?? ''}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography component={'span'} sx={{ fontWeight: 'bold' }}>
                                {formLocale.buildingLabel}
                            </Typography>
                            <Typography
                                component={'span'}
                                id={`${componentId}-building`}
                                data-testid={`${componentId}-building`}
                            >
                                {lastLocation?.building_id_displayed ?? ''}
                                {lastLocation?.building_id_displayed ? ' - ' : ''}
                                {lastLocation?.building_name ?? ''}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography component={'span'} sx={{ fontWeight: 'bold' }}>
                                {formLocale.floorLabel}
                            </Typography>
                            <Typography
                                component={'span'}
                                id={`${componentId}-floor`}
                                data-testid={`${componentId}-floor`}
                            >
                                {lastLocation?.floor_id_displayed}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={!!mismatchingLocation ? 2 : 3}>
                            <Typography component={'span'} sx={{ fontWeight: 'bold' }}>
                                {formLocale.roomLabel}
                            </Typography>
                            <Typography
                                component={'span'}
                                id={`${componentId}-room`}
                                data-testid={`${componentId}-room`}
                            >
                                {lastLocation?.room_id_displayed}
                            </Typography>
                        </Grid>
                        {!!mismatchingLocation && (
                            <Grid item xs={12} lg={6}>
                                <Box display={'flex'}>
                                    <ReportProblemOutlinedIcon
                                        className={'problemIconInline'}
                                        fontSize="small"
                                        id={`${componentId}-mismatch-icon`}
                                        data-testid={`${componentId}-mismatch-icon`}
                                        aria-label={formLocale.alertLocationMismatch}
                                    />
                                    <Typography
                                        component={'span'}
                                        sx={{ fontWeight: 'bold' }}
                                        style={{ color: theme.palette.warning.main, paddingLeft: theme.spacing(1) }}
                                        id={`${componentId}-mismatch-text`}
                                        data-testid={`${componentId}-mismatch-text`}
                                    >
                                        {formLocale.alertLocationMismatch}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                    {!didPass && (
                        <Grid item xs={12}>
                            <Typography component={'p'} sx={{ fontWeight: 'bold' }}>
                                {formLocale.failReasonLabel}
                            </Typography>
                            <Typography
                                component={'p'}
                                id={`${componentId}-fail-reason`}
                                data-testid={`${componentId}-fail-reason`}
                            >
                                {lastTest?.inspect_fail_reason ?? formLocale.noneLabel}
                            </Typography>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Typography component={'p'} sx={{ fontWeight: 'bold' }}>
                            {formLocale.testNotesLabel}
                        </Typography>
                        <Typography
                            component={'p'}
                            id={`${componentId}-test-notes`}
                            data-testid={`${componentId}-test-notes`}
                        >
                            {lastTest?.inspect_notes ?? formLocale.noneLabel}
                        </Typography>
                    </Grid>
                    {didPass && (
                        <Grid item xs={12}>
                            <Typography component={'span'} sx={{ fontWeight: 'bold' }}>
                                {formLocale.nextTestDateLabel}
                            </Typography>
                            <Typography
                                component={'span'}
                                id={`${componentId}-next-inspection-date`}
                                data-testid={`${componentId}-next-inspection-date`}
                            >
                                {moment(nextTestDate).format(dateFormatPattern)}
                            </Typography>
                        </Grid>
                    )}
                    {!!isRepair && (
                        <Grid item xs={12}>
                            <Typography component={'p'} sx={{ fontWeight: 'bold' }}>
                                {formLocale.repairDetailsLabel}
                            </Typography>
                            <Typography
                                component={'p'}
                                id={`${componentId}-repairer-name`}
                                data-testid={`${componentId}-repairer-name`}
                            >
                                {lastRepair?.repairer_name}
                            </Typography>
                        </Grid>
                    )}
                    {!!isDiscard && (
                        <Grid item xs={12}>
                            <Typography component={'p'} sx={{ fontWeight: 'bold' }}>
                                {formLocale.discardReasonLabel}
                            </Typography>
                            <Typography
                                component={'p'}
                                id={`${componentId}-discard-reason`}
                                data-testid={`${componentId}-discard-reason`}
                            >
                                {lastDiscard?.discard_reason}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Collapse>
        </StyledStandardCard>
    );
};

LastInspectionPanel.propTypes = {
    asset: PropTypes.object.isRequired,
    currentLocation: PropTypes.object.isRequired,
    dateFormatPattern: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    forceOpen: PropTypes.bool,
};

export default React.memo(LastInspectionPanel);
