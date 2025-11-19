import { validateFormValues, listRuleSet, validateAssetLists, assetStatusOptionExcludes } from './validation';

describe('validation', () => {
    describe('validateFormValues', () => {
        it('should return false when no options are selected', () => {
            const formValues = {
                hasLocation: false,
                hasDiscardStatus: false,
                hasAssetType: false,
                hasClearNotes: false,
                hasAssetStatus: false,
            };

            expect(validateFormValues(formValues)).toBe(false);
        });

        it('should return true when hasClearNotes is selected', () => {
            const formValues = {
                hasLocation: false,
                hasDiscardStatus: false,
                hasAssetType: false,
                hasClearNotes: true,
                hasAssetStatus: false,
            };

            expect(validateFormValues(formValues)).toBe(true);
        });

        describe('location validation', () => {
            it('should return true when hasLocation is true with valid location', () => {
                const formValues = {
                    hasLocation: true,
                    location: { room: 1 },
                    hasDiscardStatus: false,
                    hasAssetType: false,
                    hasClearNotes: false,
                    hasAssetStatus: false,
                };

                expect(validateFormValues(formValues)).toBe(true);
            });

            it('should return false when hasLocation is true with invalid location', () => {
                const formValues = {
                    hasLocation: true,
                    location: { room: -1 },
                    hasDiscardStatus: false,
                    hasAssetType: false,
                    hasClearNotes: false,
                    hasAssetStatus: false,
                };

                expect(validateFormValues(formValues)).toBe(false);
            });

            it('should return false when hasLocation is true with empty location object', () => {
                const formValues = {
                    hasLocation: true,
                    location: {},
                    hasDiscardStatus: false,
                    hasAssetType: false,
                    hasClearNotes: false,
                    hasAssetStatus: false,
                };

                expect(validateFormValues(formValues)).toBe(false);
            });
        });

        describe('discard status validation', () => {
            it('should return true when hasDiscardStatus is true with valid reason', () => {
                const formValues = {
                    hasLocation: false,
                    hasDiscardStatus: true,
                    discard_reason: 'Broken',
                    hasAssetType: false,
                    hasClearNotes: false,
                    hasAssetStatus: false,
                };

                expect(validateFormValues(formValues)).toBe(true);
            });

            it('should return false when hasDiscardStatus is true with empty reason', () => {
                const formValues = {
                    hasLocation: false,
                    hasDiscardStatus: true,
                    discard_reason: '',
                    hasAssetType: false,
                    hasClearNotes: false,
                    hasAssetStatus: false,
                };

                expect(validateFormValues(formValues)).toBe(false);
            });
        });

        describe('asset type validation', () => {
            it('should return true when hasAssetType is true with valid asset type', () => {
                const formValues = {
                    hasLocation: false,
                    hasDiscardStatus: false,
                    hasAssetType: true,
                    asset_type: { asset_type_id: 1 },
                    hasClearNotes: false,
                    hasAssetStatus: false,
                };

                expect(validateFormValues(formValues)).toBe(true);
            });

            it('should return false when hasAssetType is true with invalid asset type', () => {
                const formValues = {
                    hasLocation: false,
                    hasDiscardStatus: false,
                    hasAssetType: true,
                    asset_type: { asset_type_id: -1 },
                    hasClearNotes: false,
                    hasAssetStatus: false,
                };

                expect(validateFormValues(formValues)).toBe(false);
            });

            it('should return false when hasAssetType is true with empty asset type object', () => {
                const formValues = {
                    hasLocation: false,
                    hasDiscardStatus: false,
                    hasAssetType: true,
                    asset_type: {},
                    hasClearNotes: false,
                    hasAssetStatus: false,
                };

                expect(validateFormValues(formValues)).toBe(false);
            });
        });

        describe('asset status validation', () => {
            it('should return true when hasAssetStatus is true with valid status', () => {
                const formValues = {
                    hasLocation: false,
                    hasDiscardStatus: false,
                    hasAssetType: false,
                    hasClearNotes: false,
                    hasAssetStatus: true,
                    asset_status: { value: 'INSTORAGE' },
                };

                expect(validateFormValues(formValues)).toBe(true);
            });

            it('should return false when hasAssetStatus is true with invalid status', () => {
                const formValues = {
                    hasLocation: false,
                    hasDiscardStatus: false,
                    hasAssetType: false,
                    hasClearNotes: false,
                    hasAssetStatus: true,
                    asset_status: { value: 'CURRENT' },
                };

                expect(validateFormValues(formValues)).toBe(false);
            });

            it('should return false when hasAssetStatus is true with empty status object', () => {
                const formValues = {
                    hasLocation: false,
                    hasDiscardStatus: false,
                    hasAssetType: false,
                    hasClearNotes: false,
                    hasAssetStatus: true,
                    asset_status: {},
                };

                expect(validateFormValues(formValues)).toBe(false);
            });
        });

        it('should validate multiple options correctly', () => {
            const formValues = {
                hasLocation: true,
                location: { room: 1 },
                hasDiscardStatus: true,
                discard_reason: 'Broken',
                hasAssetType: true,
                asset_type: { asset_type_id: 1 },
                hasClearNotes: false,
                hasAssetStatus: false,
            };

            expect(validateFormValues(formValues)).toBe(true);
        });
    });

    describe('listRuleSet', () => {
        it('should return an array of rule objects', () => {
            const rules = listRuleSet();
            expect(rules).toHaveLength(2);
            expect(rules[0]).toHaveProperty('condition');
            expect(rules[1]).toHaveProperty('condition');
            expect(typeof rules[0].condition).toBe('function');
            expect(typeof rules[1].condition).toBe('function');
        });

        describe('location rule', () => {
            it('should return false when hasLocation is false', () => {
                const rules = listRuleSet();
                const formValues = { hasLocation: false };
                const asset = { asset_next_test_due_date: '2025-12-01' };

                expect(rules[0].condition({ formValues, asset })).toBe(false);
            });

            it('should return false when hasLocation is true but monthRange is -1', () => {
                const rules = listRuleSet();
                const formValues = { hasLocation: true, monthRange: '-1' };
                const asset = { asset_next_test_due_date: '2025-12-01' };

                expect(rules[0].condition({ formValues, asset })).toBe(false);
            });

            it('should return true when asset next test date is before target date', () => {
                const rules = listRuleSet();
                const formValues = { hasLocation: true, monthRange: '6' };
                // Global MockDate is set to 6/30/2017, so 6 months from then is 12/30/2017
                // Asset due on 2017-10-01 is before that, so should be excluded (return true)
                const asset = { asset_next_test_due_date: '2017-10-01' };

                expect(rules[0].condition({ formValues, asset })).toBe(true);
            });

            it('should return false when asset next test date is after target date', () => {
                const rules = listRuleSet();
                const formValues = { hasLocation: true, monthRange: '1' };
                // Global MockDate is set to 6/30/2017, so 1 month from then is 7/30/2017
                // Asset due on 2018-01-01 is after that, so should not be excluded (return false)
                const asset = { asset_next_test_due_date: '2018-01-01' };

                expect(rules[0].condition({ formValues, asset })).toBe(false);
            });
        });

        describe('asset status rule', () => {
            it('should return false when hasAssetStatus is false', () => {
                const rules = listRuleSet();
                const formValues = { hasAssetStatus: false };
                const asset = { asset_status: 'FAILED' };

                expect(rules[1].condition({ formValues, asset })).toBe(false);
            });

            it('should return true when asset status is in excluded list', () => {
                const rules = listRuleSet();
                const formValues = { hasAssetStatus: true };

                assetStatusOptionExcludes.forEach(status => {
                    const asset = { asset_status: status };
                    expect(rules[1].condition({ formValues, asset })).toBe(true);
                });
            });

            it('should return false when asset status is not in excluded list', () => {
                const rules = listRuleSet();
                const formValues = { hasAssetStatus: true };
                const asset = { asset_status: 'CURRENT' };

                expect(rules[1].condition({ formValues, asset })).toBe(false);
            });
        });
    });

    describe('validateAssetLists', () => {
        it('should return empty arrays when no assets provided', () => {
            const formValues = { hasLocation: false, hasAssetStatus: false };
            const result = validateAssetLists(formValues, [], []);

            expect(result).toEqual({
                validAssets: [],
                excludedAssets: [],
            });
        });

        it('should keep all assets as valid when no exclusion rules apply', () => {
            const formValues = { hasLocation: false, hasAssetStatus: false };
            const assets = [
                { asset_id: 1, asset_status: 'CURRENT' },
                { asset_id: 2, asset_status: 'CURRENT' },
            ];

            const result = validateAssetLists(formValues, assets, []);

            expect(result.validAssets).toHaveLength(2);
            expect(result.excludedAssets).toHaveLength(0);
        });

        it('should exclude assets based on status rule', () => {
            const formValues = { hasLocation: false, hasAssetStatus: true };
            const assets = [
                { asset_id: 1, asset_status: 'CURRENT' },
                { asset_id: 2, asset_status: 'FAILED' },
                { asset_id: 3, asset_status: 'DISCARDED' },
            ];

            const result = validateAssetLists(formValues, assets, []);

            expect(result.validAssets).toHaveLength(1);
            expect(result.validAssets[0].asset_id).toBe(1);
            expect(result.excludedAssets).toHaveLength(2);
            expect(result.excludedAssets.map(a => a.asset_id)).toEqual([2, 3]);
        });

        it('should combine listData and excludedListData before processing', () => {
            const formValues = { hasLocation: false, hasAssetStatus: true };
            const listData = [{ asset_id: 1, asset_status: 'CURRENT' }];
            const excludedListData = [{ asset_id: 2, asset_status: 'FAILED' }];

            const result = validateAssetLists(formValues, listData, excludedListData);

            expect(result.validAssets).toHaveLength(1);
            expect(result.validAssets[0].asset_id).toBe(1);
            expect(result.excludedAssets).toHaveLength(1);
            expect(result.excludedAssets[0].asset_id).toBe(2);
        });

        it('should stop checking rules after first match', () => {
            const formValues = { hasLocation: true, monthRange: '1', hasAssetStatus: true };
            const assets = [
                {
                    asset_id: 1,
                    asset_status: 'FAILED',
                    asset_next_test_due_date: '2025-11-01',
                },
            ];

            const result = validateAssetLists(formValues, assets, []);

            // Asset should be excluded by first rule (or second), but only once
            expect(result.excludedAssets).toHaveLength(1);
            expect(result.validAssets).toHaveLength(0);
        });

        it('should move assets from excluded back to valid when rules no longer apply', () => {
            const formValues = { hasLocation: false, hasAssetStatus: false };
            const listData = [];
            const excludedListData = [
                { asset_id: 1, asset_status: 'FAILED' },
                { asset_id: 2, asset_status: 'CURRENT' },
            ];

            const result = validateAssetLists(formValues, listData, excludedListData);

            // All assets should be valid when no exclusion rules apply
            expect(result.validAssets).toHaveLength(2);
            expect(result.excludedAssets).toHaveLength(0);
        });
    });
});
