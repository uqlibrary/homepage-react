import { transformRequest, transformFilterRow } from './transformers';

describe('utils', () => {
    describe('transformRequest', () => {
        it('should return the expected result when updating Location', () => {
            // Provide sample input values for formValues
            const formValues = {
                hasLocation: true,
                hasDiscardStatus: false,
                hasAssetStatus: false,
                hasAssetType: false,
                hasAssetTeam: false,
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
                clear_comments: 1,
            };

            // Call the transformRequest function with the sample input values
            const result = transformRequest(formValues);

            // Assert that the result matches the expected output
            expect(result).toEqual(expectedOutput);
        });
        it('should return the expected result when updating Location with monthRange supplied', () => {
            // Provide sample input values for formValues
            const formValues = {
                hasLocation: true,
                monthRange: '48',
                hasDiscardStatus: false,
                hasAssetStatus: false,
                hasAssetType: false,
                asset_list: [{ asset_id: 1 }, { asset_id: 2 }, { asset_id: 3 }],
                location: {
                    room: 'Room 1',
                },
                asset_type: {
                    asset_type_id: 1,
                },
                discard_reason: 'No longer needed',
                hasClearNotes: true,
                hasAssetTeam: true,
                asset_team: { team_slug: 'team-1' },
            };

            // Define the expected output
            const expectedOutput = {
                asset: [1, 2, 3],
                asset_room_id_last_seen: 'Room 1',
                clear_comments: 1,
                month_range: 48,
                team_slug: 'team-1',
            };

            // Call the transformRequest function with the sample input values
            const result = transformRequest(formValues);

            // Assert that the result matches the expected output
            expect(result).toEqual(expectedOutput);
        });

        it('should return the expected result when asset is not discarded', () => {
            // Provide sample input values for formValues
            const formValues = {
                hasDiscardStatus: false,
                hasLocation: true,
                hasAssetType: false,
                asset_list: [{ asset_id: 1 }, { asset_id: 2 }, { asset_id: 3 }],
                location: {
                    room: 'Room 1',
                },
                asset_type: {
                    asset_type_id: 1,
                },
                discard_reason: 'No longer needed',
                hasClearNotes: true,
                hasAssetTeam: true,
                asset_team: { team_slug: 'team-1' },
            };

            // Define the expected output
            const expectedOutput = {
                asset: [1, 2, 3],
                asset_room_id_last_seen: 'Room 1',
                clear_comments: 1,
                team_slug: 'team-1',
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
                hasAssetTeam: true,
                asset_team: { team_slug: 'team-1' },
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
        it('should return the expected result when asset type is being updated', () => {
            // Provide sample input values for formValues
            const formValues = {
                hasDiscardStatus: false,
                asset_list: [{ asset_id: 1 }, { asset_id: 2 }, { asset_id: 3 }],
                location: {
                    room: 'Room 1',
                },
                hasAssetType: true,
                asset_type: {
                    asset_type_id: 1,
                },
                discard_reason: 'No longer needed',
                hasClearNotes: true,
                hasAssetTeam: true,
                asset_team: { team_slug: 'team-1' },
            };

            // Define the expected output
            const expectedOutput = {
                asset: [1, 2, 3],
                asset_type_id: 1,
                clear_comments: 1,
                team_slug: 'team-1',
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
                hasAssetType: false,
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
                hasAssetTeam: true,
                asset_team: { team_slug: 'team-1' },
            };

            // Define the expected output - hasAssetStatus should clear other flags
            const expectedOutput = {
                asset: [4, 5],
                asset_room_id_last_seen: 'Room 2',
                asset_status: 'INSTORAGE',
                clear_comments: 1,
                team_slug: 'team-1',
            };

            // Call the transformRequest function with the sample input values
            const result = transformRequest(formValues);

            // Assert that the result matches the expected output
            expect(result).toEqual(expectedOutput);
            // Verify that other flags were cleared
            expect(formValues.hasLocation).toBe(true);
            expect(formValues.hasAssetType).toBe(false);
            expect(formValues.hasDiscardStatus).toBe(false);
            expect(formValues.hasClearNotes).toBe(true);
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
                hasAssetTeam: true,
                asset_team: { team_slug: 'team-1' },
            };

            const result = transformRequest(formValues);

            expect(result).toEqual({
                asset: [1],
                asset_room_id_last_seen: 'Room 1',
                team_slug: 'team-1',
            });
            expect(result.asset_status).toBeUndefined();
        });

        it('should only update notes', () => {
            const formValues = {
                hasAssetStatus: false,
                hasLocation: false,
                asset_list: [{ asset_id: 1 }],
                location: {
                    room: 'Room 1',
                },
                asset_status: {
                    value: 'INSTORAGE',
                },
                hasClearNotes: true,
                hasAssetTeam: false,
            };

            const result = transformRequest(formValues);

            expect(result).toEqual({
                asset: [1],
                clear_comments: 1,
            });
            expect(result.asset_status).toBeUndefined();
        });

        it('should return the expected result when asset team is being updated', () => {
            // Provide sample input values for formValues
            const formValues = {
                hasDiscardStatus: false,
                asset_list: [{ asset_id: 1 }, { asset_id: 2 }, { asset_id: 3 }],
                hasLocation: false,
                hasAssetType: false,
                hasClearNotes: true,
                hasAssetTeam: true,
                asset_team: { team_slug: 'team-1' },
            };

            // Define the expected output
            const expectedOutput = {
                asset: [1, 2, 3],
                clear_comments: 1,
                team_slug: 'team-1',
            };

            // Call the transformRequest function with the sample input values
            const result = transformRequest(formValues);

            // Assert that the result matches the expected output
            expect(result).toEqual(expectedOutput);
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
                    site_name: 'Site 1',
                    building_name: 'Building 1',
                    floor_id_displayed: '1',
                    room_id_displayed: '101',
                },
                {
                    asset_id_displayed: '',
                    site_name: 'Site 2',
                    building_name: 'Building 2',
                    floor_id_displayed: '2',
                    room_id_displayed: '202',
                },
                {
                    asset_barcode: '456',
                    asset_id_displayed: '456',
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
