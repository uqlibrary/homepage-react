import React from 'react';
import AssetSelector from './AssetSelector';
import { render /* , act, fireEvent*/, WithReduxStore /* , waitFor*/ } from 'test-utils';
import Immutable from 'immutable';

import assetData from '../../../../../../data/mock/data/testing/testTagAssets';
import configData from '../../../../../../data/mock/data/testing/testTagOnLoadInspection';
import locale from '../../testTag.locale.js';

/*

    id,
    locale,
    selectedAsset,
    masked = true,
    required = true,
    canAddNew = true,
    clearOnSelect = false,
    headless = false, // if true, no popup is shown and the calling component is expected to intercept the Redux store
    minAssetIdLength = MINIMUM_ASSET_ID_PATTERN_LENGTH,
    user,
    classNames,
    inputRef,
    onChange,
    onReset,
    onSearch,
    validateAssetId,
    filter,
    */

function setup(testProps = {}) {
    const { state = {}, actions = {}, focusElementRef = {}, classes = {}, isMobileView = false, ...props } = testProps;

    const _state = {
        testTagAssetsReducer: { assetsList: assetData, assetsListLoading: false },
        ...state,
    };
    return render(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <AssetSelector
                actions={actions}
                currentRetestList={currentRetestList}
                defaultNextTestDateValue={DEFAULT_NEXT_TEST_DATE_VALUE}
                focusElementRef={focusElementRef}
                classes={classes}
                isMobileView={isMobileView}
                canAddAssetType
                {...props}
            />
        </WithReduxStore>,
    );
}

describe('AssetPanel', () => {
    it('renders component', () => {});
});
