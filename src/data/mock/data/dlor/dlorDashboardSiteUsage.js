const today = new Date();

function formatDate(d) {
    const pad = n => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
const siteUsageDates = [1, 2, 3].map(daysAgo => {
    const d = new Date(today);
    d.setDate(today.getDate() - daysAgo);
    return formatDate(d);
});

export const dlorDashboardSiteUsage = {
    data: {
        "total_objects": 11,
        "published_objects": 8,
        "rejected_objects": 0,
        "deprecated_objects": 1,
        "featured_objects": 6,
        "new_objects": 8,
        "cultural_advice_objects": 8,
        "user_submitted_objects": 10,
        "my_objects": 0,
        "my_favourites": 1,
        "total_favourites": 3,
        "total_subscriptions": 1,
        "my_alerts": 0,
        "team_breakdown": [
            {
                "team_name": "Team Two",
                "total_objects": 9
            },
            {
                "team_name": "Team One",
                "total_objects": 2
            }
        ],
        "keyword_breakdown": [
            {
                "keyword": "data",
                "object_count": 14
            },
            {
                "keyword": "Search skills",
                "object_count": 12
            },
            {
                "keyword": "Reference, cite and acknowledge",
                "object_count": 12
            },
            {
                "keyword": "Subject resources",
                "object_count": 10
            },
            {
                "keyword": "data analysis",
                "object_count": 9
            },
            {
                "keyword": "Digital tools and skills",
                "object_count": 9
            },
            {
                "keyword": "search strategy",
                "object_count": 9
            },
            {
                "keyword": "R language",
                "object_count": 8
            },
            {
                "keyword": "RStudio",
                "object_count": 8
            },
            {
                "keyword": "systematic review",
                "object_count": 8
            }
        ],
        "review_status": {
            "upcoming": 3,
            "due": 2,
            "overdue": 0
        },
        "filter_breakdown": {
            "Research (Topic)": 1,
            "Assignments (Topic)": 1,
            "HP5 (Media Format)": 2
        },
        "series_breakdown": {
            "Series 1": 1,
            "Series 2": 1,
            "No Series": 8
        },
        "object_type_breakdown": [
            {
                "object_type_name": "HP5",
                "object_count": 2
            },
            {
                "object_type_name": "Unallocated Facet",
                "object_count": 0
            }
        ],
        "site_usage": [
            {
                "activity_date": siteUsageDates[2],
                "total_views": 1,
                "viewers_by_group": [
                    {
                        "user_group": "STAFF",
                        "total": 1
                    }
                ]
            },
            {
                "activity_date": siteUsageDates[1],
                "total_views": 2,
                "viewers_by_group": [
                    {
                        "user_group": "STAFF",
                        "total": 1
                    },
                    {
                        "user_group": "LIBRARYSTAFFB",
                        "total": 1
                    }
                ]
            },
            {
                "activity_date": siteUsageDates[0],
                "total_views": 1,
                "viewers_by_group": [
                    {
                        "user_group": "LIBRARYSTAFFB",
                        "total": 1
                    }
                ]
            }
        ],
        "popular_objects": 2,
        "object_management_stats": {
            "last_updated_28_days": 11,
            "due_review_28_days": 2,
            "due_unpublish": 0
        },
        "objects_by_facet": {         
            "objects_by_topic": [
                {
                    "name": "Research",
                    "count": 37,
                    "id": 1
                },
                {
                    "name": "Assignments",
                    "count": 92,
                    "id": 2
                },
                {
                    "name": "Aboriginal and Torres Strait Islander",
                    "count": 5,
                    "id": 10
                },
                {
                    "name": "Digital skills",
                    "count": 22,
                    "id": 11
                },
                {
                    "name": "Employability",
                    "count": 0,
                    "id": 12
                },
                {
                    "name": "Referencing",
                    "count": 17,
                    "id": 14
                },
                {
                    "name": "Software",
                    "count": 20,
                    "id": 16
                }
            ],
            "objects_by_audience": [
                {
                    "name": "Influential communicators",
                    "count": 68,
                    "id": 4
                },
                {
                    "name": "Accomplished scholars",
                    "count": 76,
                    "id": 5
                },
                {
                    "name": "Courageous thinkers",
                    "count": 9,
                    "id": 6
                },
                {
                    "name": "Connected citizens",
                    "count": 7,
                    "id": 7
                },
                {
                    "name": "Respectful leaders",
                    "count": 5,
                    "id": 8
                },
                {
                    "name": "Culturally capable",
                    "count": 2,
                    "id": 9
                }
            ],
            "objects_by_type": [
                {
                    "name": "Module",
                    "count": 29,
                    "id": 17
                },
                {
                    "name": "Interactive",
                    "count": 18,
                    "id": 40
                },
                {
                    "name": "Training recording",
                    "count": 4,
                    "id": 41
                },
                {
                    "name": "Guide",
                    "count": 93,
                    "id": 42
                },
                {
                    "name": "Presentation",
                    "count": 0,
                    "id": 43
                },
                {
                    "name": "Other",
                    "count": 2,
                    "id": 44
                },
                {
                    "name": "Video guide",
                    "count": 9,
                    "id": 53
                },
                {
                    "name": "Instructional object",
                    "count": 1,
                    "id": 54
                }
            ],
            "objects_by_format": [
                {
                    "name": "H5P",
                    "count": 8,
                    "id": 3
                },
                {
                    "name": "Dataset",
                    "count": 0,
                    "id": 18
                },
                {
                    "name": "Powerpoint",
                    "count": 0,
                    "id": 19
                },
                {
                    "name": "Audio",
                    "count": 2,
                    "id": 20
                },
                {
                    "name": "Image",
                    "count": 0,
                    "id": 21
                },
                {
                    "name": "Other",
                    "count": 2,
                    "id": 22
                },
                {
                    "name": "Pressbook",
                    "count": 22,
                    "id": 45
                },
                {
                    "name": "Video",
                    "count": 14,
                    "id": 46
                },
                {
                    "name": "Webpage",
                    "count": 90,
                    "id": 47
                },
                {
                    "name": "PDF",
                    "count": 1,
                    "id": 49
                },
                {
                    "name": "Spreadsheet",
                    "count": 1,
                    "id": 50
                },
                {
                    "name": "Word document",
                    "count": 0,
                    "id": 51
                }
            ],
            "objects_with_cultural_advice": 3

        },
    },
};

