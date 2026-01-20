import { renderLocation } from './config';

describe('config', () => {
    describe('renderLocation', () => {
        it('passes site, building, floor, and room values to formattedLocation', () => {
            const row = {
                site_name: 'UQ',
                building_id_displayed: '39',
                floor_id_displayed: '2',
                room_id_displayed: '205',
            };
            const result = renderLocation(row);
            expect(result).toBe('UQ / 39 / 2 / 205');
        });

        it('falls back to empty strings when row properties are missing', () => {
            expect(renderLocation({})).toBe(' /  /  / ');
            expect(renderLocation(undefined)).toBe(' /  /  / ');
        });
    });
});
