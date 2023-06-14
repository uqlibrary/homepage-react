import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import DataTable from './../../../SharedComponents/DataTable/DataTable';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import { useForm, useLocation } from '../../../helpers/hooks';
import AssetSelector from '../../../SharedComponents/AssetSelector/AssetSelector';
import locale from '../../../testTag.locale';
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
    const classes = useStyles();
    const { user } = useSelector(state => state.get('testTagUserReducer'));
    const assignAssetDefaults = () => ({ ...defaultFormValues });

    const { formValues, resetFormValues, handleChange } = useForm({
        defaultValues: { ...assignAssetDefaults() },
    });

    const handleSearchAssetIdChange = newValue => console.log(newValue);

    const resetForm = () => {
        const newFormValues = assignAssetDefaults();
        resetFormValues(newFormValues);
    };

    // const { location, setLocation } = useLocation();

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_inspect]}
        >
            <div className={classes.root}>
                <StandardCard title={pageLocale.form.step.one.title}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <AssetSelector
                                id="assetId"
                                locale={pageLocale.form.step.one}
                                user={user}
                                classNames={{ formControl: classes.formControl }}
                                onChange={handleSearchAssetIdChange}
                                onReset={resetForm}
                                validateAssetId={isValidAssetId}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            or
                        </Grid>
                        <Grid item xs={12} sm={6} />
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
