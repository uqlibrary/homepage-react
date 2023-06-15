import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import { useDataTableRow, useDataTableColumns } from '../../../SharedComponents/DataTable/DataTableHooks';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import { useForm, useLocation, useObjectList } from '../../../helpers/hooks';
import AssetSelector from '../../../SharedComponents/AssetSelector/AssetSelector';
import locale from '../../../testTag.locale';
import config from './config';
import { PERMISSIONS } from '../../../config/auth';
import { isValidAssetId } from '../../../Inspection/utils/helpers';

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

const BulkAssetUpdate = ({ defaultFormValues }) => {
    const pageLocale = locale.pages.manage.bulkassetupdate;
    const stepOneLocale = pageLocale.form.step.one;
    const classes = useStyles();
    const { user } = useSelector(state => state.get('testTagUserReducer'));
    const list = useObjectList([]);

    const assignAssetDefaults = () => ({ ...defaultFormValues });

    const { formValues, resetFormValues, handleChange } = useForm({
        defaultValues: { ...assignAssetDefaults() },
    });

    const handleSearchAssetIdChange = newValue => {
        console.log(newValue);
        list.addStart(newValue);
    };

    const resetForm = () => {
        const newFormValues = assignAssetDefaults();
        resetFormValues(newFormValues);
    };

    const handleDeleteClick = ({ id, api }) => {
        const row = api.getRow(id);
        list.deleteWith('asset_id', row.asset_id);
    };

    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        handleDeleteClick,
    });

    // const { location, setLocation } = useLocation();
    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_inspect]}
        >
            <div className={classes.root}>
                <StandardCard title={stepOneLocale.title}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <AssetSelector
                                id="assetId"
                                locale={stepOneLocale}
                                user={user}
                                classNames={{ formControl: classes.formControl }}
                                onChange={handleSearchAssetIdChange}
                                validateAssetId={isValidAssetId}
                                canAddNew={false}
                                required={false}
                                clearOnSelect
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={2}
                            alignItems="center"
                            style={{ display: 'flex' }}
                            justifyContent="center"
                        >
                            or
                        </Grid>
                        <Grid item xs={12} sm={6} alignItems="center" style={{ display: 'flex' }}>
                            <Button
                                variant="outlined"
                                id="addByFeatureButton"
                                data-testid="addByFeatureButton"
                                color="primary"
                            >
                                {stepOneLocale.button.findAndAdd}
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                rows={list.data}
                                columns={columns}
                                rowId={'asset_id'}
                                classes={{ root: classes.gridRoot }}
                                handleDeleteClick={handleDeleteClick}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </div>
        </StandardAuthPage>
    );
};

BulkAssetUpdate.propTypes = {
    defaultFormValues: PropTypes.object,
};

export default React.memo(BulkAssetUpdate);
