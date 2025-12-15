import { makeAssetExcludedMessage } from './utils';

describe('utils', () => {
    describe('makeAssetExcludedMessage', () => {
        it('should create the correct excluded message for 1 asset', () => {
            const excludedList = {
                data: [{ asset_id_displayed: 'UQ001' }],
            };
            const maxItems = 3;

            const result = makeAssetExcludedMessage({ excludedList, maxItems });

            expect(result).toBe('UQ001 will not be updated in this bulk operation.');
        });
        it('should create the correct excluded message for 2 assets', () => {
            const excludedList = {
                data: [{ asset_id_displayed: 'UQ001' }, { asset_id_displayed: 'UQ002' }],
            };
            const maxItems = 3;

            const result = makeAssetExcludedMessage({ excludedList, maxItems });

            expect(result).toBe('UQ001 and UQ002 will not be updated in this bulk operation.');
        });
        it('should create the correct excluded message for 3+ assets with default maxitems', () => {
            const excludedList = {
                data: [
                    { asset_id_displayed: 'UQ001' },
                    { asset_id_displayed: 'UQ002' },
                    { asset_id_displayed: 'UQ003' },
                    { asset_id_displayed: 'UQ004' },
                    { asset_id_displayed: 'UQ005' },
                    { asset_id_displayed: 'UQ006' },
                ],
            };
            const result = makeAssetExcludedMessage({ excludedList });

            expect(result).toBe('UQ001, UQ002, UQ003, UQ004, UQ005, UQ006 will not be updated in this bulk operation.');
        });

        it('should create the correct excluded message for 10+ assets with default maxitems', () => {
            const excludedList = {
                data: [
                    { asset_id_displayed: 'UQ001' },
                    { asset_id_displayed: 'UQ002' },
                    { asset_id_displayed: 'UQ003' },
                    { asset_id_displayed: 'UQ004' },
                    { asset_id_displayed: 'UQ005' },
                    { asset_id_displayed: 'UQ006' },
                    { asset_id_displayed: 'UQ007' },
                    { asset_id_displayed: 'UQ008' },
                    { asset_id_displayed: 'UQ009' },
                    { asset_id_displayed: 'UQ0010' },
                    { asset_id_displayed: 'UQ0011' },
                ],
            };
            const result = makeAssetExcludedMessage({ excludedList });

            expect(result).toBe(
                'UQ001, UQ002, UQ003, UQ004, UQ005, UQ006, UQ007, UQ008, UQ009, UQ0010 and 1 more will not be updated in this bulk operation.',
            );
        });

        it('should create the correct excluded message for 3+ assets with maxItems = 2', () => {
            const excludedList = {
                data: [
                    { asset_id_displayed: 'UQ001' },
                    { asset_id_displayed: 'UQ002' },
                    { asset_id_displayed: 'UQ003' },
                    { asset_id_displayed: 'UQ004' },
                    { asset_id_displayed: 'UQ005' },
                    { asset_id_displayed: 'UQ006' },
                ],
            };
            const maxItems = 2;

            const result = makeAssetExcludedMessage({ excludedList, maxItems });

            expect(result).toBe('UQ001, UQ002 and 4 more will not be updated in this bulk operation.');
        });

        it('should create the correct excluded message for 3+ assets with maxItems = 1', () => {
            const excludedList = {
                data: [
                    { asset_id_displayed: 'UQ001' },
                    { asset_id_displayed: 'UQ002' },
                    { asset_id_displayed: 'UQ003' },
                    { asset_id_displayed: 'UQ004' },
                    { asset_id_displayed: 'UQ005' },
                    { asset_id_displayed: 'UQ006' },
                ],
            };
            const maxItems = 1;

            const result = makeAssetExcludedMessage({ excludedList, maxItems });

            expect(result).toBe('UQ001 and 5 more will not be updated in this bulk operation.');
        });
    });
});
