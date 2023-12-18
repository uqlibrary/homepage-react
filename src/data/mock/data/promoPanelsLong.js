export const currentPanels = [
    {
        "panel_id": 1,
        "panel_title": "Services for students",
        "panel_content": "<div><p>visit our website</p></div>",
        "panel_admin_notes": "",
        "panel_created_at": "2022-11-07T00:00:00.000000Z",
        "panel_schedule": [],
        "default_panels_for": [
            {
                "usergroup_group_id": 1,
                "usergroup_group": "student",
                "usergroup_group_name": "Student"
            },
            {
                "usergroup_group_id": 2,
                "usergroup_group": "hdr",
                "usergroup_group_name": "Hdrs"
            }
        ]
    },
    {
        "panel_id": 2,
        "panel_title": "unallocated one",
        "panel_content": "unallocated content",
        "panel_admin_notes": "",
        "panel_created_at": "2022-11-07T00:00:00.000000Z",
        "panel_schedule": [],
        "default_panels_for": []
    },
    {
        "panel_id": 3,
        "panel_title": "staff default",
        "panel_content": "staff content",
        "panel_admin_notes": "",
        "panel_created_at": "2022-11-07T00:00:00.000000Z",
        "panel_schedule": [],
        "default_panels_for": [
            {
                "usergroup_group_id": 3,
                "usergroup_group": "staff",
                "usergroup_group_name": "UQ staff"
            }
        ]
    },
    {
        "panel_id": 4,
        "panel_title": "alumni default",
        "panel_content": "aluni default",
        "panel_admin_notes": "",
        "panel_created_at": "2022-11-07T00:00:00.000000Z",
        "panel_schedule": [],
        "default_panels_for": [
            {
                "usergroup_group_id": 4,
                "usergroup_group": "alumni",
                "usergroup_group_name": "Alumni"
            }
        ]
    },
    {
        "panel_id": 5,
        "panel_title": "other users default",
        "panel_content": "other user content",
        "panel_admin_notes": "",
        "panel_created_at": "2022-11-07T00:00:00.000000Z",
        "panel_schedule": [],
        "default_panels_for": [
            {
                "usergroup_group_id": 5,
                "usergroup_group": "other",
                "usergroup_group_name": "Other"
            }
        ]
    },
    {
        "panel_id": 6,
        "panel_title": "public default",
        "panel_content": "public content",
        "panel_admin_notes": "",
        "panel_created_at": "2022-11-07T00:00:00.000000Z",
        "panel_schedule": [],
        "default_panels_for": [
            {
                "usergroup_group_id": 6,
                "usergroup_group": "loggedout",
                "usergroup_group_name": "Logged out"
            }
        ]
    },
    {
        "panel_id": 7,
        "panel_title": "some special upcoming event for students",
        "panel_content": "words",
        "panel_admin_notes": "",
        "panel_created_at": "2022-11-07T00:00:00.000000Z",
        "panel_schedule": [
            {
                "usergroup_group_id": 1,
                "usergroup_group": "student",
                "usergroup_group_name": "Student",
                "user_group_schedule": [
                    {
                        "panel_schedule_id": 11,
                        "panel_schedule_start_time": "2022-11-01 00:00:00",
                        "panel_schedule_end_time": "2090-12-15 00:00:00"
                    }
                ]
            }
        ],
        "default_panels_for": []
    },
    {
        "panel_id": 8,
        "panel_title": "Christmas Opening Hours",
        "panel_content": "<p>We are closed for Christmas this week</p>",
        "panel_admin_notes": "",
        "panel_created_at": "2022-11-07T00:00:00.000000Z",
        "panel_schedule": [
            {
                "usergroup_group_id": 1,
                "usergroup_group": "student",
                "usergroup_group_name": "Student",
                "user_group_schedule": [
                    {
                        "panel_schedule_id": 3,
                        "panel_schedule_start_time": "2090-12-15 00:00:00",
                        "panel_schedule_end_time": "2091-01-06 23:59:00"
                    }
                ]
            },
            {
                "usergroup_group_id": 2,
                "usergroup_group": "hdr",
                "usergroup_group_name": "Hdrs",
                "user_group_schedule": [
                    {
                        "panel_schedule_id": 4,
                        "panel_schedule_start_time": "2090-12-15 00:00:00",
                        "panel_schedule_end_time": "2095-01-05 23:59:59"
                    }
                ]
            },
            {
                "usergroup_group_id": 3,
                "usergroup_group": "staff",
                "usergroup_group_name": "UQ staff",
                "user_group_schedule": [
                    {
                        "panel_schedule_id": 5,
                        "panel_schedule_start_time": "2090-12-15 00:00:00",
                        "panel_schedule_end_time": "2091-01-05 23:59:59"
                    }
                ]
            },
            {
                "usergroup_group_id": 4,
                "usergroup_group": "alumni",
                "usergroup_group_name": "Alumni",
                "user_group_schedule": [
                    {
                        "panel_schedule_id": 8,
                        "panel_schedule_start_time": "2090-12-15 00:00:00",
                        "panel_schedule_end_time": "2091-01-05 23:59:59"
                    }
                ]
            },
            {
                "usergroup_group_id": 5,
                "usergroup_group": "other",
                "usergroup_group_name": "Other",
                "user_group_schedule": [
                    {
                        "panel_schedule_id": 9,
                        "panel_schedule_start_time": "2090-12-15 00:00:00",
                        "panel_schedule_end_time": "2091-01-05 23:59:59"
                    }
                ]
            },
            {
                "usergroup_group_id": 6,
                "usergroup_group": "loggedout",
                "usergroup_group_name": "Logged out",
                "user_group_schedule": [
                    {
                        "panel_schedule_id": 10,
                        "panel_schedule_start_time": "2090-12-15 00:00:00",
                        "panel_schedule_end_time": "2091-01-05 23:59:59"
                    }
                ]
            }
        ],
        "default_panels_for": []
    },
    {
        "panel_id": 9,
        "panel_title": "Orientation",
        "panel_content": "<div>\n                    <p>Get to know your Library this O-Week <span style=\"white-space: nowrap;\">(18-22 July)</span> and Connect Week <span style=\"white-space: nowrap;\">(25-29 July)</span>.</p>\n                    <p>Add <a href=\"https://orientation.uq.edu.au/event-search/organiser/3778\">Library orientation sessions</a> to your Orientation Plan such as an introduction to Learn.UQ (Blackboard) or a Library Q&amp;A session!</p>\n                    <p>Read our <a href=\"https://web.library.uq.edu.au/blog/2022/07/welcome-library-orientation\">Getting started tips</a> and make the most of your <a href=\"https://life.uq.edu.au/orientation\">orientation experience</a> with UQ Life.</p>\n                </div>",
        "panel_admin_notes": "",
        "panel_created_at": "2022-11-07T00:00:00.000000Z",
        "panel_schedule": [
            {
                "usergroup_group_id": 1,
                "usergroup_group": "student",
                "usergroup_group_name": "Student",
                "user_group_schedule": [
                    {
                        "panel_schedule_id": 12,
                        "panel_schedule_start_time": "2022-02-01 00:00:00",
                        "panel_schedule_end_time": "2022-02-08 00:00:00"
                    }
                ]
            }
        ],
        "default_panels_for": []
    },
    {
        "panel_id": 10,
        "panel_title": "some future campaign",
        "panel_content": "some future event content",
        "panel_admin_notes": "",
        "panel_created_at": "2022-11-07T00:00:00.000000Z",
        "panel_schedule": [
            {
                "usergroup_group_id": 5,
                "usergroup_group": "other",
                "usergroup_group_name": "Other",
                "user_group_schedule": [
                    {
                        "panel_schedule_id": 1,
                        "panel_schedule_start_time": "2021-01-01 00:00:00",
                        "panel_schedule_end_time": "2021-06-01 00:00:00"
                    },
                    {
                        "panel_schedule_id": 2,
                        "panel_schedule_start_time": "2021-08-01 00:00:00",
                        "panel_schedule_end_time": "2021-09-01 00:00:00"
                    }
                ]
            },
            {
                "usergroup_group_id": 3,
                "usergroup_group": "staff",
                "usergroup_group_name": "UQ staff",
                "user_group_schedule": [
                    {
                        "panel_schedule_id": 6,
                        "panel_schedule_start_time": "2021-01-01 00:00:00",
                        "panel_schedule_end_time": "2021-01-01 00:01:00"
                    },
                    {
                        "panel_schedule_id": 7,
                        "panel_schedule_start_time": "2021-01-01 00:00:00",
                        "panel_schedule_end_time": "2021-01-01 00:01:00"
                    }
                ]
            }
        ],
        "default_panels_for": []
    },
    {
        "panel_id": 99,
        "panel_title": "unallocated two",
        "panel_content": "unallocated content",
        "panel_admin_notes": "",
        "panel_created_at": "2022-11-07T00:00:00.000000Z",
        "panel_schedule": [],
        "default_panels_for": []
    },
    {
        "panel_id": 50,
        is_past: true,
        "panel_title": "past panel",
        "panel_content": "Past panel",
        "panel_admin_notes": "past",
        "panel_created_at": "2022-11-07T00:00:00.000000Z",
        "panel_schedule": [
            {
                "usergroup_group_id": 1,
                "usergroup_group": "student",
                "usergroup_group_name": "Student",
                "user_group_schedule": [
                    {
                        "panel_schedule_id": 50,
                        "panel_schedule_start_time": "1980-02-01 00:00:00",
                        "panel_schedule_end_time": "1980-02-08 00:00:00"
                    }
                ]
            }
        ],
        "default_panels_for": []
    },
]

