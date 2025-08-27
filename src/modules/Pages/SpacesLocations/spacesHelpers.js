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
    let floorName = `Floor ${bookableSpace?.space_floor_name}`;
    if (!!bookableSpace.space_is_ground_floor) {
        floorName = 'Ground floor';
    } else if (isInt(bookableSpace?.space_floor_name)) {
        // some floors are like "2A"
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
            <div>{bookableSpace?.space_building_name}</div>
            <div>{bookableSpace?.space_site_name} Campus</div>
        </>
    );
}
