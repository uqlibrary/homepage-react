export default {
    "status": "OK",
    "data": {
        "known_space_types": [
            {
                "space_type_id": 1,
                "space_type_name": "Communal space",
                "space_type_description": "Designed for communal activities, these spaces typically include seating areas, tables, and other amenities to support group interactions and social engagement.",
                "spaces_count": 1
            },
            {
                "space_type_id": 2,
                "space_type_name": "Training room",
                "space_type_description": "Designed for training and educational activities, these spaces typically include seating areas, tables, and other amenities to support learning and group activities.",
                "spaces_count": 1
            },
            {
                "space_type_id": 3,
                "space_type_name": "Meeting room",
                "space_type_description": "Designed for meetings and collaborative work, these spaces typically include seating areas, tables, and other amenities to support discussions and group activities.",
                "spaces_count": 1
            },
            {
                "space_type_id": 4,
                "space_type_name": "Individual study",
                "space_type_description": "Designed for individual study, these spaces typically include seating areas, tables, and other amenities to support focused, independent work.",
                "spaces_count": 5
            },
            {
                "space_type_id": 5,
                "space_type_name": "Individual study pod",
                "space_type_description": "Designed for individual study, these spaces typically include local, isolated areas and amenities to support focused, independent work.",
                "spaces_count": 1
            },
            {
                "space_type_id": 6,
                "space_type_name": "An unallocated space type",
                "space_type_description": "A space type that has not yet been allocated to any spaces. This is used to test the display of space types with no spaces allocated to them.",
                "spaces_count": 1
            }
        ],
        "locations": [{
            space_id: 123456,
            space_uuid: "f98g_fwas_5g33",
            space_name: "01-W431",
            space_precise: "Westernmost corner",
            space_description: "<p>A space in the Law library. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p> <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>",
            space_photo_url: "https://campuses.uq.edu.au/files/35116/01-E107%20%28Resize%29.jpg", // https://campuses.uq.edu.au/list-rooms
            space_photo_description: 'a large room with 6 large round tables, each wih multiple chairs',
            space_opening_hours_id: 4801,
            space_services_page: "https://web.library.uq.edu.au/visit/walter-harrison-law-library",
            created_at: "2025-08-01 10:00:00",
            updated_at: "2025-08-01 11:00:00",
            "space_capacity": 7,
            space_latitude: "-27.49718",
            space_longitude: "153.01214",
            space_zlevel: 1,
            space_type: 'Communal space',
            space_floor_id: 1,
            space_floor_name: "2",
            space_is_ground_floor: 0,
            space_library_id: 1,
            space_library_name: 'Walter Harrison Law Library',
            space_building_name: "Forgan Smith Building",
            space_building_number: "0001",
            space_campus_id: 1,
            space_type_id: 1,
            space_type_details: {
                "space_type_id": 1,
                "space_type_name": "Communal space",
                "space_type_description": "Designed for communal activities, these spaces typically include seating areas, tables, and other amenities to support group interactions and social engagement."
            },
            space_campus_name: "St Lucia",
            "space_campus_number": "01",
            space_draftmode: true,
            "space_external_book_url": 'https://uqbookit.uq.edu.au/#/app/booking-types/111',
            // Dynamic outages: one current, one upcoming
            space_outages: (() => {
                const now = new Date();
                const pad = v => String(v).padStart(2, '0');
                const fmt = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
                // Current outage: now-1h to now+1h
                const currentStart = new Date(now.getTime() - 60*60*1000);
                const currentEnd = new Date(now.getTime() + 60*60*1000);
                // Upcoming outage: now+7d to now+7d+2h
                const upcomingStart = new Date(now.getTime() + 7*24*60*60*1000);
                const upcomingEnd = new Date(now.getTime() + 7*24*60*60*1000 + 2*60*60*1000);
                return [
                    {
                        space_outage_id: 9002,
                        space_id: 123456,
                        space_outage_start: fmt(upcomingStart),
                        space_outage_end: fmt(upcomingEnd),
                        space_outage_reason: 'Deep cleaning',
                    },
                ];
            })(),
            facility_types: [
                {
                    "facility_type_id": 23,
                    "facility_type_name": "Toilets, female"
                },
                {
                    "facility_type_id": 22,
                    "facility_type_name": "Toilets, male"
                },
                {
                    "facility_type_id": 29,
                    "facility_type_name": "Recharge Station"
                },
                {
                    "facility_type_id": 31,
                    "facility_type_name": "Self-printing & scanning"
                },
                {
                    "facility_type_id": 17,
                    "facility_type_name": "Low noise level"
                },
                {
                    "facility_type_id": 5,
                    "facility_type_name": "Computer"
                },
                {
                    "facility_type_id": 33,
                    "facility_type_name": "Client accessible power point"
                },
                {
                    "facility_type_id": 38,
                    "facility_type_name": "Whiteboard"
                },
                {
                    "facility_type_id": 39,
                    "facility_type_name": "Adjustable desks"
                },
                {
                    "facility_type_id": 8,
                    "facility_type_name": "AV equipment"
                },
                {
                    "facility_type_id": 13,
                    "facility_type_name": "Postgraduate spaces"
                },
                {
                    "facility_type_id": 14,
                    "facility_type_name": "Undergrad spaces"
                },
                {
                    "facility_type_id": 57,
                    "facility_type_name": "Contains Artwork"
                }
            ],
        }, {
            space_id: 1234544,
            space_uuid: "df40_2jsf_zdk5",
            space_name: "6078",
            space_precise: "",
            space_description: "<p>A space at Dutton Park. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere.</p>",
            space_photo_url: "",
            space_photo_description: "",
            space_opening_hours_id: 3970,
            space_type_id: 2,
            space_type_details: {
                "space_type_id": 2,
                "space_type_name": "Training room",
                "space_type_description": "Designed for training and educational activities, these spaces typically include seating areas, tables, and other amenities to support learning and group activities."
            },
            space_services_page: "https://web.library.uq.edu.au/visit/dutton-park-health-sciences-library",
            created_at: "2025-08-01 10:00:00",
            updated_at: "2025-08-01 11:00:00",
            "space_capacity": 5,
            space_latitude: "-27.50008",
            space_longitude: "153.03024",
            space_zlevel: 1,
            "space_external_book_url": 'https://uqbookit.uq.edu.au/#/app/booking-types/222',
            space_outages: (() => {
                const now = new Date();
                const pad = v => String(v).padStart(2, '0');
                const fmt = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
                const upcomingStart = new Date(now.getTime() + 24*60*60*1000);
                const upcomingEnd = new Date(now.getTime() + 24*60*60*1000 + 150*60*1000);
                return [
                    {
                        space_outage_id: 9003,
                        space_id: 1234544,
                        space_outage_start: fmt(upcomingStart),
                        space_outage_end: fmt(upcomingEnd),
                        space_outage_reason: 'Furniture replacement',
                    },
                ];
            })(),
            facility_types: [
                {
                    "facility_type_id": 23,
                    "facility_type_name": "Toilets, female"
                },
                {
                    "facility_type_id": 22,
                    "facility_type_name": "Toilets, male"
                },
                {
                    "facility_type_id": 29,
                    "facility_type_name": "Recharge Station"
                },
                {
                    "facility_type_id": 31,
                    "facility_type_name": "Self-printing & scanning"
                },
                {
                    "facility_type_id": 5,
                    "facility_type_name": "Computer"
                },
                {
                    "facility_type_id": 32,
                    "facility_type_name": "BYOD station"
                },
                {
                    "facility_type_id": 33,
                    "facility_type_name": "Client accessible power point"
                },
                {
                    "facility_type_id": 34,
                    "facility_type_name": "on-desk USB-A"
                },
                {
                    "facility_type_id": 35,
                    "facility_type_name": "Qi chargers"
                },
                {
                    "facility_type_id": 36,
                    "facility_type_name": "On-desk USB-C, Low Power "
                },
                {
                    "facility_type_id": 42,
                    "facility_type_name": "General Collections"
                },
                {
                    "facility_type_id": 44,
                    "facility_type_name": "Requested items"
                },
                {
                    "facility_type_id": 45,
                    "facility_type_name": "Lending"
                },
                {
                    "facility_type_id": 46,
                    "facility_type_name": "Return station"
                },
                {
                    "facility_type_id": 10,
                    "facility_type_name": "High noise level "
                }
            ],
            space_type: 'Training room',
            space_floor_id: 65,
            space_floor_name: "6",
            space_is_ground_floor: 0,
            space_library_id: 10,
            space_library_name: 'Dutton Park Health Sciences',
            space_building_name: "Pharmacy Australia Centre of Excellence",
            space_building_number: "870",
            space_campus_id: 3,
            space_campus_name: "Dutton Park",
            space_campus_number: "45",
            space_draftmode: false,
        }, {
            space_id: 43534,
            space_uuid: "97fd5_nm39_gh29",
            space_name: "46-342/343",
            space_precise: "Eastern corner",
            space_highlighted: true,
            space_description: "<p>A comfortable meeting and study space located in the Andrew N. Liveris building at St Lucia campus. Ideal for small group collaboration or focused individual work, with great natural light and a range of modern facilities.</p>",
            space_photo_url: "https://campuses.uq.edu.au/files/35424/46-342-343.JPG", // https://campuses.uq.edu.au/list-rooms
            space_photo_description: 'a large room with many tables, each wih 4 chairs',
            space_opening_hours_id: 10451,
            space_services_page: null,
            created_at: "2025-08-01 10:00:00",
            updated_at: "2025-08-01 11:00:00",
            "space_capacity": 1,
            space_latitude: "-27.49928",
            space_longitude: "153.01344",
            space_zlevel: 3,
            "space_external_book_url": null,
            space_outages: [
                {
                    space_outage_id: 9004,
                    space_id: 43534,
                    space_outage_start: '2026-04-17 09:00:00',
                    space_outage_end: '2026-04-17 11:00:00',
                    space_outage_reason: 'Completed projector repair',
                },
            ],
            space_type_id: 3,
            space_type_details: {
                "space_type_id": 3,
                "space_type_name": "Meeting room",
                "space_type_description": "Designed for meetings and collaborative work, these spaces typically include seating areas, tables, and other amenities to support discussions and group activities."
            },
            facility_types: [
                {
                    "facility_type_id": 23,
                    "facility_type_name": "Toilets, female"
                },
                {
                    "facility_type_id": 22,
                    "facility_type_name": "Toilets, male"
                },
                {
                    "facility_type_id": 29,
                    "facility_type_name": "Recharge Station"
                },
                {
                    "facility_type_id": 31,
                    "facility_type_name": "Self-printing & scanning"
                },
                {
                    "facility_type_id": 33,
                    "facility_type_name": "Client accessible power point"
                },
                {
                    "facility_type_id": 8,
                    "facility_type_name": "AV equipment"
                },
                {
                    "facility_type_id": 50,
                    "facility_type_name": "Natural"
                },
                {
                    "facility_type_id": 13,
                    "facility_type_name": "Postgraduate spaces"
                },
                {
                    "facility_type_id": 14,
                    "facility_type_name": "Undergrad spaces"
                }
            ],
            space_type: 'Meeting room',
            space_floor_id: 72,
            space_floor_name: "2A",
            space_is_ground_floor: 0,
            space_library_id: 46,
            space_library_name: "imaginary Liveris Library",
            space_building_name: "Andrew N. Liveris",
            space_building_number: "0046",
            space_campus_id: 1,
            space_campus_name: "St Lucia",
            "space_campus_number": "01",
            space_draftmode: false,
        }, {
            "space_id": 1,
            "space_uuid": "a00de3d4-7e11-47eb-8079-532bdef80def",
            "space_name": "354",
            "space_precise": null,
            "space_description": '<p>Space desciption field being used to report the mock data has has no linked springshare hours.</p>',
            "space_photo_url": null,
            "space_photo_description": null,
            "space_opening_hours_id": 10451,
            "space_services_page": null,
            "created_at": "2025-10-07T05:32:53.000000Z",
            "updated_at": "2025-10-30T05:09:57.000000Z",
            "space_capacity": 6,
            "space_latitude": -27.49904,
            "space_longitude": 153.01453,
            "space_zlevel": 1,
            "space_type": "Individual study",
            "space_floor_id": 3,
            "space_floor_name": "3",
            "space_is_ground_floor": false,
            "space_library_id": 3,
            "space_library_name": "Architecture and Music Library",
            "space_building_number": "51",
            "space_building_name": "Zelman Cowen Building",
            "space_building_ground_floor_id": null,
            "space_library_about_page_default": "https:\/\/web.library.uq.edu.au\/visit\/architecture-and-music-library",
            "space_campus_id": 1,
            "space_campus_name": "St Lucia",
            "space_campus_number": "01",
            "space_draftmode": false,
            "space_external_book_url": null,
            space_type_id: 4,
            space_type_details: {
                "space_type_id": 4,
                "space_type_name": "Individual study",
                "space_type_description": "Designed for individual study, these spaces typically include seating areas, tables, and other amenities to support focused, independent work."
            },
            "facility_types": [
                {
                    "facility_type_id": 23,
                    "facility_type_name": "Toilets, female"
                },
                {
                    "facility_type_id": 22,
                    "facility_type_name": "Toilets, male"
                },
                {
                    "facility_type_id": 29,
                    "facility_type_name": "Recharge Station"
                },
                {
                    "facility_type_id": 31,
                    "facility_type_name": "Self-printing & scanning"
                },
                {
                    "facility_type_id": 5,
                    "facility_type_name": "Computer"
                },
                {
                    "facility_type_id": 32,
                    "facility_type_name": "BYOD station"
                },
                {
                    "facility_type_id": 33,
                    "facility_type_name": "Client accessible power point"
                },
                {
                    "facility_type_id": 34,
                    "facility_type_name": "on-desk USB-A"
                },
                {
                    "facility_type_id": 35,
                    "facility_type_name": "Qi chargers"
                },
                {
                    "facility_type_id": 36,
                    "facility_type_name": "On-desk USB-C, Low Power "
                },
                {
                    "facility_type_id": 42,
                    "facility_type_name": "General Collections"
                },
                {
                    "facility_type_id": 44,
                    "facility_type_name": "Requested items"
                },
                {
                    "facility_type_id": 45,
                    "facility_type_name": "Lending"
                },
                {
                    "facility_type_id": 46,
                    "facility_type_name": "Return station"
                },
                {
                    "facility_type_id": 10,
                    "facility_type_name": "High noise level "
                }
            ]
        },
            {
                "space_id": 2,
                "space_uuid": "a00de509-570b-4acb-9ca1-89c4baebe2e6",
                "space_name": "339",
                "space_precise": null,
                "space_description": null,
                "space_photo_url": null,
                "space_photo_description": null,
                "space_opening_hours_id": 10451,
                "space_services_page": null,
                "created_at": "2025-10-07T05:36:16.000000Z",
                "updated_at": "2025-12-03T01:54:01.000000Z",
                "space_capacity": 8,
                "space_latitude": -27.49893,
                "space_longitude": 153.01465,
                "space_zlevel": 1,
                "space_type": "Individual study",
                "space_floor_id": 3,
                "space_floor_name": "3",
                "space_is_ground_floor": false,
                "space_library_id": 3,
                "space_library_name": "Architecture and Music Library",
                "space_building_number": "51",
                "space_building_name": "Zelman Cowen Building",
                "space_building_ground_floor_id": null,
                "space_library_about_page_default": "https:\/\/web.library.uq.edu.au\/visit\/architecture-and-music-library",
                "space_campus_id": 1,
                "space_campus_name": "St Lucia",
                "space_campus_number": "01",
                "space_draftmode": false,
                "space_external_book_url": 'https://uqbookit.uq.edu.au/#/app/booking-types/333',
                space_outages: (() => {
                    const moment = require('moment');
                    return [
                        {
                            space_outage_id: 9006,
                            space_id: 2,
                            space_outage_start: moment().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                            space_outage_end: moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                            space_outage_reason: 'Lighting maintenance',
                        },
                    ];
                })(),
                space_type_id: 4,
                space_type_details: {
                    "space_type_id": 4,
                    "space_type_name": "Individual study",
                    "space_type_description": "Designed for individual study, these spaces typically include seating areas, tables, and other amenities to support focused, independent work."
                },
                "facility_types": [
                    {
                        "facility_type_id": 23,
                        "facility_type_name": "Toilets, female"
                    },
                    {
                        "facility_type_id": 22,
                        "facility_type_name": "Toilets, male"
                    },
                    {
                        "facility_type_id": 29,
                        "facility_type_name": "Recharge Station"
                    },
                    {
                        "facility_type_id": 31,
                        "facility_type_name": "Self-printing & scanning"
                    },
                    {
                        "facility_type_id": 17,
                        "facility_type_name": "Low noise level"
                    },
                    {
                        "facility_type_id": 5,
                        "facility_type_name": "Computer"
                    },
                    {
                        "facility_type_id": 33,
                        "facility_type_name": "Client accessible power point"
                    },
                    {
                        "facility_type_id": 38,
                        "facility_type_name": "Whiteboard"
                    },
                    {
                        "facility_type_id": 39,
                        "facility_type_name": "Adjustable desks"
                    },
                    {
                        "facility_type_id": 8,
                        "facility_type_name": "AV equipment"
                    },
                    {
                        "facility_type_id": 13,
                        "facility_type_name": "Postgraduate spaces"
                    },
                    {
                        "facility_type_id": 14,
                        "facility_type_name": "Undergrad spaces"
                    }
                ]
            },
            {
                "space_id": 3,
                "space_uuid": "a00df52a-2308-40e1-85ef-d3cf3421edd8",
                "space_name": "340",
                "space_precise": null,
                "space_description": null,
                "space_photo_url": null,
                "space_photo_description": null,
                "space_opening_hours_id": null,
                "space_services_page": null,
                "created_at": "2025-10-07T06:21:22.000000Z",
                "updated_at": "2025-10-07T06:21:22.000000Z",
                "space_capacity": 12,
                "space_latitude": -27.498895,
                "space_longitude": 153.014682,
                "space_zlevel": 1,
                "space_type": "Individual study pod",
                "space_floor_id": 3,
                "space_floor_name": "3",
                "space_is_ground_floor": false,
                "space_library_id": 3,
                "space_library_name": "Architecture and Music Library",
                "space_building_number": "51",
                "space_building_name": "Zelman Cowen Building",
                "space_building_ground_floor_id": null,
                "space_library_about_page_default": "https:\/\/web.library.uq.edu.au\/visit\/architecture-and-music-library",
                "space_campus_id": 1,
                "space_campus_name": "St Lucia",
                "space_campus_number": "01",
                "space_draftmode": false,
                "space_external_book_url": null,
                "facility_types": [],
                space_type_id: 5,
                space_type_details: {
                    "space_type_id": 5,
                    "space_type_name": "Individual study pod",
                    "space_type_description": "Designed for individual study, these spaces typically include local, isolated areas and amenities to support focused, independent work."
                },
            },
            {
                "space_id": 4,
                "space_uuid": "a029666f-16e1-4dea-968b-31440e6bfaee",
                "space_name": "341",
                "space_precise": null,
                "space_description": null,
                "space_photo_url": null,
                "space_photo_description": null,
                "space_opening_hours_id": 10451,
                "space_services_page": null,
                "created_at": "2025-10-20T21:45:26.000000Z",
                "updated_at": "2025-10-20T21:45:26.000000Z",
                "space_capacity": 20,
                "space_latitude": -27.49893,
                "space_longitude": 153.01457,
                "space_zlevel": 1,
                "space_type": "An unallocated space type",
                "space_floor_id": 3,
                "space_floor_name": "3",
                "space_is_ground_floor": false,
                "space_library_id": 3,
                "space_library_name": "Architecture and Music Library",
                "space_building_number": "51",
                "space_building_name": "Zelman Cowen Building",
                "space_building_ground_floor_id": null,
                "space_library_about_page_default": "https:\/\/web.library.uq.edu.au\/visit\/architecture-and-music-library",
                "space_campus_id": 1,
                "space_campus_name": "St Lucia",
                "space_campus_number": "01",
                "space_draftmode": false,
                "space_external_book_url": 'https://uqbookit.uq.edu.au/#/app/booking-types/444',
                space_type_id: 6,
                space_type_details: {
                    "space_type_id": 6,
                    "space_type_name": "An unallocated space type",
                    "space_type_description": "A space type that has not yet been allocated to any spaces. This is used to test the display of space types with no spaces allocated to them."
                },
                "facility_types": [
                    {
                        "facility_type_id": 23,
                        "facility_type_name": "Toilets, female"
                    },
                    {
                        "facility_type_id": 22,
                        "facility_type_name": "Toilets, male"
                    },
                    {
                        "facility_type_id": 29,
                        "facility_type_name": "Recharge Station"
                    },
                    {
                        "facility_type_id": 31,
                        "facility_type_name": "Self-printing & scanning"
                    },
                    {
                        "facility_type_id": 33,
                        "facility_type_name": "Client accessible power point"
                    },
                    {
                        "facility_type_id": 8,
                        "facility_type_name": "AV equipment"
                    },
                    {
                        "facility_type_id": 50,
                        "facility_type_name": "Natural"
                    },
                    {
                        "facility_type_id": 13,
                        "facility_type_name": "Postgraduate spaces"
                    },
                    {
                        "facility_type_id": 14,
                        "facility_type_name": "Undergrad spaces"
                    }
                ]
            },
            {
                "space_id": 5,
                "space_uuid": "a0298845-9999-4bb7-a6d5-666f1999c3d4",
                "space_name": "342",
                "space_precise": null,
                "space_description": null,
                "space_photo_url": null,
                "space_photo_description": null,
                "space_opening_hours_id": null,
                "space_services_page": null,
                "created_at": "2025-10-20T23:20:03.000000Z",
                "updated_at": "2025-10-20T23:20:03.000000Z",
                "space_capacity": 1,
                "space_latitude": -27.49905,
                "space_longitude": 153.01453,
                "space_zlevel": 1,
                "space_type": "Individual study",
                "space_floor_id": 3,
                "space_floor_name": "3",
                "space_is_ground_floor": false,
                "space_library_id": 3,
                "space_library_name": "Architecture and Music Library",
                "space_building_number": "51",
                "space_building_name": "Zelman Cowen Building",
                "space_building_ground_floor_id": null,
                "space_library_about_page_default": "https:\/\/web.library.uq.edu.au\/visit\/architecture-and-music-library",
                "space_campus_id": 1,
                "space_campus_name": "St Lucia",
                "space_campus_number": "01",
                "space_draftmode": false,
                "space_external_book_url": 'https://uqbookit.uq.edu.au/#/app/booking-types/555',
                space_outages: (() => {
                    const now = new Date();
                    const pad = v => String(v).padStart(2, '0');
                    const fmt = d =>
                        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
                            d.getMinutes(),
                        )}:00`;
                    // Same-day partial outage example: tomorrow from 8:00am to 1:00pm.
                    const upcomingStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                    upcomingStart.setHours(8, 0, 0, 0);
                    const upcomingEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                    upcomingEnd.setHours(13, 0, 0, 0);

                    return [
                        {
                            space_outage_id: 9005,
                            space_id: 5,
                            space_outage_start: fmt(upcomingStart),
                            space_outage_end: fmt(upcomingEnd),
                            space_outage_reason: 'Air conditioning maintenance',
                            space_outage_show_time_public: false,
                        },
                    ];
                })(),
                "space_type_id": 4,
                "space_type_details": {
                    "space_type_id": 4,
                    "space_type_name": "Individual study",
                    "space_type_description": "Designed for individual study, these spaces typically include seating areas, tables, and other amenities to support focused, independent work."
                },
                "facility_types": [
                    {
                        "facility_type_id": 7,
                        "facility_type_name": "On-desk power point"
                    },
                    {
                        "facility_type_id": 16,
                        "facility_type_name": "Desk lamp"
                    },
                    {
                        "facility_type_id": 17,
                        "facility_type_name": "Low noise level"
                    },
                    {
                        "facility_type_id": 23,
                        "facility_type_name": "Toilets, female"
                    },
                    {
                        "facility_type_id": 22,
                        "facility_type_name": "Toilets, male"
                    },
                    {
                        "facility_type_id": 29,
                        "facility_type_name": "Recharge Station"
                    },
                    {
                        "facility_type_id": 31,
                        "facility_type_name": "Self-printing & scanning"
                    },
                    {
                        "facility_type_id": 33,
                        "facility_type_name": "Client accessible power point"
                    }
                ]
            },
            {
                "space_id": 6,
                "space_uuid": "a04bef62-96c2-45cd-ad30-b1533178808c",
                "space_name": "344A",
                "space_precise": null,
                "space_description": null,
                "space_photo_url": null,
                "space_photo_description": null,
                "space_opening_hours_id": null,
                "space_services_page": null,
                "created_at": "2025-11-07T01:46:32.000000Z",
                "updated_at": "2025-11-07T01:46:32.000000Z",
                "space_capacity": 24,
                "space_latitude": -27.49896,
                "space_longitude": 153.01442,
                space_zlevel: 1,
                "space_type": "Individual study",
                "space_floor_id": 3,
                "space_floor_name": "3",
                "space_is_ground_floor": false,
                "space_library_id": 3,
                "space_library_name": "Architecture and Music Library",
                "space_building_number": "51",
                "space_building_name": "Zelman Cowen Building",
                "space_building_ground_floor_id": null,
                "space_library_about_page_default": "https:\/\/web.library.uq.edu.au\/visit\/architecture-and-music-library",
                "space_campus_id": 1,
                "space_campus_name": "St Lucia",
                "space_campus_number": "01",
                "space_draftmode": false,
                "space_external_book_url": null,
                space_outages: (() => {
                    const now = new Date();
                    const pad = v => String(v).padStart(2, '0');
                    const fmt = d =>
                        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
                            d.getMinutes(),
                        )}:00`;
                    // Multi-day outage example: starts in 2 days, ends in 4 days.
                    const multiDayStart = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
                    multiDayStart.setHours(10, 0, 0, 0);
                    const multiDayEnd = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
                    multiDayEnd.setHours(16, 0, 0, 0);

                    return [
                        {
                            space_outage_id: 9007,
                            space_id: 6,
                            space_outage_start: fmt(multiDayStart),
                            space_outage_end: fmt(multiDayEnd),
                            space_outage_reason: 'Floor resurfacing works',
                            space_outage_show_time_public: true,
                        },
                    ];
                })(),
                "space_type_id": 4,
                "space_type_details": {
                    "space_type_id": 4,
                    "space_type_name": "Individual study",
                    "space_type_description": "Designed for individual study, these spaces typically include seating areas, tables, and other amenities to support focused, independent work."
                },
                "facility_types": [
                    {
                        "facility_type_id": 22,
                        "facility_type_name": "Toilets, male"
                    },
                    {
                        "facility_type_id": 23,
                        "facility_type_name": "Toilets, female"
                    },
                    {
                        "facility_type_id": 29,
                        "facility_type_name": "Recharge Station"
                    },
                    {
                        "facility_type_id": 31,
                        "facility_type_name": "Self-printing & scanning"
                    },
                    {
                        "facility_type_id": 33,
                        "facility_type_name": "Client accessible power point"
                    },
                    {
                        "facility_type_id": 50,
                        "facility_type_name": "Natural"
                    },
                    {
                        "facility_type_id": 17,
                        "facility_type_name": "Low noise level"
                    }
                ]
            },
            {
                "space_id": 7,
                "space_uuid": "a07e758b-e152-4083-8d1a-0eb537868931",
                "space_name": "344",
                "space_precise": null,
                "space_description": null,
                "space_photo_url": null,
                "space_photo_description": null,
                "space_opening_hours_id": null,
                "space_services_page": null,
                "created_at": "2025-12-02T04:33:04.000000Z",
                "updated_at": "2025-12-02T04:33:04.000000Z",
                "space_capacity": 22,
                "space_latitude": -27.49914,
                "space_longitude": 153.01453,
                "space_zlevel": 1,
                "space_type": "Communal space",
                "space_floor_id": 3,
                "space_floor_name": "3",
                "space_is_ground_floor": false,
                "space_library_id": 3,
                "space_library_name": "Architecture and Music Library",
                "space_building_number": "51",
                "space_building_name": "Zelman Cowen Building",
                "space_building_ground_floor_id": null,
                "space_library_about_page_default": "https:\/\/web.library.uq.edu.au\/visit\/architecture-and-music-library",
                "space_campus_id": 1,
                "space_campus_name": "St Lucia",
                "space_campus_number": "01",
                "space_draftmode": false,
                "space_external_book_url": 'https://uqbookit.uq.edu.au/#/app/booking-types/666',
                "space_type_id": 4,
                "space_type_details": {
                    "space_type_id": 4,
                    "space_type_name": "Communal space",
                    "space_type_description": "A space type designed for communal activities. These spaces typically include seating areas, tables, and other amenities to support group interactions and social engagement."
                },
                "facility_types": [
                    {
                        "facility_type_id": 23,
                        "facility_type_name": "Toilets, female"
                    },
                    {
                        "facility_type_id": 22,
                        "facility_type_name": "Toilets, male"
                    },
                    {
                        "facility_type_id": 29,
                        "facility_type_name": "Recharge Station"
                    },
                    {
                        "facility_type_id": 31,
                        "facility_type_name": "Self-printing & scanning"
                    },
                    {
                        "facility_type_id": 42,
                        "facility_type_name": "General Collections"
                    },
                    {
                        "facility_type_id": 17,
                        "facility_type_name": "Low noise level"
                    }
                ]
            },
            {
                "space_id": 8,
                "space_uuid": "09007a2a-c315-4209-813f-bb4843fbf7ff",
                "space_name": "Gatton 116",
                "space_precise": null,
                "space_description": null,
                "space_photo_url": null,
                "space_photo_description": null,
                "space_opening_hours_id": null,
                "space_services_page": null,
                "created_at": "2025-12-02T04:33:04.000000Z",
                "updated_at": "2025-12-02T04:33:04.000000Z",
                "space_capacity": null,
                "space_latitude": -27.55375,
                "space_longitude": 152.33575,
                "space_type": "Training room",
                "space_floor_id": 1,
                "space_floor_name": "1",
                "space_is_ground_floor": false,
                "space_library_id": 41,
                "space_library_name": "J.K. Murray Library",
                "space_building_number": "8",
                "space_building_name": "J.K. Murray Building",
                "space_building_ground_floor_id": null,
                "space_library_about_page_default": "https:\/\/web.library.uq.edu.au\/visit\/jk-murray-library-uq-gatton",
                "space_campus_id": 2,
                "space_campus_name": "Gatton",
                "space_campus_number": "29",
                "space_draftmode": false,
                "space_external_book_url": null,
                "space_type_id": 2,
                "space_type_details": {
                    "space_type_id": 2,
                    "space_type_name": "Training room",
                    "space_type_description": "A space type designed for communal activities. These spaces typically include seating areas, tables, and other amenities to support group interactions and social engagement."
                },
                "facility_types": [
                    {
                        "facility_type_id": 23,
                        "facility_type_name": "Toilets, female"
                    },
                    {
                        "facility_type_id": 22,
                        "facility_type_name": "Toilets, male"
                    },
                    {
                        "facility_type_id": 54,
                        "facility_type_name": "AskUs service"
                    },
                    {
                        "facility_type_id": 31,
                        "facility_type_name": "Self-printing & scanning"
                    },
                    {
                        "facility_type_id": 42,
                        "facility_type_name": "General Collections"
                    },
                    {
                        "facility_type_id": 17,
                        "facility_type_name": "Low noise level"
                    }
                ]
            },
            {
                "space_id": 9,
                "space_uuid": "06ab68a9-1702-4886-af5f-4c01c4c4acaf",
                "space_name": "Gatton 111",
                "space_precise": null,
                "space_description": null,
                "space_photo_url": null,
                "space_photo_description": null,
                "space_opening_hours_id": null,
                "space_services_page": null,
                "created_at": "2025-12-02T04:33:04.000000Z",
                "updated_at": "2025-12-02T04:33:04.000000Z",
                "space_capacity": 4,
                "space_latitude": -27.55360,
                "space_longitude": 152.33585,
                "space_type": "Individual study",
                "space_floor_id": 1,
                "space_floor_name": "1",
                "space_is_ground_floor": false,
                "space_library_id": 41,
                "space_library_name": "J.K. Murray Library",
                "space_building_number": "8",
                "space_building_name": "J.K. Murray Building",
                "space_building_ground_floor_id": null,
                "space_library_about_page_default": "https:\/\/web.library.uq.edu.au\/visit\/jk-murray-library-uq-gatton",
                "space_campus_id": 2,
                "space_campus_name": "Gatton",
                "space_campus_number": "29",
                "space_draftmode": false,
                "space_external_book_url": 'https://uqbookit.uq.edu.au/#/app/booking-types/GAT2',
                "space_type_id": 4,
                "space_type_details": {
                    "space_type_id": 4,
                    "space_type_name": "Individual study",
                    "space_type_description": "A space type designed for communal activities. These spaces typically include seating areas, tables, and other amenities to support group interactions and social engagement."
                },
                "facility_types": [
                    {
                        "facility_type_id": 23,
                        "facility_type_name": "Toilets, female"
                    },
                    {
                        "facility_type_id": 22,
                        "facility_type_name": "Toilets, male"
                    },
                    {
                        "facility_type_id": 29,
                        "facility_type_name": "Recharge Station"
                    },
                    {
                        "facility_type_id": 20,
                        "facility_type_name": "Fridge"
                    },
                    {
                        "facility_type_id": 42,
                        "facility_type_name": "General Collections"
                    },
                    {
                        "facility_type_id": 17,
                        "facility_type_name": "Low noise level"
                    }
                ]
            },
            {
                "space_id": 10,
                "space_uuid": "9a7796e0-b708-45c0-a8de-1183282e0b62",
                "space_name": "Gatton 124",
                "space_precise": null,
                "space_description": null,
                "space_photo_url": null,
                "space_photo_description": null,
                "space_opening_hours_id": null,
                "space_services_page": null,
                "created_at": "2025-12-02T04:33:04.000000Z",
                "updated_at": "2025-12-02T04:33:04.000000Z",
                "space_capacity": null,
                "space_latitude": "-27.55370",
                "space_longitude": "152.33593",
                "space_type": "Communal space",
                "space_floor_id": 1,
                "space_floor_name": "1",
                "space_is_ground_floor": false,
                "space_library_id": 41,
                "space_library_name": "J.K. Murray Library",
                "space_building_number": "8",
                "space_building_name": "J.K. Murray Building",
                "space_building_ground_floor_id": null,
                "space_library_about_page_default": "https:\/\/web.library.uq.edu.au\/visit\/jk-murray-library-uq-gatton",
                "space_campus_id": 2,
                "space_campus_name": "Gatton",
                "space_campus_number": "29",
                "space_draftmode": false,
                "space_external_book_url": null,
                "space_type_id": 1,
                "space_type_details": {
                    "space_type_id": 1,
                    "space_type_name": "Communal space",
                    "space_type_description": "A space type designed for communal activities. These spaces typically include seating areas, tables, and other amenities to support group interactions and social engagement."
                },
                "facility_types": [
                    {
                        "facility_type_id": 23,
                        "facility_type_name": "Toilets, female"
                    },
                    {
                        "facility_type_id": 22,
                        "facility_type_name": "Toilets, male"
                    },
                    {
                        "facility_type_id": 29,
                        "facility_type_name": "Recharge Station"
                    },
                    {
                        "facility_type_id": 31,
                        "facility_type_name": "Self-printing & scanning"
                    },
                    {
                        "facility_type_id": 39,
                        "facility_type_name": "Adjustable desks"
                    },
                    {
                        "facility_type_id": 17,
                        "facility_type_name": "Low noise level"
                    }
                ]
            },
            {
                "space_id": 11,
                "space_uuid": "c0b476f5-3a02-4031-af1c-fbec487080bb",
                "space_name": "Gatton 149",
                "space_precise": null,
                "space_description": null,
                "space_photo_url": null,
                "space_photo_description": null,
                "space_opening_hours_id": null,
                "space_services_page": null,
                "created_at": "2025-12-02T04:33:04.000000Z",
                "updated_at": "2025-12-02T04:33:04.000000Z",
                "space_capacity": 23,
                "space_latitude": -27.55409,
                "space_longitude": 152.33572,
                "space_type": "Communal space",
                "space_floor_id": 1,
                "space_floor_name": "1",
                "space_is_ground_floor": false,
                "space_library_id": 41,
                "space_library_name": "J.K. Murray Library",
                "space_building_number": "8",
                "space_building_name": "J.K. Murray Building",
                "space_building_ground_floor_id": null,
                "space_library_about_page_default": "https:\/\/web.library.uq.edu.au\/visit\/jk-murray-library-uq-gatton",
                "space_campus_id": 2,
                "space_campus_name": "Gatton",
                "space_campus_number": "29",
                "space_draftmode": false,
                "space_external_book_url": 'https://uqbookit.uq.edu.au/#/app/booking-types/GAT4',
                "space_type_id": 1,
                "space_type_details": {
                    "space_type_id": 1,
                    "space_type_name": "Communal space",
                    "space_type_description": "A space type designed for communal activities. These spaces typically include seating areas, tables, and other amenities to support group interactions and social engagement."
                },
                "facility_types": [
                    {
                        "facility_type_id": 23,
                        "facility_type_name": "Toilets, female"
                    },
                    {
                        "facility_type_id": 22,
                        "facility_type_name": "Toilets, male"
                    },
                    {
                        "facility_type_id": 29,
                        "facility_type_name": "Recharge Station"
                    },
                    {
                        "facility_type_id": 31,
                        "facility_type_name": "Self-printing & scanning"
                    },
                    {
                        "facility_type_id": 42,
                        "facility_type_name": "General Collections"
                    },
                    {
                        "facility_type_id": 3,
                        "facility_type_name": "Kitchen"
                    }
                ]
            }, {
                space_id: 13,
                space_uuid: "f98g_fwas_5g44",
                space_name: "central-1",
                space_precise: null,
                space_description: "<p>Some words about Central library</p>",
                space_photo_url: null,
                space_photo_description: null,
                space_opening_hours_id: 10457,
                space_services_page: "https://web.library.uq.edu.au/visit/central-library",
                created_at: "2025-08-01 10:00:00",
                updated_at: "2025-08-01 11:00:00",
                "space_capacity": 4,
                space_latitude: "-27.49603",
                space_longitude: "153.01354",
                space_type: 'Communal space',
                space_floor_id: 3,
                space_floor_name: "3",
                space_is_ground_floor: 0,
                space_library_id: 10457,
                space_library_name: 'Central Library',
                space_building_name: "Duhig north Building",
                space_building_number: "0002",
                space_campus_id: 1,
                space_type_id: 1,
                space_type_details: {
                    "space_type_id": 1,
                    "space_type_name": "Communal space",
                    "space_type_description": "Designed for communal activities, these spaces typically include seating areas, tables, and other amenities to support group interactions and social engagement."
                },
                space_campus_name: "St Lucia",
                "space_campus_number": "01",
                "space_draftmode": false,
                "space_external_book_url": 'https://uqbookit.uq.edu.au/#/app/booking-types/central-1',
                facility_types: [
                    {
                        "facility_type_id": 23,
                        "facility_type_name": "Toilets, female"
                    },
                    {
                        "facility_type_id": 22,
                        "facility_type_name": "Toilets, male"
                    },
                    {
                        "facility_type_id": 29,
                        "facility_type_name": "Recharge Station"
                    },
                    {
                        "facility_type_id": 31,
                        "facility_type_name": "Self-printing & scanning"
                    },
                    {
                        "facility_type_id": 17,
                        "facility_type_name": "Low noise level"
                    },
                    {
                        "facility_type_id": 5,
                        "facility_type_name": "Computer"
                    },
                    {
                        "facility_type_id": 33,
                        "facility_type_name": "Client accessible power point"
                    },
                    {
                        "facility_type_id": 38,
                        "facility_type_name": "Whiteboard"
                    },
                    {
                        "facility_type_id": 39,
                        "facility_type_name": "Adjustable desks"
                    },
                    {
                        "facility_type_id": 8,
                        "facility_type_name": "AV equipment"
                    },
                    {
                        "facility_type_id": 13,
                        "facility_type_name": "Postgraduate spaces"
                    },
                    {
                        "facility_type_id": 14,
                        "facility_type_name": "Undergrad spaces"
                    },
                    {
                        "facility_type_id": 57,
                        "facility_type_name": "Contains Artwork"
                    }
                ],
            }, {
                space_id: 14,
                space_uuid: "f98g_fwas_5g55",
                space_name: "bsl-1",
                space_precise: null,
                space_description: null,
                space_photo_url: null,
                space_photo_description: null,
                space_opening_hours_id: 10457,
                space_services_page: "https://web.library.uq.edu.au/visit/biological-sciences-libraryy",
                created_at: "2025-08-01 10:00:00",
                updated_at: "2025-08-01 11:00:00",
                "space_capacity": null,
                space_latitude: "-27.49702",
                space_longitude: "153.01140",
                space_type: 'Communal space',
                space_floor_id: 3,
                space_floor_name: "3",
                space_is_ground_floor: 0,
                space_library_id: 3829,
                space_library_name: 'Biological Sciences Library',
                space_building_name: "Biological Sciences Library",
                space_building_number: "0094",
                space_campus_id: 1,
                space_type_id: 1,
                space_type_details: {
                    "space_type_id": 1,
                    "space_type_name": "Communal space",
                    "space_type_description": "Designed for communal activities, these spaces typically include seating areas, tables, and other amenities to support group interactions and social engagement."
                },
                space_campus_name: "St Lucia",
                "space_campus_number": "01",
                space_draftmode: false,
                "space_external_book_url": null,
                facility_types: [
                    {
                        "facility_type_id": 23,
                        "facility_type_name": "Toilets, female"
                    },
                    {
                        "facility_type_id": 22,
                        "facility_type_name": "Toilets, male"
                    },
                    {
                        "facility_type_id": 29,
                        "facility_type_name": "Recharge Station"
                    },
                    {
                        "facility_type_id": 31,
                        "facility_type_name": "Self-printing & scanning"
                    },
                    {
                        "facility_type_id": 17,
                        "facility_type_name": "Low noise level"
                    },
                    {
                        "facility_type_id": 5,
                        "facility_type_name": "Computer"
                    },
                    {
                        "facility_type_id": 33,
                        "facility_type_name": "Client accessible power point"
                    },
                    {
                        "facility_type_id": 38,
                        "facility_type_name": "Whiteboard"
                    },
                    {
                        "facility_type_id": 39,
                        "facility_type_name": "Adjustable desks"
                    },
                    {
                        "facility_type_id": 8,
                        "facility_type_name": "AV equipment"
                    },
                    {
                        "facility_type_id": 13,
                        "facility_type_name": "Postgraduate spaces"
                    },
                    {
                        "facility_type_id": 14,
                        "facility_type_name": "Undergrad spaces"
                    },
                    {
                        "facility_type_id": 57,
                        "facility_type_name": "Contains Artwork"
                    }
                ],
            }, {
                space_id: 999999,
                space_uuid: "test-delete-space-uuid",
                space_name: "DELETE_TEST_SPACE",
                space_precise: "For testing soft-delete functionality",
                space_description: "<p>This is a test space used exclusively for testing the soft-delete mechanism. It can be safely deleted and restored.</p>",
                space_photo_url: "",
                space_photo_description: "",
                space_opening_hours_id: null,
                space_services_page: "",
                created_at: "2025-12-01 10:00:00",
                updated_at: "2025-12-14 09:30:00",
                "space_capacity": 2,
                space_latitude: "-27.49700",
                space_longitude: "153.01200",
                space_zlevel: 1,
                space_type: "Meeting room",
                space_floor_id: 1,
                space_floor_name: "1",
                space_is_ground_floor: 0,
                space_library_id: 1,
                space_library_name: "Test Library",
                space_building_name: "Test Building",
                space_building_number: "TEST",
                space_campus_id: 1,
                space_type_id: 3,
                space_type_details: {
                    "space_type_id": 3,
                    "space_type_name": "Meeting room",
                    "space_type_description": "Designed for meetings and collaborative work, these spaces typically include seating areas, tables, and other amenities to support discussions and group activities."
                },
                space_campus_name: "St Lucia",
                "space_campus_number": "01",
                space_draftmode: false,
                space_deleted: true,
                space_deleted_at: "2025-12-14 09:15:00",
                "space_external_book_url": 'https://uqbookit.uq.edu.au/#/app/booking-types/999',
                space_outages: [],
                facility_types: [
                    {
                        "facility_type_id": 23,
                        "facility_type_name": "Toilets, female"
                    },
                    {
                        "facility_type_id": 22,
                        "facility_type_name": "Toilets, male"
                    }
                ],
            }]
    }
}
