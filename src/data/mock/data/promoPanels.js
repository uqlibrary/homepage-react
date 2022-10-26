export const currentPanels = [
    {
        panel_id: 1,
        admin_notes: 'Panel ID 1 Test',
        panel_title: 'Welcome Students',
        panel_content:
            "<p>Visit our <a href='http://library.uq.edu.au'> services for students</a> page to make the most of your library this semester:</p><ul><li>Access learning resources for your courses, our Assignment Planner tool, and subject and referencing guides.</li><li>Build new skills with our Digital Essentials modules and discover in-person and online (LinkedIn Learning) training options.</li></ul>",
        panel_created_at: '2022-11-06T23:59',
        user_types: [
            {
                user_type: 'PUBLIC',
                user_type_name: 'Public (Not logged in}',
                display_type: 'current',
                is_default_panel: true,
            },
            {
                user_type: 'REMUG',
                user_type_name: 'Remote Undergraduate',
                display_type: 'current',
                is_default_panel: true,
            },
            {
                user_type: 'LOCUG',
                user_type_name: 'Local Undergraduate',
                display_type: 'current',
                is_default_panel: false,
            },
        ],
    },
    {
        panel_id: 2,
        admin_notes: 'Testing Panel ID 2',
        panel_title: 'Xmas Break',
        panel_content:
            "<p>Please note the following services will be unavailable during the christmas break:</p><ul><li>Enrolment Services.</li><li>Councelling services</li><li>Additional professional services such as vaccinations</li></ul><p>For further information, please visit <a href='http://library.uq.edu.au'> services for students</a> page to make informed decisions.</p>",

        panel_created_at: '2022-11-06T23:59',
        user_types: [
            {
                user_type: 'LOCUG',
                user_type_name: 'Local Undergraduate',
                display_type: 'current',
                is_default_panel: true,
            },
        ],
    },
    {
        panel_id: 3,
        admin_notes: 'Testing 3',
        panel_title: 'Exam Help',
        panel_content:
            "<p>Currently studying for exams?</p><ul><li>Private study rooms available</li><li>Extended library hours</li><li>Extended facility operating hours</li></ul><p>Please note: Ensure that you have <strong>All the information you need</strong> before commencing your studies</p>For further information, please visit <a href='http://library.uq.edu.au'> services for students</a> page for resources and advice.</p>",

        panel_created_at: '2022-11-06T23:59',
        user_types: [
            {
                user_type: 'LOCUG',
                user_type_name: 'Local Undergraduate',
                display_type: 'current',
                is_default_panel: false,
            },
            {
                user_type: 'PUBLIC',
                user_type_name: 'Public (Not logged in}',
                display_type: 'current',
                is_default_panel: false,
            },
        ],
    },
];

export const userListPanels = [
    {
        user_type: 'PUBLIC',
        user_type_name: 'Public (Not logged in}',
        panels: [
            {
                panel_id: 1,
                admin_notes: 'Panel ID 1 Test',
                panel_title: 'Welcome Students',
                panel_content:
                    "<p>Visit our <a href='http://library.uq.edu.au'> services for students</a> page to make the most of your library this semester:</p><ul><li>Access learning resources for your courses, our Assignment Planner tool, and subject and referencing guides.</li><li>Build new skills with our Digital Essentials modules and discover in-person and online (LinkedIn Learning) training options.</li></ul>",
                panel_start: null,
                panel_end: null,
                panel_created_at: '2022-11-06T23:59',
                is_default_panel: true,
            },

            {
                panel_id: 3,
                admin_notes: 'Testing 3',
                panel_title: 'Exam Help',
                panel_content:
                    "<p>Currently studying for exams?</p><ul><li>Private study rooms available</li><li>Extended library hours</li><li>Extended facility operating hours</li></ul><p>Please note: Ensure that you have <strong>All the information you need</strong> before commencing your studies</p>For further information, please visit <a href='http://library.uq.edu.au'> services for students</a> page for resources and advice.</p>",

                panel_start: '2022-11-06T23:59',
                panel_end: '2022-11-06T23:59',
                panel_created_at: '2022-11-06T23:59',
                is_default_panel: false,
            },
        ],
    },
    {
        user_type: 'REMUG',
        user_type_name: 'Remote Undergraduate',
        panels: [
            {
                panel_id: 1,
                admin_notes: 'Panel ID 1 Test',
                panel_title: 'Welcome Students',
                panel_content:
                    "<p>Visit our <a href='http://library.uq.edu.au'> services for students</a> page to make the most of your library this semester:</p><ul><li>Access learning resources for your courses, our Assignment Planner tool, and subject and referencing guides.</li><li>Build new skills with our Digital Essentials modules and discover in-person and online (LinkedIn Learning) training options.</li></ul>",
                panel_start: null,
                panel_end: null,
                panel_created_at: null,
                is_default_panel: true,
            },
        ],
    },
    {
        user_type: 'LOCUG',
        user_type_name: 'Local Undergraduate',
        panels: [
            {
                panel_id: 2,
                admin_notes: 'Testing Panel ID 2',
                panel_title: 'Xmas Break',
                panel_content:
                    "<p>Please note the following services will be unavailable during the christmas break:</p><ul><li>Enrolment Services.</li><li>Councelling services</li><li>Additional professional services such as vaccinations</li></ul><p>For further information, please visit <a href='http://library.uq.edu.au'> services for students</a> page to make informed decisions.</p>",
                panel_start: null,
                panel_end: null,
                panel_created_at: '2022-11-06T23:59',
                is_default_panel: true,
            },
            {
                panel_id: 1,
                admin_notes: 'Panel ID 1 Test',
                panel_title: 'Welcome Students',
                panel_content:
                    "<p>Visit our <a href='http://library.uq.edu.au'> services for students</a> page to make the most of your library this semester:</p><ul><li>Access learning resources for your courses, our Assignment Planner tool, and subject and referencing guides.</li><li>Build new skills with our Digital Essentials modules and discover in-person and online (LinkedIn Learning) training options.</li></ul>",
                panel_start: '2022-11-06T23:59',
                panel_end: '2022-11-06T23:59',
                panel_created_at: '2022-11-06T23:59',
                is_default_panel: false,
            },

            {
                panel_id: 3,
                admin_notes: 'Testing 3',
                panel_title: 'Exam Help',
                panel_content:
                    "<p>Currently studying for exams?</p><ul><li>Private study rooms available</li><li>Extended library hours</li><li>Extended facility operating hours</li></ul><p>Please note: Ensure that you have <strong>All the information you need</strong> before commencing your studies</p>For further information, please visit <a href='http://library.uq.edu.au'> services for students</a> page for resources and advice.</p>",

                panel_start: '2022-11-06T23:59',
                panel_end: '2022-11-06T23:59',
                panel_created_at: '2022-11-06T23:59',
                is_default_panel: false,
            },
        ],
    },
];