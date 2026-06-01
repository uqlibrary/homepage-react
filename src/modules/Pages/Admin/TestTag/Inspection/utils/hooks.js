import { useState, useMemo } from 'react';

import {
    isValidEventDate,
    isValidAssetId,
    isValidAssetTypeId,
    isValidInspection,
    isValidRepair,
    isValidDiscard,
    hasTestOrAction,
} from './helpers';

export const useValidation = (/* istanbul ignore next */ { testStatusEnum = {}, user = {} } = {}) => {
    const [isValid, setIsValid] = useState(false);

    const validateValues = (formValues, lastInspection) => {
        const val =
            isValidEventDate(formValues.action_date) &&
            isValidAssetId(formValues.asset_id_displayed) &&
            isValidAssetTypeId(formValues.asset_type_id) &&
            isValidInspection(formValues, user, testStatusEnum) &&
            ((!!!formValues.isRepair && !!!formValues.isDiscarded) ||
                (!!formValues.isRepair !== !!formValues.isDiscarded &&
                    (isValidRepair({
                        formValues,
                        lastInspection,
                        passed: testStatusEnum.PASSED.value,
                        failed: testStatusEnum.FAILED.value,
                    }) ||
                        isValidDiscard({
                            formValues,
                            lastInspection,
                            passed: testStatusEnum.PASSED.value,
                            failed: testStatusEnum.FAILED.value,
                        })))) &&
            hasTestOrAction(formValues);
        setIsValid(val);
    };

    return { isValid, validateValues };
};

export const emptyActionState = { isAdd: false, rows: {}, row: {}, title: '' };

export const actionReducer = (_, action) => {
    switch (action.type) {
        case 'add':
            return {
                title: action.title,
                isAdd: true,
                row: { asset_type_id: 'auto' },
            };
        case 'clear':
            return { ...emptyActionState };
        default:
            throw `Unknown action '${action.type}'`;
    }
};

export const useIncludedLocations = (location, sites, floors, rooms) => {
    const includedSites = useMemo(() => sites?.filter?.(site => !site.site_excluded) ?? [], [sites]);
    const includedBuildings = useMemo(
        () =>
            (includedSites?.find?.(site => site.site_id === location.site)?.buildings ?? []).filter(
                building => !building.building_excluded && !building.parent_excluded,
            ),
        [includedSites, location.site],
    );
    const includedFloors = useMemo(() => floors?.filter?.(floor => !floor.floor_excluded) ?? [], [floors]);
    const includedRooms = useMemo(() => rooms?.filter?.(room => !room.room_excluded) ?? [], [rooms]);

    return {
        sites: includedSites,
        buildings: includedBuildings,
        floors: includedFloors,
        rooms: includedRooms,
    };
};
