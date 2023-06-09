import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import DataTable from './../../../SharedComponents/DataTable/DataTable';

import locale from '../../../testTag.locale';
import config from './config';
import { PERMISSIONS } from '../../../config/auth';
import AutoLocationPicker from '../../../SharedComponents/LocationPicker/AutoLocationPicker';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';
import { useLocation, useSelectLocation } from '../../../SharedComponents/LocationPicker/LocationPickerHooks';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    tableMarginTop: {
        marginTop: theme.spacing(2),
    },
    gridRoot: {
        border: 0,
    },
}));

const InspectionsDue = ({ actions }) => {
    const pageLocale = locale.pages.report.inspectionsDue;
    const classes = useStyles();

    const store = useSelector(state => state.get('testTagLocationReducer'));
    const { row, setRow } = useDataTableRow();
    const { location, setLocation } = useLocation();
    const { selectedLocation } = useSelectLocation({
        location,
        setLocation,
        setRow,
        actions,
        store,
    });
    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        withActions: false,
    });

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_see_reports]}
        >
            <div className={classes.root}>
                <StandardCard title={pageLocale.form.title}>
                    <Grid container spacing={3}>
                        <AutoLocationPicker
                            actions={actions}
                            location={location}
                            setLocation={setLocation}
                            hasAllOption
                            locale={locale.pages.general.locationPicker}
                        />
                    </Grid>
                    <Grid container spacing={3} className={classes.tableMarginTop}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                rows={row}
                                columns={columns}
                                rowId={`${selectedLocation}_id`}
                                loading={store.siteListLoading || store.floorListLoading || store.roomListLoading}
                                classes={{ root: classes.gridRoot }}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </div>
        </StandardAuthPage>
    );
};

InspectionsDue.propTypes = { actions: PropTypes.object };

export default React.memo(InspectionsDue);