export const userListPanels = [
    {
        "usergroup_group_id": 1,
        "usergroup_group": "student",
        "usergroup_group_name": "Student",
        "default_panel": {
            "panel_id": 1,
            "panel_title": "Services for students",
            "panel_content": "<div><p>visit our website</p></div>",
            "panel_admin_notes": ""
        },
        "scheduled_panels": [
            {
                "panel_id": 8,
                "panel_title": "Christmas Opening Hours",
                "panel_content": "<p>We are closed for Christmas this week</p>",
                "panel_admin_notes": "",
                "panel_schedule_id": 3,
                "panel_schedule_start_time": "2090-12-15 00:00:00",
                "panel_schedule_end_time": "2091-01-06 23:59:00"
            },
            {
                "panel_id": 7,
                "panel_title": "some special upcoming event for students",
                "panel_content": "words",
                "panel_admin_notes": "",
                "panel_schedule_id": 11,
                "panel_schedule_start_time": "2022-11-01 00:00:00",
                "panel_schedule_end_time": "2090-12-15 00:00:00"
            },
            {
                "panel_id": 9,
                "panel_title": "Orientation",
                "panel_content": "<div>\n                    <p>Get to know your Library this O-Week <span style=\"white-space: nowrap;\">(18-22 July)</span> and Connect Week <span style=\"white-space: nowrap;\">(25-29 July)</span>.</p>\n                    <p>Add <a href=\"https://orientation.uq.edu.au/event-search/organiser/3778\">Library orientation sessions</a> to your Orientation Plan such as an introduction to Learn.UQ (Blackboard) or a Library Q&amp;A session!</p>\n                    <p>Read our <a href=\"https://web.library.uq.edu.au/blog/2022/07/welcome-library-orientation\">Getting started tips</a> and make the most of your <a href=\"https://life.uq.edu.au/orientation\">orientation experience</a> with UQ Life.</p>\n                </div>",
                "panel_admin_notes": "",
                "panel_schedule_id": 12,
                "panel_schedule_start_time": "2022-02-01 00:00:00",
                "panel_schedule_end_time": "2022-02-08 00:00:00"
            },
            {
                "panel_id": 50,
                "is_past": true,
                "panel_title": "Orientation",
                "panel_content": "<div>\n                    <p>Get to know your Library this O-Week <span style=\"white-space: nowrap;\">(18-22 July)</span> and Connect Week <span style=\"white-space: nowrap;\">(25-29 July)</span>.</p>\n                    <p>Add <a href=\"https://orientation.uq.edu.au/event-search/organiser/3778\">Library orientation sessions</a> to your Orientation Plan such as an introduction to Learn.UQ (Blackboard) or a Library Q&amp;A session!</p>\n                    <p>Read our <a href=\"https://web.library.uq.edu.au/blog/2022/07/welcome-library-orientation\">Getting started tips</a> and make the most of your <a href=\"https://life.uq.edu.au/orientation\">orientation experience</a> with UQ Life.</p>\n                </div>",
                "panel_admin_notes": "",
                "panel_schedule_id": 50,
                "panel_schedule_start_time": "1980-02-01 00:00:00",
                "panel_schedule_end_time": "1980-02-08 00:00:00"
            }
        ]
    },
    {
        "usergroup_group_id": 2,
        "usergroup_group": "hdr",
        "usergroup_group_name": "Hdrs",
        "default_panel": {
            "panel_id": 1,
            "panel_title": "Services for students",
            "panel_content": "<div><p>visit our website</p></div>",
            "panel_admin_notes": ""
        },
        "scheduled_panels": [
            {
                "panel_id": 8,
                "panel_title": "Christmas Opening Hours",
                "panel_content": "<p>We are closed for Christmas this week</p>",
                "panel_admin_notes": "",
                "panel_schedule_id": 4,
                "panel_schedule_start_time": "2090-12-15 00:00:00",
                "panel_schedule_end_time": "2095-01-05 23:59:59"
            }
        ]
    },
    {
        "usergroup_group_id": 3,
        "usergroup_group": "staff",
        "usergroup_group_name": "UQ staff",
        "default_panel": {
            "panel_id": 3,
            "panel_title": "staff default",
            "panel_content": "staff content",
            "panel_admin_notes": ""
        },
        "scheduled_panels": [
            {
                "panel_id": 8,
                "panel_title": "Christmas Opening Hours",
                "panel_content": "<p>We are closed for Christmas this week</p>",
                "panel_admin_notes": "",
                "panel_schedule_id": 5,
                "panel_schedule_start_time": "2090-12-15 00:00:00",
                "panel_schedule_end_time": "2091-01-05 23:59:59"
            },
            {
                "panel_id": 10,
                "panel_title": "some future campaign",
                "panel_content": "some future event content",
                "panel_admin_notes": "",
                "panel_schedule_id": 6,
                "panel_schedule_start_time": "2021-01-01 00:00:00",
                "panel_schedule_end_time": "2021-01-01 00:01:00"
            },
            {
                "panel_id": 10,
                "panel_title": "some future campaign",
                "panel_content": "some future event content",
                "panel_admin_notes": "",
                "panel_schedule_id": 7,
                "panel_schedule_start_time": "2021-01-01 00:00:00",
                "panel_schedule_end_time": "2021-01-01 00:01:00"
            }
        ]
    },
    {
        "usergroup_group_id": 4,
        "usergroup_group": "alumni",
        "usergroup_group_name": "Alumni",
        "default_panel": {
            "panel_id": 4,
            "panel_title": "alumni default",
            "panel_content": "aluni default",
            "panel_admin_notes": ""
        },
        "scheduled_panels": [
            {
                "panel_id": 8,
                "panel_title": "Christmas Opening Hours",
                "panel_content": "<p>We are closed for Christmas this week</p>",
                "panel_admin_notes": "",
                "panel_schedule_id": 8,
                "panel_schedule_start_time": "2090-12-15 00:00:00",
                "panel_schedule_end_time": "2091-01-05 23:59:59"
            }
        ]
    },
    {
        "usergroup_group_id": 5,
        "usergroup_group": "other",
        "usergroup_group_name": "Other",
        "default_panel": {
            "panel_id": 5,
            "panel_title": "other users default",
            "panel_content": "other user content",
            "panel_admin_notes": ""
        },
        "scheduled_panels": [
            {
                "panel_id": 10,
                "panel_title": "some future campaign",
                "panel_content": "some future event content",
                "panel_admin_notes": "",
                "panel_schedule_id": 1,
                "panel_schedule_start_time": "2021-01-01 00:00:00",
                "panel_schedule_end_time": "2021-06-01 00:00:00"
            },
            {
                "panel_id": 10,
                "panel_title": "some future campaign",
                "panel_content": "some future event content",
                "panel_admin_notes": "",
                "panel_schedule_id": 2,
                "panel_schedule_start_time": "2021-08-01 00:00:00",
                "panel_schedule_end_time": "2021-09-01 00:00:00"
            },
            {
                "panel_id": 8,
                "panel_title": "Christmas Opening Hours",
                "panel_content": "<p>We are closed for Christmas this week</p>",
                "panel_admin_notes": "",
                "panel_schedule_id": 9,
                "panel_schedule_start_time": "2090-12-15 00:00:00",
                "panel_schedule_end_time": "2091-01-05 23:59:59"
            }
        ]
    },
    {
        "usergroup_group_id": 6,
        "usergroup_group": "loggedout",
        "usergroup_group_name": "Logged out",
        "default_panel": {
            "panel_id": 6,
            "panel_title": "public default",
            "panel_content": "public content",
            "panel_admin_notes": ""
        },
        "scheduled_panels": [
            {
                "panel_id": 8,
                "panel_title": "Christmas Opening Hours",
                "panel_content": "<p>We are closed for Christmas this week</p>",
                "panel_admin_notes": "",
                "panel_schedule_id": 10,
                "panel_schedule_start_time": "2090-12-15 00:00:00",
                "panel_schedule_end_time": "2091-01-05 23:59:59"
            }
        ]
    }
]

