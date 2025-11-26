import { excludeAssetRules, assetStatusOptionExcludes } from './rules';
describe('excludeAssetRules', () => {
    it('should return an array of rule objects', () => {
        expect(excludeAssetRules).toHaveLength(2);
        expect(excludeAssetRules[0]).toHaveProperty('condition');
        expect(excludeAssetRules[1]).toHaveProperty('condition');
        expect(typeof excludeAssetRules[0].condition).toBe('function');
        expect(typeof excludeAssetRules[1].condition).toBe('function');
    });

    describe('location rule', () => {
        it('should return false when hasLocation is false', () => {
            const formValues = { hasLocation: false };
            const asset = { asset_next_test_due_date: '2025-12-01' };

            expect(excludeAssetRules[0].condition({ formValues, asset })).toBe(false);
        });

        it('should return false when hasLocation is true but monthRange is -1', () => {
            const formValues = { hasLocation: true, monthRange: '-1' };
            const asset = { asset_next_test_due_date: '2025-12-01' };

            expect(excludeAssetRules[0].condition({ formValues, asset })).toBe(false);
        });

        it('should return true when asset next test date is before target date', () => {
            const formValues = { hasLocation: true, monthRange: '6' };
            // Global MockDate is set to 6/30/2017, so 6 months from then is 12/30/2017
            // Asset due on 2017-10-01 is before that, so should be excluded (return true)
            const asset = { asset_next_test_due_date: '2017-10-01' };

            expect(excludeAssetRules[0].condition({ formValues, asset })).toBe(true);
        });

        it('should return false when asset next test date is after target date', () => {
            const formValues = { hasLocation: true, monthRange: '1' };
            // Global MockDate is set to 6/30/2017, so 1 month from then is 7/30/2017
            // Asset due on 2018-01-01 is after that, so should not be excluded (return false)
            const asset = { asset_next_test_due_date: '2018-01-01' };

            expect(excludeAssetRules[0].condition({ formValues, asset })).toBe(false);
        });
    });

    describe('asset status rule', () => {
        it('should return false when hasAssetStatus is false', () => {
            const formValues = { hasAssetStatus: false };
            const asset = { asset_status: 'FAILED' };

            expect(excludeAssetRules[1].condition({ formValues, asset })).toBe(false);
        });

        it('should return true when asset status is in excluded list', () => {
            const formValues = { hasAssetStatus: true };

            assetStatusOptionExcludes.forEach(status => {
                const asset = { asset_status: status };
                expect(excludeAssetRules[1].condition({ formValues, asset })).toBe(true);
            });
        });

        it('should return false when asset status is not in excluded list', () => {
            const formValues = { hasAssetStatus: true };
            const asset = { asset_status: 'CURRENT' };

            expect(excludeAssetRules[1].condition({ formValues, asset })).toBe(false);
        });
    });
});
