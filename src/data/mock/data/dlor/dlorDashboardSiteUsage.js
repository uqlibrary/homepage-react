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
                "keyword": "research",
                "object_count": 1
            },
            {
                "keyword": "other",
                "object_count": 1
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
        }
    },
};