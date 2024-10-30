const CAMPUS_ST_LUCIA = 'St Lucia';
const CAMPUS_GATTON = 'Gatton';
const CAMPUS_HERSTON = 'Herston';
const CAMPUS_DUTTON_PARK = 'Dutton Park';

export const locale = {
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
    hoursCampusMap: {
        // the keys in this must match the abbr values found in the Locations api result
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
