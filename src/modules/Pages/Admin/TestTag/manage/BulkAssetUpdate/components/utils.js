import { MAXEXCLUDEDMOREITEMS } from './config';

export const makeAssetExcludedMessage = ({ excludedList, maxItems = MAXEXCLUDEDMOREITEMS }) => {
    const count = excludedList.data.length;
    let excludedListIds = excludedList.data.map(item => item.asset_id_displayed);
    let excludedListString = excludedListIds.join(count === 2 ? ' and ' : ', ');
    if (maxItems > 0 && count > maxItems) {
        excludedListIds = excludedListIds.slice(0, maxItems);
        excludedListString = `${excludedListIds.join(', ')} and ${count - excludedListIds.length} more`;
    }
    return `${excludedListString} will not be updated in this bulk operation.`;
};