export const activePanels = [
    {
      "usergroup_group_id": 1,
      "usergroup_group": "student",
      "usergroup_group_name": "Student",
      "active_panel": {
        "is_default_panel": false,
        "panel_id": 7,
        "panel_title": "some special upcoming event for students",
        "panel_content": "words",
        "panel_admin_notes": "",
        "panel_schedule_start_time": "2022-11-01 00:00:00",
        "panel_schedule_end_time": "2090-12-15 00:00:00"
      }
    },
    {
      "usergroup_group_id": 2,
      "usergroup_group": "hdr",
      "usergroup_group_name": "Hdrs",
      "active_panel": {
        "is_default_panel": true,
        "panel_id": 1,
        "panel_title": "Services for students",
        "panel_content": "<div><p>visit our website</p></div>",
        "panel_admin_notes": "",
        "panel_schedule_start_time": null,
        "panel_schedule_end_time": null
      }
    },
    {
      "usergroup_group_id": 3,
      "usergroup_group": "staff",
      "usergroup_group_name": "UQ staff",
      "active_panel": {
        "is_default_panel": true,
        "panel_id": 3,
        "panel_title": "staff default",
        "panel_content": "staff content",
        "panel_admin_notes": "",
        "panel_schedule_start_time": null,
        "panel_schedule_end_time": null
      }
    },
    {
      "usergroup_group_id": 4,
      "usergroup_group": "alumni",
      "usergroup_group_name": "Alumni",
      "active_panel": {
        "is_default_panel": true,
        "panel_id": 4,
        "panel_title": "alumni default",
        "panel_content": "aluni default",
        "panel_admin_notes": "",
        "panel_schedule_start_time": null,
        "panel_schedule_end_time": null
      }
    },
    {
      "usergroup_group_id": 5,
      "usergroup_group": "other",
      "usergroup_group_name": "Other",
      "active_panel": {
        "is_default_panel": true,
        "panel_id": 5,
        "panel_title": "other users default",
        "panel_content": "other user content",
        "panel_admin_notes": "",
        "panel_schedule_start_time": null,
        "panel_schedule_end_time": null
      }
    },
    {
      "usergroup_group_id": 6,
      "usergroup_group": "public",
      "usergroup_group_name": "Logged out",
      "active_panel": {
        "is_default_panel": true,
        "panel_id": 6,
        "panel_title": "public default",
        "panel_content": "public content",
        "panel_admin_notes": "",
        "panel_schedule_start_time": null,
        "panel_schedule_end_time": null
      }
    }
]

