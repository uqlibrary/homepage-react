import { transformUpdateRequest, actionReducer } from './utils';

describe('utils', () => {
    it('transformUpdateRequest operates correctly', () => {
        const testRequest = {
            assetStatus: 'discarded',
            lastInspectStatus: 'current',
            inspect_notes: 'test',
        };
        expect(transformUpdateRequest(testRequest)).toEqual({});
    });
});
