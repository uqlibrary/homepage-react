import { useRef, useEffect } from 'react';
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

export const useListRuleSet = (list, listToExclude) => {
    return [
        {
            condition: (formValues, asset) => {
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
                            listToExclude.push(asset);
                            const index = list.findIndex(item => item.asset_id === asset.asset_id);
                            if (index > -1) {
                                list.splice(index, 1);
                            }
                            return true;
                        }
                    }
                }
                return false;
            },
        },
        {
            condition: (formValues, asset) => {
                // hasAssetStatus
                if (formValues.hasAssetStatus) {
                    if (assetStatusOptionExcludes.includes(asset.asset_status)) {
                        // exclude this asset
                        listToExclude.push(asset);
                        const index = list.findIndex(item => item.asset_id === asset.asset_id);
                        if (index > -1) {
                            list.splice(index, 1);
                        }
                        return true;
                    }
                }
                return false;
            },
        },
    ];
};

export const useAssetListValidation = (formValues, formValueSignature, list, excludedList) => {
    const currentFormValueSignature = useRef('{}');
    let updated = false;

    const listCopy = [...list.data, ...excludedList.data];
    const listToExclude = [];
    const listRuleSet = useListRuleSet(listCopy, listToExclude);

    useEffect(() => {
        // whenever form values change, we need to
        // revalidate the list against the new rules
        if (currentFormValueSignature.current !== formValueSignature) {
            currentFormValueSignature.current = formValueSignature;

            for (const asset of listCopy) {
                for (const rule of listRuleSet) {
                    if (rule.condition(formValues, asset)) continue;
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            updated = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValueSignature]);
    return { list: listCopy, excludedList: listToExclude, updated };
};
