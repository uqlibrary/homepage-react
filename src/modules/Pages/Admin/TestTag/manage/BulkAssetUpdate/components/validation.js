import { isValidRoomId, isValidAssetTypeId, isValidAssetStatus } from '../../../Inspection/utils/helpers';
import { isEmptyObject, isEmptyStr } from '../../../helpers/helpers';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';

const moment = require('moment');

const validAssetStatusOptions = locale.pages.manage.bulkassetupdate.config.validAssetStatusOptions;

export const assetStatusOptionExcludes = [
    locale.config.assetStatus.failed,
    locale.config.assetStatus.outforrepair,
    locale.config.assetStatus.discarded,
    locale.config.assetStatus.awaitingtest,
];

export const validateFormValues = formValues => {
    const validLocation =
        !formValues.hasLocation ||
        (!isEmptyObject(formValues.location) &&
            isValidRoomId(formValues.location?.room ?? /* istanbul ignore next */ 0));

    const validDiscardStatus = !formValues.hasDiscardStatus || !isEmptyStr(formValues.discard_reason);

    const validAssetType =
        !formValues.hasAssetType ||
        (!isEmptyObject(formValues.asset_type) &&
            isValidAssetTypeId(formValues.asset_type?.asset_type_id ?? /* istanbul ignore next */ 0));

    const validAssetStatus =
        !formValues.hasAssetStatus ||
        (!isEmptyObject(formValues.asset_status) &&
            isValidAssetStatus(formValues.asset_status?.value, validAssetStatusOptions));

    const isValid =
        (formValues.hasLocation ||
            formValues.hasDiscardStatus ||
            formValues.hasAssetType ||
            formValues.hasClearNotes ||
            formValues.hasAssetStatus) &&
        validLocation &&
        validDiscardStatus &&
        validAssetType &&
        validAssetStatus;

    return isValid;
};

export const listRuleSet = () => {
    return [
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
};

// Validation function that processes lists based on form rules
export const validateAssetLists = (formValues, listData, excludedListData) => {
    const allAssets = [...listData, ...excludedListData];
    const validAssets = [];
    const excludedAssets = [];
    const ruleSet = listRuleSet();

    for (const asset of allAssets) {
        let shouldExclude = false;
        for (const rule of ruleSet) {
            if (rule.condition({ formValues, asset })) {
                shouldExclude = true;
                break;
            }
        }

        if (shouldExclude) {
            excludedAssets.push(asset);
        } else {
            validAssets.push(asset);
        }
    }

    return { validAssets, excludedAssets };
};
