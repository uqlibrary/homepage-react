import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import clsx from 'clsx';

import locale from '../../testTag.locale';
import LocationPicker from '../../SharedComponents/LocationPicker/LocationPicker';

const componentId = 'event-panel';
const componentIdLower = 'event_panel';

const moment = require('moment');

const EventPanel = ({
    actions,
    location,
    setLocation,
    actionDate,
    handleChange,
    classes,
    hasInspection = false,
    isMobileView,
}) => {
    const [eventExpanded, setEventExpanded] = React.useState(true);
    const pageLocale = locale.pages.inspect;
    const startDate = moment()
        .startOf('year')
        .subtract(5, 'year')
        .format(pageLocale.config.dateFormat);

    const { inspectionConfig, inspectionConfigLoading } = useSelector(state =>
        state.get?.('testTagOnLoadInspectionReducer'),
    );
    const { floorList, floorListLoading, roomList, roomListLoading } = useSelector(state =>
        state.get?.('testTagLocationReducer'),
    );

    const updateLocation = (update, useRoomId = false) => {
        setLocation(update);
        handleChange('room_id')(useRoomId ? update.room : -1);
    };

    const updateEventDate = newDate => {
        const manualDate = moment(newDate).isBefore(moment(), 'day');
        handleChange('action_date')(newDate);
        handleChange('isManualDate')(manualDate);
    };

    useEffect(() => {
        if (!inspectionConfigLoading && !!inspectionConfig && inspectionConfig?.sites?.length > 0) {
            setLocation({ site: inspectionConfig.sites[0].site_id });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inspectionConfig, inspectionConfigLoading]);

    return (
        <StandardCard
            standardCardId={componentIdLower}
            title={pageLocale.form.event.title}
            headerAction={
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: eventExpanded,
                    })}
                    aria-expanded={eventExpanded}
                    aria-label={pageLocale.form.event.aria.collapseButtonLabel}
                    onClick={() => setEventExpanded(!eventExpanded)}
                    id={`${componentIdLower}-expand-button`}
                    data-testid={`${componentIdLower}-expand-button`}
                    size="large"
                >
                    <ExpandMoreIcon />
                </IconButton>
            }
            noPadding={!eventExpanded}
        >
            <Collapse in={eventExpanded} timeout="auto">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <DatePicker
                            {...pageLocale.form.event.date}
                            id={`${componentIdLower}-event-date`}
                            data-testid={`${componentIdLower}-event-date`}
                            inputProps={{
                                ...pageLocale.form.event.date.inputProps,
                                id: `${componentIdLower}-event-date-input`,
                                'data-testid': `${componentIdLower}-event-date-input`,
                            }}
                            DialogProps={{
                                id: `${componentIdLower}-event-date-dialog`,
                                'data-testid': `${componentIdLower}-event-date-dialog`,
                            }}
                            InputLabelProps={{ shrink: true, htmlFor: `${componentIdLower}-event-date-input` }}
                            inputFormat={pageLocale.config.dateFormatDisplay}
                            rifmFormatter={val => val.replace(/[^a-zA-Z0-9\s]+/gi, '')}
                            refuse={/[^a-zA-Z0-9\s]+/gi}
                            minDate={startDate}
                            autoOk
                            disableFuture
                            showTodayButton
                            value={actionDate}
                            onChange={updateEventDate}
                            required
                            fullWidth={isMobileView}
                            KeyboardButtonProps={{
                                'aria-label': 'Event date',
                                id: `${componentIdLower}-event-date-button`,
                                'data-testid': `${componentIdLower}-event-date-button`,
                            }}
                            renderInput={params => <TextField variant="standard" {...params} />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography component={'h3'} variant={'h6'}>
                            {pageLocale.form.event.location.title}
                        </Typography>
                    </Grid>

                    <LocationPicker
                        id={componentId}
                        siteList={inspectionConfig?.sites ?? []}
                        siteListLoading={inspectionConfigLoading}
                        buildingList={
                            inspectionConfig?.sites?.find(site => site.site_id === location.site)?.buildings ?? []
                        }
                        buildingListLoading={inspectionConfigLoading}
                        floorList={floorList?.floors ?? []}
                        floorListLoading={floorListLoading}
                        roomList={roomList?.rooms ?? []}
                        roomListLoading={roomListLoading}
                        actions={actions}
                        location={location}
                        locale={locale.pages.general.locationPicker}
                        setLocation={updateLocation}
                        inputProps={{
                            site: {
                                required: hasInspection,
                                error: location.site === -1,
                            },
                            building: {
                                required: hasInspection,
                                error: hasInspection && location.site !== -1 && location.building === -1,
                            },
                            floor: {
                                required: hasInspection,
                                error:
                                    hasInspection &&
                                    location.site !== -1 &&
                                    location.building !== -1 &&
                                    location.floor === -1,
                            },
                            room: {
                                required: hasInspection,
                                error:
                                    hasInspection &&
                                    location.site !== -1 &&
                                    location.building !== -1 &&
                                    location.floor !== -1 &&
                                    location.room === -1,
                            },
                        }}
                        autoFocus={location?.room === -1}
                        focusTarget={'site'}
                    />
                </Grid>
            </Collapse>
        </StandardCard>
    );
};

EventPanel.propTypes = {
    actions: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired,
    setLocation: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    actionDate: PropTypes.any,
    hasInspection: PropTypes.bool,
    isMobileView: PropTypes.bool,
};

export default React.memo(EventPanel);