export const mockScheduleReturn = {
    "status": "OK",
    "data": {
        "panel_id": 2,
        "panel_title": "unallocated one",
        "panel_content": "unallocated content",
        "panel_admin_notes": "",
        "panel_created_at": "2022-11-07T00:00:00.000000Z",
        "panel_schedule": [
            {
                "usergroup_group_id": 1,
                "usergroup_group": "student",
                "usergroup_group_name": "Student",
                "user_group_schedule": [
                    {
                        "panel_schedule_id": 13,
                        "panel_schedule_start_time": "2100-01-01 00:01:00",
                        "panel_schedule_end_time": "2100-01-01 23:59:00"
                    }
                ]
            }
        ],
        "is_past": false
    }
}
export const mockPublicPanel = {
    "usergroup_group_id": 6,
    "usergroup_group": "public",
    "usergroup_group_name": "Logged Out",
    "active_panel": {
      "is_default_panel": true,
      "panel_id": 20,
      "panel_title": "General default panel",
      "panel_content": "<p>This is the <strong>General Default </strong>Panel, assigned from the promo panel management application.</p><p>This is assigned to some / all groups, depending on the test case.</p><p>You can edit the contents of this panel, or change the schedules / defaults if you wish.</p>",
      "panel_admin_notes": "General Default Panel",
      "panel_schedule_start_time": null,
      "panel_schedule_end_time": null
    }
  }
  export const mockAuthenticatedPanel = {
    "usergroup_group_id": 1,
    "usergroup_group": "authenticated",
    "usergroup_group_name": "Authenticated",
    "active_panel": {
      "is_default_panel": true,
      "panel_id": 1,
      "panel_title": "Authenticated Panel",
      "panel_content": "<p>This is the <strong>Authenticated </strong>Panel, assigned from the promo panel management application.</p><p>This is assigned to authenticated users.</p><p>You can edit the contents of this panel, or change the schedules / defaults if you wish.</p>",
      "panel_admin_notes": "General Default Panel",
      "panel_schedule_start_time": null,
      "panel_schedule_end_time": null
    }
  }

