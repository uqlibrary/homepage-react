import { useState, useMemo, useCallback } from 'react';

import {
    isValidEventDate,
    isValidAssetId,
    isValidAssetTypeId,
    isValidInspection,
    isValidRepair,
    isValidDiscard,
    hasTestOrAction,
} from './helpers';

import { useCookies } from 'react-cookie';

export const extractCorePrinterName = printerName => {
    // We assume the printer name is at the start of the full printer string
    // followed by a whitespace. This will have to be revisited if it changes in the future.
    const parts = printerName.split(' ');
    return parts[0];
};

export const printerToCookieString = printerName => {
    const printerNameShort = extractCorePrinterName(printerName);
    return JSON.stringify({ name: printerName, shortName: printerNameShort });
};

export const parsePrinterFromCookieString = cookieValue => {
    try {
        if (typeof cookieValue !== 'string') return cookieValue;
        const parsed = JSON.parse(cookieValue);
        return parsed || null;
    } catch (e) {
        return null;
    }
};

export const useLabelPrinterPreference = cookieName => {
    const [cookies, setCookie] = useCookies([cookieName]);
    const setPrinterPreference = useCallback(
        printerName => {
            const encodedPrinter = printerToCookieString(printerName);
            setCookie(cookieName, encodedPrinter, { path: '/' });
        },
        [cookieName, setCookie],
    );
    const printerPreference = useMemo(() => {
        const parsed = parsePrinterFromCookieString(cookies[cookieName]);
        return parsed;
    }, [cookieName, cookies]);

    return [printerPreference, setPrinterPreference];
};

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
