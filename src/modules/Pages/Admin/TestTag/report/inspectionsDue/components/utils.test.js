import { transformRow } from './utils';

describe('utils', () => {
    describe('transformRow', () => {
        it('returns expected results', () => {
            const actual = [{ id: 1, site_name: 1, building_name: 2, floor_id_displayed: 3, room_id_displayed: 4 }];
            const expected = [
                {
                    id: 1,
                    site_name: 1,
                    building_name: 2,
                    floor_id_displayed: 3,
                    room_id_displayed: 4,
                    asset_location: '3-4 2, 1',
                },
            ];
            const returned = transformRow(actual);
            expect(returned).toEqual(expected);
            // send returned back in, should not transform further
            expect(transformRow(returned)).toEqual(returned);
        });
    });
});