export const panelTitleOther = "Authenticated Panel";
export const panelTitles = {
  uqstaff: "Info for Library staff",
  uqpkopit: "For staff",
  s1111111: "Supporting your studies",
};
export const promoPanelMocks = {
    uqstaff: {
        "usergroup_group_id": 7,
        "usergroup_group": "librarystaff",
        "usergroup_group_name": "Library Staff",
        "active_panel": {
            "is_default_panel": true,
            "panel_id": 70,
            "panel_title": panelTitles.uqstaff,
            "panel_content": "<p>We use the Library Website to provide information and services to our clients.&nbsp;<\/p><p>Students, HDRs, Alumni, UQ staff and other users will see promotional messages here that change every couple of weeks.<\/p><p>Visit the <a href=\"https:\/\/uq.sharepoint.com\/sites\/org-library\">Library Intranet<\/a> for information for library staff, including:<\/p><ul><li>the <a href=\"https:\/\/uq.sharepoint.com\/sites\/org-library\/SitePages\/Core-Briefs.aspx\">Core Brief<\/a><\/li><li><a href=\"https:\/\/uq.sharepoint.com\/sites\/org-library-news\">News and Events<\/a><\/li><li>our <a href=\"https:\/\/uq.sharepoint.com\/sites\/org-library\/SitePages\/Strategy.aspx\">Vision and Strategy<\/a> (including Beyond the Blueprint).<\/li><\/ul>",
            "panel_admin_notes": "About promos for clients, link to intranet.",
            "panel_schedule_start_time": null,
            "panel_schedule_end_time": null
        }
    },
    uqpkopit: {
        "usergroup_group_id": 3,
        "usergroup_group": "staff",
        "usergroup_group_name": "Non-Library Staff",
        "active_panel": {
            "is_default_panel": true,
            "panel_id": 71,
            "panel_title": panelTitles.uqpkopit,
            "panel_content": "<p>The Library is here to support your work. Check out our services for:<\/p><ul><li><a href=\"https:\/\/web.library.uq.edu.au\/library-services\/services-teaching-staff\">Teaching staff<\/a><\/li><li><a href=\"https:\/\/web.library.uq.edu.au\/library-services\/services-researchers\">Researchers<\/a><\/li><li><a href=\"https:\/\/web.library.uq.edu.au\/library-services\/services-professional-staff\">Professional staff<\/a>.<\/li><\/ul><p>Contact:<\/p><ul><li><a href=\"https:\/\/web.library.uq.edu.au\/contact-us\">AskUs<\/a> for general enquiries<\/li><li><a href=\"https:\/\/web.library.uq.edu.au\/library-services\/contact-faculty-services-librarians\">The Librarian Team<\/a><\/li><li><a href=\"https:\/\/web.library.uq.edu.au\/about-us\/organisational-structure\">Organisational contacts<\/a>.<\/li><\/ul><p><a href=\"https:\/\/web.library.uq.edu.au\/blog\">Visit our blog<\/a> for our latest news.<\/p>",
            "panel_admin_notes": "UQ (non-lib) services, contacts",
            "panel_schedule_start_time": null,
            "panel_schedule_end_time": null
        }
    }, s1111111: {
        "usergroup_group_id": 1,
        "usergroup_group": "student",
        "usergroup_group_name": "Student",
        "active_panel": {
            "is_default_panel": true,
            "panel_id": 69,
            "panel_title": panelTitles.s1111111,
            "panel_content": "<p>Visit <a href=\"https:\/\/web.library.uq.edu.au\/library-services\/services-students\">Services for students<\/a> for links to:<\/p><ul><li>Assignment and study resources<\/li><li>In-person and online training including LinkedIn Learning and Digital Essentials modules<\/li><li>Tips and ways to find information<\/li><li>Support resources.<\/li><\/ul><p><a href=\"https:\/\/web.library.uq.edu.au\/blog\">Check our blog<\/a> for the latest news and connect with us on <a href=\"https:\/\/www.instagram.com\/uniofqldlibrary\/\">Instagram<\/a>, <a href=\"https:\/\/www.facebook.com\/uniofqldlibrary\">Facebook<\/a> or <a href=\"https:\/\/twitter.com\/UQ_Library\">Twitter<\/a> for updates, stories and events.&nbsp;<\/p><p><a href=\"https:\/\/web.library.uq.edu.au\/contact-us\">Contact us<\/a> or visit an AskUs service point for help and information.&nbsp;<\/p>",
            "panel_admin_notes": "Services for students, Connect, Askus",
            "panel_schedule_start_time": null,
            "panel_schedule_end_time": null
        }
    }, other: {
        "usergroup_group_id": 5,
        "usergroup_group": "other",
        "usergroup_group_name": "Other",
        "active_panel": {
            "is_default_panel": true,
            "panel_id": 82,
            "panel_title": panelTitleOther,
            "panel_content": "<p>We hope you enjoy using our spaces and collections.&nbsp;<\/p><p>Find out about:&nbsp;<\/p><ul><li><a href=\"https:\/\/web.library.uq.edu.au\/borrowing-requesting\/how-borrow\">How to borrow<\/a>&nbsp;<\/li><li>Library <a href=\"https:\/\/web.library.uq.edu.au\/locations-hours\/opening-hours\">opening hours<\/a> for library members and visitors.<\/li><\/ul><p><a href=\"https:\/\/web.library.uq.edu.au\/blog\">Check our blog<\/a> for the latest news and connect with us on <a href=\"https:\/\/www.instagram.com\/uniofqldlibrary\/\">Instagram<\/a>, <a href=\"https:\/\/www.facebook.com\/uniofqldlibrary\">Facebook<\/a> or <a href=\"https:\/\/twitter.com\/UQ_Library\">Twitter<\/a> for updates, stories and events.&nbsp;<\/p><p><a href=\"https:\/\/web.library.uq.edu.au\/contact-us\">Contact us<\/a> or visit an AskUs service point for help and information.&nbsp;<\/p>",
            "panel_admin_notes": "Welcome back, borrwing & hours, connect, contact us",
            "panel_schedule_start_time": null,
            "panel_schedule_end_time": null
        }
    }
}