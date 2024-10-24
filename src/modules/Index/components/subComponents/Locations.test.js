import React from 'react';
import Locations from './Locations';
import { rtlRender, WithRouter, WithReduxStore, act,  waitFor, screen } from 'test-utils';
import { getByTestId } from '@testing-library/dom';
import { fireEvent } from '@testing-library/react';

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(
        <WithRouter>
            <Locations {...testProps} />
         </WithRouter>);
}

describe('Locations panel', () => {
    it('should render loading panel', () => {
        const props = {
            libHoursLoading: true,
            libHoursError: false,
            libHours: null
        };
        const { getByTestId } = setup({...props});
        expect(getByTestId('hours-loader')).toBeInTheDocument();

    });
    it('should render error panel', () => {
        const props = {
            libHoursLoading: false,
            libHoursError: true,
            libHours: null
        };
        const { getByTestId } = setup({...props});
        expect(getByTestId('locations-panel-content')).toBeInTheDocument();

    });

    const vemcountapi = {
        locations: [
        {
            "lid": 3823,
            "name": "Architecture and Music",
            "category": "library",
            "desc": "",
            "url": "https://web.library.uq.edu.au/locations-hours/architecture-music-library",
            "contact": "",
            "lat": "",
            "long": "",
            "color": "#1C6DBD",
            "fn": "",
            "day": "Tuesday",
            "times": {
                "status": "not-set"
            },
            "rendered": "",
            "abbr": "Arch Music",
            "departments": [
                {
                    "lid": 10451,
                    "name": "Collections & space",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3823,
                    "day": "Tuesday",
                    "times": {
                        "status": "open",
                        "hours": [
                            {
                                "from": "7:31am",
                                "to": "7:30pm"
                            },
                            {
                                "from": "7:31am",
                                "to": "7:30pm"
                            }
                        ],
                        "currently_open": true
                    },
                    "rendered": "7:31am - 7:30pm",
                    "open": "07:30:00",
                    "close": "19:30:00"
                },
                {
                    "lid": 10779,
                    "name": "Collections & space",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3823,
                    "day": "Tuesday",
                    "times": {
                        "status": "open",
                        "hours": [
                            {
                                "from": "7:31am",
                                "to": "7:30pm"
                            }
                        ],
                    },
                    "rendered": "7:31am - 7:30pm",
                    "currently_open": true,
                    "open": "07:30:00",
                    "close": "19:30:00"
                }
            ]
        },
        {
            "lid": 4986,
            "name": "AskUs chat & phone assistance",
            "category": "library",
            "desc": "",
            "url": "https://web.library.uq.edu.au/contact-us",
            "contact": "",
            "lat": "",
            "long": "",
            "color": "#000000",
            "fn": "",
            "day": "Tuesday",
            "times": {
                "status": "not-set"
            },
            "rendered": "",
            "abbr": "AskUs",
            "departments": [
                {
                    "lid": 4987,
                    "name": "Chat",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 4986,
                    "day": "Tuesday",
                    "times": {
                        "status": "open",
                        "hours": [
                            {
                                "from": "8am",
                                "to": "8pm"
                            },
                            {
                                "from": "8am",
                                "to": "8pm"
                            }
                        ],
                        "currently_open": true
                    },
                    "rendered": "8am - 8pm",
                    "open": "08:00:00",
                    "close": "20:00:00"
                },
                {
                    "lid": 10490,
                    "name": "Phone",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 4986,
                    "day": "Tuesday",
                    "times": {
                        "status": "open",
                        "hours": [
                            {
                                "from": "8am",
                                "to": "8pm"
                            }
                        ],
                        "currently_open": true
                    },
                    "rendered": "8am - 8pm",
                    "open": "08:00:00",
                    "close": "20:00:00"
                }
            ]
        },
        {
            "lid": 3824,
            "name": "Biological Sciences",
            "category": "library",
            "desc": "",
            "url": "https://web.library.uq.edu.au/locations-hours/biological-sciences-library",
            "contact": "",
            "lat": "",
            "long": "",
            "color": "#0E6E0E",
            "fn": "UQ ID card access after hours. Touch your card to the reader for entry.",
            "day": "Tuesday",
            "times": {
                "status": "open",
                "hours": [
                    {
                        "from": "8am",
                        "to": "8pm"
                    }
                ],
                "currently_open": true
            },
            "rendered": "8am - 8pm",
            "open": "08:00:00",
            "close": "20:00:00",
            "abbr": "Biol Sci",
            "departments": []
        },
        {
            "lid": 38245,
            "name": "Biological SciencesX",
            "category": "library",
            "desc": "",
            "url": "https://web.library.uq.edu.au/locations-hours/biological-sciences-library",
            "contact": "",
            "lat": "",
            "long": "",
            "color": "#0E6E0E",
            "fn": "UQ ID card access after hours. Touch your card to the reader for entry.",
            "day": "Tuesday",
            "times": {
                "status": "open",
                "hours": [
                    {
                        "from": "8am",
                        "to": "8pm"
                    }
                ],
                "currently_open": true
            },
            "rendered": "8am - 8pm",
            "open": "08:00:00",
            "close": "20:00:00",
            "abbr": "Biol SciX",
            "departments": [
                {
                    "lid": 3829,
                    "name": "",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3824,
                    "day": "Tuesday",
                    "times": {
                        "status": "24hours",
                        "currently_open": true
                    },
                    "rendered": "24 Hours",
                    "open": "00:00:00",
                    "close": "24:00:00"
                },
                {
                    "lid": 10792,
                    "name": "",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3824,
                    "day": "Tuesday",
                    "times": {
                        "status": "text",
                        "text": "8am–8pm Virtual Service",
                        "currently_open": false
                    },
                    "rendered": "8am–8pm Virtual Service"
                }
            ]
        },
        {
            "lid": 3825,
            "name": "Dorothy Hill Engineering and Sciences",
            "category": "library",
            "desc": "",
            "url": "https://web.library.uq.edu.au/locations-hours/dorothy-hill-engineering-and-sciences-library",
            "contact": "",
            "lat": "",
            "long": "",
            "color": "#1C6DBD",
            "fn": "",
            "day": "Tuesday",
            "times": {
                "status": "not-set"
            },
            "rendered": "",
            "abbr": "DHEngSci",
            "departments": [
                {
                    "lid": 10458,
                    "name": "Study space",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3825,
                    "day": "Tuesday",
                    "times": {
                        "status": "24hours",
                        "currently_open": true
                    },
                    "rendered": "24 Hours",
                    "open": "00:00:00",
                    "close": "24:00:00"
                },
                {
                    "lid": 9419,
                    "name": "High Use collection",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3825,
                    "day": "Tuesday",
                    "times": {
                        "status": "24hours",
                        "currently_open": true
                    },
                    "rendered": "24 Hours",
                    "open": "00:00:00",
                    "close": "24:00:00"
                },
                {
                    "lid": 3826,
                    "name": "AskUs desk",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3825,
                    "day": "Tuesday",
                    "times": {
                        "status": "open",
                        "hours": [
                            {
                                "from": "9am",
                                "to": "5pm"
                            }
                        ],
                        "currently_open": true
                    },
                    "rendered": "9am - 5pm",
                    "open": "09:00:00",
                    "close": "17:00:00"
                }
            ]
        },
        {
            "lid": 3842,
            "name": "Central",
            "category": "library",
            "desc": "",
            "url": "https://web.library.uq.edu.au/locations-hours/central-library",
            "contact": "",
            "lat": "",
            "long": "",
            "color": "#0E6E0E",
            "fn": "UQ ID card access to the building after hours. Touch your card to the reader for entry.",
            "day": "Tuesday",
            "times": {
                "status": "not-set"
            },
            "rendered": "",
            "abbr": "Central",
            "departments": [
                {
                    "lid": 10457,
                    "name": "Collections & space",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3842,
                    "day": "Tuesday",
                    "times": {
                        "status": "24hours",
                        "currently_open": true
                    },
                    "rendered": "24 Hours",
                    "open": "00:00:00",
                    "close": "24:00:00"
                },
                {
                    "lid": 3843,
                    "name": "AskUs desk",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3842,
                    "day": "Tuesday",
                    "times": {
                        "status": "open",
                        "hours": [
                            {
                                "from": "8am",
                                "to": "6pm"
                            }
                        ],
                        "currently_open": true
                    },
                    "rendered": "8am - 6pm",
                    "open": "08:00:00",
                    "close": "18:00:00"
                }
            ]
        },
        {
            "lid": 3830,
            "name": "Duhig Tower",
            "category": "library",
            "desc": "",
            "url": "https://web.library.uq.edu.au/locations-hours/duhig-tower",
            "contact": "",
            "lat": "",
            "long": "",
            "color": "#0E6E0E",
            "fn": "",
            "day": "Tuesday",
            "times": {
                "status": "not-set"
            },
            "rendered": "",
            "abbr": "Duhig Study",
            "departments": [
                {
                    "lid": 3831,
                    "name": "Study space",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3830,
                    "day": "Tuesday",
                    "times": {
                        "status": "24hours",
                        "currently_open": true
                    },
                    "rendered": "24 Hours",
                    "open": "00:00:00",
                    "close": "24:00:00"
                }
            ]
        },
        {
            "lid": 3967,
            "name": "Dutton Park Health Sciences",
            "category": "library",
            "desc": "",
            "url": "https://web.library.uq.edu.au/locations-hours/dutton-park-health-sciences-library",
            "contact": "",
            "lat": "",
            "long": "",
            "color": "#1C6DBD",
            "fn": "Access to the building after hours is via the level 4 entry on Cornwall Street only.",
            "day": "Tuesday",
            "times": {
                "status": "not-set"
            },
            "rendered": "",
            "abbr": "Dutton Park",
            "departments": [
                {
                    "lid": 3970,
                    "name": "Collections & space",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3967,
                    "day": "Tuesday",
                    "times": {
                        "status": "open",
                        "hours": [
                            {
                                "from": "7am",
                                "to": "10:30am"
                            }
                        ],
                        "currently_open": false
                    },
                    "rendered": "7am - 10:30am",
                    "open": "07:00:00",
                    "close": "22:30:00"
                },
                {
                    "lid": 3969,
                    "name": "AskUs desk",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3967,
                    "day": "Tuesday",
                    "times": {
                        "status": "open",
                        "hours": [
                            {
                                "from": "9am",
                                "to": "5pm"
                            }
                        ],
                        "currently_open": true
                    },
                    "rendered": "9am - 5pm",
                    "open": "09:00:00",
                    "close": "17:00:00"
                }
            ]
        },
        {
            "lid": 3832,
            "name": "FW Robinson Reading Room (Fryer Library)",
            "category": "library",
            "desc": "",
            "url": "https://web.library.uq.edu.au/locations-hours/fw-robinson-reading-room",
            "contact": "",
            "lat": "",
            "long": "",
            "color": "#1C6DBD",
            "fn": "The reading room is by appointment only.",
            "day": "Tuesday",
            "times": {
                "status": "not-set"
            },
            "rendered": "",
            "abbr": "Fryer",
            "departments": [
                {
                    "lid": 3851,
                    "name": "Service & collections",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3832,
                    "day": "Tuesday",
                    "times": {
                        "status": "ByApp",
                        "currently_open": true
                    },
                    "rendered": "By Appointment"
                }
            ]
        },
        {
            "lid": 3833,
            "name": "JK Murray (UQ Gatton)",
            "category": "library",
            "desc": "",
            "url": "https://web.library.uq.edu.au/locations-hours/uq-gatton-library-jk-murray-library",
            "contact": "",
            "lat": "",
            "long": "",
            "color": "#0E6E0E",
            "fn": "UQ ID card access after hours. Touch your card to the reader for entry.",
            "day": "Tuesday",
            "times": {
                "status": "not-set"
            },
            "rendered": "",
            "abbr": "Gatton",
            "departments": [
                {
                    "lid": 8867,
                    "name": "Collections & space",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3833,
                    "day": "Tuesday",
                    "times": {
                        "status": "24hours",
                        "currently_open": true
                    },
                    "rendered": "24 Hours",
                    "open": "00:00:00",
                    "close": "24:00:00"
                },
                {
                    "lid": 3834,
                    "name": "AskUs desk",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3833,
                    "day": "Tuesday",
                    "times": {
                        "status": "open",
                        "hours": [
                            {
                                "from": "9am",
                                "to": "5pm"
                            }
                        ],
                        "currently_open": true
                    },
                    "rendered": "9am - 5pm",
                    "open": "09:00:00",
                    "close": "17:00:00"
                }
            ]
        },
        {
            "lid": 3841,
            "name": "Walter Harrison Law",
            "category": "library",
            "desc": "",
            "url": "https://web.library.uq.edu.au/locations-hours/law-library-walter-harrison-library",
            "contact": "",
            "lat": "",
            "long": "",
            "color": "#1C6DBD",
            "fn": "UQ ID card access after hours. Touch your card to the reader for entry.",
            "day": "Tuesday",
            "times": {
                "status": "not-set"
            },
            "rendered": "",
            "abbr": "Law",
            "departments": [
                {
                    "lid": 4801,
                    "name": "Collections & space",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3841,
                    "day": "Tuesday",
                    "times": {
                        "status": "24hours",
                        "currently_open": true
                    },
                    "rendered": "24 Hours",
                    "open": "00:00:00",
                    "close": "24:00:00"
                },
                {
                    "lid": 10780,
                    "name": "AskUs desk",
                    "category": "department",
                    "desc": "",
                    "url": "",
                    "contact": "",
                    "lat": "",
                    "long": "",
                    "color": "#000000",
                    "parent_lid": 3841,
                    "day": "Tuesday",
                    "times": {
                        "status": "text",
                        "text": "8am–8pm Virtual Service",
                        "currently_open": false
                    },
                    "rendered": "8am–8pm Virtual Service"
                }
            ]
        },
        {
            "lid": 3966,
            "name": "Whitty building, Mater",
            "category": "library",
            "desc": "",
            "url": "https://web.library.uq.edu.au/locations-hours",
            "contact": "",
            "lat": "",
            "long": "",
            "color": "#0E6E0E",
            "fn": "Access to Whitty Building is restricted to UQ Mater students on clinical placement.",
            "day": "Tuesday",
            "times": {
                "status": "not-set"
            },
            "rendered": "",
            "abbr": "Whitty Mater"
        },
        {
            "lid": null,
            "name": "Doesnt Exist, Mater",
            "category": "library",
            "desc": "",
            "url": "https://web.library.uq.edu.au/locations-hours",
            "contact": "",
            "lat": "",
            "long": "",
            "abbr": "Herston",
            "color": "#0E6E0E",
            "fn": "Access to Whitty Building is restricted to UQ Mater students on clinical placement.",
            "day": "Tuesday",
            "times": {
                "status": "not-set"
            },
            "rendered": "",
            "abbr": "Whitty Mater"
        }
    
    ]};

    it('should render hours panel', () => {
        const props = {
            libHoursLoading: false,
            libHoursError: false,
            libHours: vemcountapi
        };
        const { getByTestId } = setup({...props});
        expect(getByTestId('locations-panel-content')).toBeInTheDocument();

    });

    it('should handle display resize', () => {
        const props = {
            libHoursLoading: false,
            libHoursError: false,
            libHours: vemcountapi
        };
        const { getByTestId, queryByTestId } = setup({...props});
        
        expect(getByTestId('hours-item-askus')).toBeInTheDocument();
        window.innerWidth = 400;
        fireEvent.resize(window, {target: {width: 400, height: 600}});
        expect(queryByTestId('hours-item-askus')).toBeNull();

    });


});

