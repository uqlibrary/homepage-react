import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';

import locale from '../../testTag.locale';
import LocationPicker from '../../SharedComponents/LocationPicker/LocationPicker';

const rootId = 'event_panel';

const moment = require('moment');
const inputLabelProps = { shrink: true };

const EventPanel = ({
    id,
    actions,
    location,
    setLocation,
    actionDate,
    handleChange,
    classes,
    hasInspection = false,
    isMobileView,
}) => {
    const componentId = `${rootId}-${id}`;

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
        console.log('updateLocation', update, useRoomId);
        setLocation(update);
        handleChange('room_id')(useRoomId ? update.room : -1);
    };

    useEffect(() => {
        if (!inspectionConfigLoading && !!inspectionConfig && inspectionConfig?.sites?.length > 0) {
            setLocation({ site: inspectionConfig.sites[0].site_id });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inspectionConfig, inspectionConfigLoading]);
    // console.log('pageLocale=', pageLocale);
    return (
        <StandardCard
            standardCardId={componentId}
            title={pageLocale.form.event.title}
            headerAction={
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: eventExpanded,
                    })}
                    aria-expanded={eventExpanded}
                    aria-label={pageLocale.form.event.aria.collapseButtonLabel}
                    onClick={() => setEventExpanded(!eventExpanded)}
                    id={`${componentId}-expand-button`}
                    data-testid={`${componentId}-expand-button`}
                >
                    <ExpandMoreIcon />
                </IconButton>
            }
            noPadding={!eventExpanded}
        >
            <Collapse in={eventExpanded} timeout="auto">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <KeyboardDatePicker
                            {...pageLocale.form.event.date}
                            id={`${componentId}-event-date`}
                            data-testid={`${componentId}-event-date`}
                            inputProps={{
                                id: `${componentId}-event-date-input`,
                                'data-testid': `${componentId}-event-date-input`,
                            }}
                            DialogProps={{
                                id: `${componentId}-event-date-dialog`,
                                'data-testid': `${componentId}-event-date-dialog`,
                            }}
                            InputLabelProps={inputLabelProps}
                            format={pageLocale.config.dateFormatNoTime}
                            minDate={startDate}
                            autoOk
                            disableFuture
                            showTodayButton
                            value={actionDate}
                            onChange={handleChange('action_date')}
                            required
                            autoFocus
                            fullWidth={isMobileView}
                            KeyboardButtonProps={{
                                'aria-label': 'Event date',
                                id: `${componentId}-event-date-button`,
                                'data-testid': `${componentId}-event-date-button`,
                            }}
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
                    />
                </Grid>
            </Collapse>
        </StandardCard>
    );
};

EventPanel.propTypes = {
    id: PropTypes.string.isRequired,
    actions: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired,
    setLocation: PropTypes.func.isRequired,
    actionDate: PropTypes.any,
    handleChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    hasInspection: PropTypes.bool,
    isMobileView: PropTypes.bool,
};

export default React.memo(EventPanel);
