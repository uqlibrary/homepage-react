export default {
    "status": "OK",
    "data": {
        "facility_type_groups": [{
            "facility_type_group_id": 4,
            "facility_type_group_name": "Noise level",
            "facility_type_group_order": 1,
            "facility_type_group_type": 'choose-one',
            "facility_type_children": [{
                "facility_type_id": 1,
                "facility_type_name": "Noise level Low",
            }, {
                "facility_type_id": 2,
                "facility_type_name": "Noise level Medium",
            }, {
                "facility_type_id": 3,
                "facility_type_name": "Noise level High",
            }],
        }, {
            "facility_type_group_id": 1,
            "facility_type_group_name": "Room Features",
            "facility_type_group_order": 2,
            "facility_type_group_type": 'choose-many',
            "facility_type_children": [{
                "facility_type_id": 4,
                "facility_type_name": "AT technology",
            }, {
                "facility_type_id": 5,
                "facility_type_name": "AV equipment",
            }, {
                "facility_type_id": 6,
                "facility_type_name": "Capacity (??)",
            }, {
                "facility_type_id": 7,
                "facility_type_name": "Exam Friendly",
            }, {
                "facility_type_id": 8,
                "facility_type_name": "Postgraduate spaces",
            }, {
                "facility_type_id": 9,
                "facility_type_name": "Power outlets",
            }, {
                "facility_type_id": 10,
                "facility_type_name": "Undergrad spaces",
            }, {
                "facility_type_id": 11,
                "facility_type_name": "Whiteboard",
            }],
        }, {
            "facility_type_group_id": 5,
            "facility_type_group_name": "Opening hours",
            "facility_type_group_order": 3,
            "facility_type_group_type": 'choose-many',
            "facility_type_children": [{
                "facility_type_id": 12,
                "facility_type_name": "Opening hours",
            }]
        }, {
            "facility_type_group_id": 2,
            "facility_type_group_name": "Services",
            "facility_type_group_order": 4,
            "facility_type_group_type": 'choose-many',
            "facility_type_children": [{
                "facility_type_id": 13,
                "facility_type_name": "AskUs service",
            }, {
                "facility_type_id": 14,
                "facility_type_name": "Food outlets",
            }, {
                "facility_type_id": 15,
                "facility_type_name": "Production Printing Services",
            }, {
                "facility_type_id": 16,
                "facility_type_name": "Retail Outlets",
            }]
        }, {
            "facility_type_group_id": 3,
            "facility_type_group_name": "Outdoor",
            "facility_type_group_order": 5,
            "facility_type_group_type": 'choose-many',
            "facility_type_children": [{
                "facility_type_id": 17,
                "facility_type_name": "Contains Artwork",
            }, {
                "facility_type_id": 18,
                "facility_type_name": "Displays",
            }, {
                "facility_type_id": 19,
                "facility_type_name": "Landmark",
            }]
        }]
    }
}

