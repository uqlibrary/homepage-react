import locale from 'modules/Pages/Admin/TestTag/testTag.locale';

export const assetStatusOptionExcludes = [
    locale.config.assetStatus.failed,
    locale.config.assetStatus.outforrepair,
    locale.config.assetStatus.discarded,
    locale.config.assetStatus.awaitingtest,
];

const moment = require('moment');

export const excludeAssetRules = [
    {
        condition: ({ formValues, asset }) => {
            // hasLocation
            if (formValues.hasLocation) {
                // next inspection date range selected
                if (formValues.monthRange !== '-1') {
                    const targetDate = moment()
                        .startOf('day')
                        .add(formValues.monthRange, 'months');
                    const nextTestDueDate = moment(
                        asset.asset_next_test_due_date,
                        locale.config.format.dateFormatNoTime,
                    );
                    if (nextTestDueDate.isBefore(targetDate)) {
                        // exclude this asset
                        return true;
                    }
                }
            }
            return false;
        },
    },
    {
        condition: ({ formValues, asset }) => {
            // hasAssetStatus
            if (formValues.hasAssetStatus) {
                if (assetStatusOptionExcludes.includes(asset.asset_status)) {
                    // exclude this asset
                    return true;
                }
            }
            return false;
        },
    },
];
