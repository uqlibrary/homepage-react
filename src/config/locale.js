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

    // this table maps those locations who exist on vemcount against their matching springshare location
    // note: not all locations have vemcount people-counting gates
    vemcountSpringshareMapping: [
        {
            springshareId: 3967,
            vemcountId: 14980,
            name: 'Dutton park', // this doesn't need to match either system, its for the developer to not have to track raw numbers
        },
        {
            springshareId: 3842,
            vemcountId: 14975,
            name: 'Central',
        },
        {
            springshareId: 3823,
            vemcountId: 14974,
            name: 'Architecture',
        },
        {
            springshareId: 3824,
            vemcountId: 14977,
            name: 'BSL',
        },
        {
            springshareId: 3825,
            vemcountId: 14979,
            name: 'DHESL',
        },
        {
            springshareId: 3830,
            vemcountId: 14976,
            name: 'Duhig tower',
        },
        {
            springshareId: 3833,
            vemcountId: 14985,
            name: 'Gatton',
        },
        {
            springshareId: 3838,
            vemcountId: 14983,
            name: 'Herston',
        },
        {
            springshareId: 3841,
            vemcountId: 14978,
            name: 'Law',
        },
    ],
};
