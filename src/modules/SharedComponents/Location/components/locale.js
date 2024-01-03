export const locale = {
    tooltip: 'Click to update your preferred campus, currently [currentLocation]',
    noLocationSet: 'not set',
    noLocationSetLabel: 'Set a preferred campus',
    menuTitle: 'Select a preferred location',
    locations: [
        {
            location: 'No preference',
            value: 'not set',
        },
        {
            location: 'St Lucia',
            value: 'St Lucia',
        },
        {
            location: 'Gatton',
            value: 'Gatton',
        },
        {
            location: 'Herston',
            value: 'Herston',
        },
        {
            location: 'Dutton Park',
            value: 'Dutton Park',
        },
    ],
    // tie a campus to a building, for highlighting the chosen location
    computersCampusMap: {
        // the keys in this must match the names found in the Computer Availablity api result
        'Architecture &amp; Music Library': 'St Lucia',
        'Biological Sciences Library': 'St Lucia',
        'Central Library': 'St Lucia',
        'D.H. Engineering &amp; Sciences Library': 'St Lucia',
        'Duhig Building': 'St Lucia',
        'Fryer Library': 'St Lucia',
        'Gatton Campus Library': 'Gatton',
        'Herston Health Sciences Library': 'Herston',
        'Law Library': 'St Lucia',
        'Whitty Mater': 'Other',
        'Dutton Park Health Sciences Library': 'Dutton Park',
    },
    hoursCampusMap: {
        // the keys in this must match the abbr values found in the Hours api result
        'Arch Music': 'St Lucia',
        AskUs: 'Online',
        'Biol Sci': 'St Lucia',
        Central: 'St Lucia',
        DHEngSci: 'St Lucia',
        'Duhig Study': 'St Lucia',
        Fryer: 'St Lucia',
        Gatton: 'Gatton',
        Herston: 'Herston',
        Law: 'St Lucia',
        'Whitty Mater': 'Other',
        'Dutton Park': 'Dutton Park',
        Bundaberg: 'Other',
        HerveyBay: 'Other',
        Rockhampton: 'Other',
        Toowoomba: 'Other',
    },
};
