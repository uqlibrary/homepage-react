import { buildFacilityGroupOrderPayload, orderFacilityTypeGroups } from './facilityGroupOrderHelpers';

describe('facilityGroupOrderHelpers', () => {
    it('orders groups by explicit positive group order ascending', () => {
        const groups = [
            { facility_type_group_id: 1, facility_type_group_name: 'B', facility_type_group_order: 2 },
            { facility_type_group_id: 2, facility_type_group_name: 'A', facility_type_group_order: 1 },
            { facility_type_group_id: 3, facility_type_group_name: 'C', facility_type_group_order: 3 },
        ];

        const ordered = orderFacilityTypeGroups(groups);

        expect(ordered.map(group => group.facility_type_group_id)).toEqual([2, 1, 3]);
    });

    it('keeps current relative order for groups without a valid group order', () => {
        const groups = [
            { facility_type_group_id: 1, facility_type_group_name: 'One', facility_type_group_order: 1 },
            { facility_type_group_id: 2, facility_type_group_name: 'Unordered A', facility_type_group_order: null },
            { facility_type_group_id: 3, facility_type_group_name: 'Unordered B' },
            { facility_type_group_id: 4, facility_type_group_name: 'Unordered C', facility_type_group_order: 0 },
        ];

        const ordered = orderFacilityTypeGroups(groups);

        expect(ordered.map(group => group.facility_type_group_id)).toEqual([1, 2, 3, 4]);
    });

    it('treats non-integer and non-positive orders as unordered', () => {
        const groups = [
            { facility_type_group_id: 1, facility_type_group_name: 'Float', facility_type_group_order: 1.5 },
            { facility_type_group_id: 2, facility_type_group_name: 'Negative', facility_type_group_order: -1 },
            { facility_type_group_id: 3, facility_type_group_name: 'Valid', facility_type_group_order: 2 },
            { facility_type_group_id: 4, facility_type_group_name: 'Valid first', facility_type_group_order: 1 },
        ];

        const ordered = orderFacilityTypeGroups(groups);

        expect(ordered.map(group => group.facility_type_group_id)).toEqual([4, 3, 1, 2]);
    });

    it('builds a sequential payload from current group list order', () => {
        const groups = [{ facility_type_group_id: 11 }, { facility_type_group_id: 7 }, { facility_type_group_id: 3 }];

        expect(buildFacilityGroupOrderPayload(groups)).toEqual([
            { facility_type_group_id: 11, facility_type_group_order: 1 },
            { facility_type_group_id: 7, facility_type_group_order: 2 },
            { facility_type_group_id: 3, facility_type_group_order: 3 },
        ]);
    });
});
