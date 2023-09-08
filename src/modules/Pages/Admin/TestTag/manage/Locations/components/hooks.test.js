import React from 'react';
import { useLocationDisplayName } from './hooks';

describe('useLocationDisplayName', () => {
    it('should return the correct location display name', () => {
        const location = {
            site: 'site_id',
            building: 'building_id',
            floor: 'floor_id',
        };
        const sites = [
            {
                site_id: 'site_id',
                site_name: 'Site 1',
                buildings: [
                    {
                        building_id: 'building_id',
                        building_name: 'Building 1',
                    },
                ],
            },
        ];
        const floors = {
            floors: [
                {
                    floor_id: 'floor_id',
                    floor_id_displayed: 'Floor 1',
                },
            ],
        };

        let locationDisplayedAs;
        jest.spyOn(React, 'useMemo').mockImplementationOnce(callback => {
            locationDisplayedAs = callback();
        });

        useLocationDisplayName(location, sites, floors);

        expect(locationDisplayedAs).toEqual({
            site: 'Site 1',
            building: 'Building 1',
            floor: 'Floor 1',
        });
    });
});
