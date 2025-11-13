import { transformRow, transformRequest, transformFilterRow } from './utils';

describe('utils', () => {
    describe('transformRow', () => {
        it('should add asset_type_name and asset_location if they are missing', () => {
            const row = [
                { asset_type: { asset_type_name: 'type1' }, last_location: { site_name: 'site1' } },
                { asset_type: { asset_type_name: 'type2' }, last_location: { site_name: 'site2' } },
                { other_key: 'other_value' },
            ];

            const transformedRow = transformRow(row);

            expect(transformedRow).toEqual([
                {
                    asset_type: { asset_type_name: 'type1' },
                    last_location: { site_name: 'site1' },
                    asset_type_name: 'type1',
                    asset_location: 'site1',
                },
                {
                    asset_type: { asset_type_name: 'type2' },
                    last_location: { site_name: 'site2' },
                    asset_type_name: 'type2',
                    asset_location: 'site2',
                },
                {
                    other_key: 'other_value',
                    asset_type_name: '',
                    asset_location: '',
                },
            ]);
        });

        it('should return the transformed row if it already exists', () => {
            const row = [
                { asset_location: 'location1' },
                { asset_location: 'location2' },
                { asset_location: 'location3' },
            ];

            const transformedRow = transformRow(row);

            expect(transformedRow).toEqual([
                { asset_location: 'location1' },
                { asset_location: 'location2' },
                { asset_location: 'location3' },
            ]);
        });
    });

    describe('transformRequest', () => {
        it('should return the expected result when asset is not discarded', () => {
            // Provide sample input values for formValues
            const formValues = {
                hasDiscardStatus: false,
                hasLocation: true,
                hasAssetType: true,
                asset_list: [{ asset_id: 1 }, { asset_id: 2 }, { asset_id: 3 }],
                location: {
                    room: 'Room 1',
                },
                asset_type: {
                    asset_type_id: 1,
                },
                discard_reason: 'No longer needed',
                hasClearNotes: true,
            };

            // Define the expected output
            const expectedOutput = {
                asset: [1, 2, 3],
                asset_room_id_last_seen: 'Room 1',
                asset_type_id: 1,
                clear_comments: 1,
            };

            // Call the transformRequest function with the sample input values
            const result = transformRequest(formValues);

            // Assert that the result matches the expected output
            expect(result).toEqual(expectedOutput);
        });
        it('should return the expected result when asset is discarded', () => {
            // Provide sample input values for formValues
            const formValues = {
                hasDiscardStatus: true,
                asset_list: [{ asset_id: 1 }, { asset_id: 2 }, { asset_id: 3 }],
                location: {
                    room: 'Room 1',
                },
                asset_type: {
                    asset_type_id: 1,
                },
                discard_reason: 'No longer needed',
                hasClearNotes: false,
            };

            // Define the expected output
            const expectedOutput = {
                asset: [1, 2, 3],
                is_discarding: 1,
                discard_reason: 'No longer needed',
            };

            // Call the transformRequest function with the sample input values
            const result = transformRequest(formValues);

            // Assert that the result matches the expected output
            expect(result).toEqual(expectedOutput);
        });
        it('should return the expected result when asset status is being updated', () => {
            // Provide sample input values for formValues with hasAssetStatus
            const formValues = {
                hasDiscardStatus: false,
                hasAssetStatus: true,
                hasLocation: true,
                hasAssetType: true,
                hasClearNotes: true,
                asset_list: [{ asset_id: 4 }, { asset_id: 5 }],
                location: {
                    room: 'Room 2',
                },
                asset_type: {
                    asset_type_id: 2,
                },
                asset_status: {
                    value: 'INSTORAGE',
                },
            };

            // Define the expected output - hasAssetStatus should clear other flags
            const expectedOutput = {
                asset: [4, 5],
                asset_status: 'INSTORAGE',
            };

            // Call the transformRequest function with the sample input values
            const result = transformRequest(formValues);

            // Assert that the result matches the expected output
            expect(result).toEqual(expectedOutput);
            // Verify that other flags were cleared
            expect(formValues.hasLocation).toBe(false);
            expect(formValues.hasAssetType).toBe(false);
            expect(formValues.hasDiscardStatus).toBe(false);
            expect(formValues.hasClearNotes).toBe(false);
        });
        it('should handle different asset status values correctly', () => {
            const statuses = ['CURRENT', 'PASSED', 'FAILED', 'OUTFORREPAIR', 'DISCARDED', 'INSTORAGE', 'NONE'];

            statuses.forEach(status => {
                const formValues = {
                    hasAssetStatus: true,
                    asset_list: [{ asset_id: 1 }],
                    asset_status: {
                        value: status,
                    },
                };

                const result = transformRequest(formValues);

                expect(result).toEqual({
                    asset: [1],
                    asset_status: status,
                });
            });
        });
        it('should not include asset_status when hasAssetStatus is false', () => {
            const formValues = {
                hasAssetStatus: false,
                hasLocation: true,
                asset_list: [{ asset_id: 1 }],
                location: {
                    room: 'Room 1',
                },
                asset_status: {
                    value: 'INSTORAGE',
                },
            };

            const result = transformRequest(formValues);

            expect(result).toEqual({
                asset: [1],
                asset_room_id_last_seen: 'Room 1',
            });
            expect(result.asset_status).toBeUndefined();
        });
        it('should prioritize hasDiscardStatus over hasAssetStatus', () => {
            const formValues = {
                hasDiscardStatus: true,
                hasAssetStatus: true,
                asset_list: [{ asset_id: 1 }],
                discard_reason: 'Broken',
                asset_status: {
                    value: 'INSTORAGE',
                },
            };

            const result = transformRequest(formValues);

            expect(result).toEqual({
                asset: [1],
                is_discarding: 1,
                discard_reason: 'Broken',
            });
            expect(result.asset_status).toBeUndefined();
            expect(formValues.hasAssetStatus).toBe(false);
        });
    });
    describe('transformFilterRow', () => {
        it('should transform the row correctly', () => {
            const row = [
                {
                    asset_barcode: '123',
                    site_name: 'Site 1',
                    building_name: 'Building 1',
                    floor_id_displayed: '1',
                    room_id_displayed: '101',
                },
                {
                    site_name: 'Site 2',
                    building_name: 'Building 2',
                    floor_id_displayed: '2',
                    room_id_displayed: '202',
                },
                {
                    asset_barcode: '456',
                    asset_id_displayed: '456',
                    asset_location: '3-303 Building 3, Site 3',
                    site_name: 'Site 3',
                    building_name: 'Building 3',
                    floor_id_displayed: '3',
                    room_id_displayed: '303',
                },
            ];

            const expectedOutput = [
                {
                    asset_barcode: '123',
                    asset_id_displayed: '123',
                    asset_location: '1-101 Building 1, Site 1',
                    site_name: 'Site 1',
                    building_name: 'Building 1',
                    floor_id_displayed: '1',
                    room_id_displayed: '101',
                },
                {
                    asset_id_displayed: '',
                    asset_location: '2-202 Building 2, Site 2',
                    site_name: 'Site 2',
                    building_name: 'Building 2',
                    floor_id_displayed: '2',
                    room_id_displayed: '202',
                },
                {
                    asset_barcode: '456',
                    asset_id_displayed: '456',
                    asset_location: '3-303 Building 3, Site 3',
                    site_name: 'Site 3',
                    building_name: 'Building 3',
                    floor_id_displayed: '3',
                    room_id_displayed: '303',
                },
            ];

            const result = transformFilterRow(row);

            expect(result).toEqual(expectedOutput);
        });
    });
});
