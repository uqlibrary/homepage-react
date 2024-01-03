const CAMPUS_ST_LUCIA = 'St Lucia';
const CAMPUS_GATTON = 'Gatton';
const CAMPUS_HERSTON = 'Herston';
const CAMPUS_DUTTON_PARK = 'Dutton Park';

export const locale = {
    tooltip: 'Click to update your preferred campus, currently [currentLocation]',
    noLocationSet: 'not set',
    noLocationSetLabel: 'Set a preferred campus',
    menuTitle: 'Select a preferred location',
    locations: [
        {
            displayName: 'No preference',
            value: 'not set',
        },
        {
            displayName: 'St Lucia',
            value: CAMPUS_ST_LUCIA,
        },
        {
            displayName: 'Gatton',
            value: CAMPUS_GATTON,
        },
        {
            displayName: 'Herston',
            value: CAMPUS_HERSTON,
        },
        {
            displayName: 'Dutton Park',
            value: CAMPUS_DUTTON_PARK,
        },
    ],
    // tie a campus to a building, for highlighting the chosen location
    computersCampusMap: {
        // the keys in this must match the names found in the Computer Availablity api result
        'Architecture &amp; Music Library': CAMPUS_ST_LUCIA,
        'Biological Sciences Library': CAMPUS_ST_LUCIA,
        'Central Library': CAMPUS_ST_LUCIA,
        'D.H. Engineering &amp; Sciences Library': CAMPUS_ST_LUCIA,
        'Duhig Building': CAMPUS_ST_LUCIA,
        'Fryer Library': CAMPUS_ST_LUCIA,
        'Gatton Campus Library': CAMPUS_GATTON,
        'Herston Health Sciences Library': CAMPUS_HERSTON,
        'Law Library': CAMPUS_ST_LUCIA,
        'Whitty Mater': 'Other',
        'Dutton Park Health Sciences Library': CAMPUS_DUTTON_PARK,
    },
    hoursCampusMap: {
        // the keys in this must match the abbr values found in the Hours api result
        'Arch Music': CAMPUS_ST_LUCIA,
        AskUs: 'Online',
        'Biol Sci': CAMPUS_ST_LUCIA,
        Central: CAMPUS_ST_LUCIA,
        DHEngSci: CAMPUS_ST_LUCIA,
        'Duhig Study': CAMPUS_ST_LUCIA,
        Fryer: CAMPUS_ST_LUCIA,
        Gatton: CAMPUS_GATTON,
        Herston: CAMPUS_HERSTON,
        Law: CAMPUS_ST_LUCIA,
        'Whitty Mater': 'Other',
        'Dutton Park': CAMPUS_DUTTON_PARK,
        Bundaberg: 'Other',
        HerveyBay: 'Other',
        Rockhampton: 'Other',
        Toowoomba: 'Other',
    },
};
