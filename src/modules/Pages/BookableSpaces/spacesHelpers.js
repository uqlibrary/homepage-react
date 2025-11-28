import React from 'react';

export function getOrdinalSuffixFor(number) {
    const mod10 = number % 10;
    const mod100 = number % 100;
    if (mod10 === 1 && mod100 !== 11) {
        return 'st';
    }
    if (mod10 === 2 && mod100 !== 12) {
        return 'nd';
    }
    if (mod10 === 3 && mod100 !== 13) {
        return 'rd';
    }
    return 'th';
}

export const isInt = value => {
    const x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
};

export function getFriendlyFloorName(bookableSpace) {
    let floorName = bookableSpace?.space_floor_name;
    if (!!bookableSpace?.space_is_ground_floor) {
        floorName = 'Ground floor';
    } else if (isInt(bookableSpace?.space_floor_name)) {
        // some floors are like "2A" so can't be made an ordinal number
        const floorNumberAsOrdinal =
            bookableSpace?.space_floor_name + getOrdinalSuffixFor(bookableSpace?.space_floor_name);
        floorName = `${floorNumberAsOrdinal} Floor`;
    }
    return !!bookableSpace?.space_precise ? `${bookableSpace?.space_precise}, ${floorName}` : floorName;
}

export function getFriendlyLocationDescription(bookableSpace) {
    return (
        <>
            <div>{getFriendlyFloorName(bookableSpace)}</div>
            {bookableSpace?.space_library_name && <div>{bookableSpace?.space_library_name}</div>}
            <div>
                {bookableSpace?.space_building_name} (Building {bookableSpace?.space_building_number})
            </div>
            <div>{`${bookableSpace?.space_campus_name} Campus`}</div>
        </>
    );
}
export const getFlatFacilityTypeList = facilityTypes => {
    return (
        facilityTypes?.data?.facility_type_groups?.flatMap(group => {
            const groupId = group.facility_type_group_id;
            return group?.facility_type_children?.map(child => ({
                facility_type_group_id: groupId,
                facility_type_id: child.facility_type_id,
                facility_type_name: child.facility_type_name,
            }));
        }) || []
    );
};
export const getFilteredFacilityTypeList = (bookableSpacesRoomList, facilityTypeList) => {
    // get a list of the filters used in spaces
    const spaceFilters = bookableSpacesRoomList?.data?.locations
        .flatMap(location => location.facility_types || [])
        .map(facilityType => facilityType.facility_type_id);
    const spaceFiltersSet = new Set(spaceFilters);

    // filter facility types so we only show the checkboxes where there is an associated space
    // (remove the group completely if it has no shown checkboxes)
    return {
        ...facilityTypeList,
        data: {
            ...facilityTypeList?.data,
            facility_type_groups: facilityTypeList?.data?.facility_type_groups
                .map(group => ({
                    ...group,
                    facility_type_children: (group.facility_type_children || []).filter(child =>
                        spaceFiltersSet.has(child.facility_type_id),
                    ),
                }))
                .filter(group => group.facility_type_children.length > 0),
        },
    };
};
