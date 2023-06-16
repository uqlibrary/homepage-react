import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GridFooterContainer } from '@mui/x-data-grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import FilterDialog from './FilterDialog';
import { useDataTableRow, useDataTableColumns } from '../../../SharedComponents/DataTable/DataTableHooks';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import { useForm, useLocation, useObjectList } from '../../../helpers/hooks';
import AssetSelector from '../../../SharedComponents/AssetSelector/AssetSelector';
import locale from '../../../testTag.locale';
import config from './config';
import { PERMISSIONS } from '../../../config/auth';
import { isValidAssetId } from '../../../Inspection/utils/helpers';
import { createLocationString } from '../../../helpers/helpers';

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

export const transformRow = row => {
    console.log('>>ROW', row);
    return row.map(line => {
        if (!!line?.asset_location) return line;
        return {
            ...line,
            asset_type_name: line?.asset_type?.asset_type_name ?? '',
            asset_location: !!line?.last_location
                ? createLocationString({
                      site: line.last_location.site_id_displayed,
                      building: line.last_location.building_id_displayed,
                      floor: line.last_location.floor_id_displayed,
                      room: line.last_location.room_id_displayed,
                  })
                : '',
        };
    });
};

const FooterBar = ({ nextLabel, clearLabel, onClearClick, onNextClick }) => {
    FooterBar.propTypes = {
        nextLabel: PropTypes.string.isRequired,
        clearLabel: PropTypes.string.isRequired,
        onClearClick: PropTypes.func.isRequired,
        onNextClick: PropTypes.func.isRequired,
    };

    return (
        <GridFooterContainer>
            <Button
                color="primary"
                onClick={onClearClick}
                variant="outlined"
                id="gridFooterClearBtn"
                data-testid="gridFooterClearBtn"
            >
                {clearLabel}
            </Button>
            <Button
                color="primary"
                onClick={onNextClick}
                variant="contained"
                id="gridFooterNextBtn"
                data-testid="gridFooterNextBtn"
            >
                {nextLabel}
            </Button>
        </GridFooterContainer>
    );
};

const BulkAssetUpdate = ({ defaultFormValues }) => {
    const pageLocale = locale.pages.manage.bulkassetupdate;
    const stepOneLocale = pageLocale.form.step.one;
    const classes = useStyles();
    const list = useObjectList([], transformRow);

    const assignAssetDefaults = () => ({ ...defaultFormValues });

    const { formValues, resetFormValues, handleChange } = useForm({
        defaultValues: { ...assignAssetDefaults() },
    });

    useEffect(() => {
        console.log('effect', list.data);
        handleChange('asset_list')(list.data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list.data]);

    const handleSearchAssetIdChange = useCallback(
        newValue => {
            console.log(newValue);
            list.addStart(newValue);
        },
        [list],
    );

    const resetForm = () => {
        const newFormValues = assignAssetDefaults();
        resetFormValues(newFormValues);
        list.clear();
    };

    const handleDeleteClick = useCallback(
        ({ id, api }) => {
            const row = api.getRow(id);
            console.log(row, list);
            list.deleteWith('asset_id', row.asset_id);
        },
        [list],
    );

    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        handleDeleteClick,
    });

    const handleStepButton = e => {
        console.log('handleStepButton', e);
    };

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
                                masked={false}
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
                                components={{ Footer: FooterBar }}
                                componentsProps={{
                                    footer: {
                                        nextLabel: pageLocale.form.buttonBar.next,
                                        clearLabel: pageLocale.form.buttonBar.clear,
                                        onClearClick: resetForm,
                                        onNextClick: handleStepButton,
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
                <FilterDialog locale={pageLocale.form.filterDialog} isOpen />
            </div>
        </StandardAuthPage>
    );
};

BulkAssetUpdate.propTypes = {
    defaultFormValues: PropTypes.object,
};

export default React.memo(BulkAssetUpdate);
