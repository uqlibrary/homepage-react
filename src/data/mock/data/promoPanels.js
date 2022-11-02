export const currentPanels = [
    {
        panel_id: 1,
        admin_notes: 'Panel ID 1 Test',
        panel_title: 'Welcome Students',
        panel_content:
            "<p>Visit our <a href='http://library.uq.edu.au'> services for students</a> page to make the most of your library this semester:</p><ul><li>Access learning resources for your courses, our Assignment Planner tool, and subject and referencing guides.</li><li>Build new skills with our Digital Essentials modules and discover in-person and online (LinkedIn Learning) training options.</li></ul>",
        panel_created_at: '2022-11-06T23:59',
        user_groups: [
            {
                user_group_id: 1,
                user_group: 'PUBLIC',
                user_group_name: 'Public (Not logged in}',
                is_panel_default_for_this_user: 'Y',
                panel_schedule_start_time: null,
                panel_schedule_end_time: null,
                
            },
            {
                user_group_id: 2,
                user_group: 'REMUG',
                user_group_name: 'Remote Undergraduate',
                is_panel_default_for_this_user: 'Y',
                panel_schedule_start_time: null,
                panel_schedule_end_time: null,
            },
            {
                user_group_id: 3,
                user_group: 'LOCUG',
                user_group_name: 'Local Undergraduate',
                is_panel_default_for_this_user: 'Y',
                panel_schedule_start_time: null,
                panel_schedule_end_time: null,
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
        user_groups: [
            {
                user_group_id: 3,
                user_group: 'LOCUG',
                user_group_name: 'Local Undergraduate',
                is_panel_default_for_this_user: 'N',
                panel_schedule_start_time: '2022-01-12 10:00:00',
                panel_schedule_end_time: '2022-01-12 10:00:00',
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
        user_groups: [
            {
                user_group_id: 3,
                user_group: 'LOCUG',
                user_group_name: 'Local Undergraduate',
                is_panel_default_for_this_user: 'N',
                panel_schedule_start_time: '2022-01-12 10:00:00',
                panel_schedule_end_time: '2022-01-12 10:00:00',
            },
            {
                user_group_id: 1,
                user_group: 'PUBLIC',
                user_group_name: 'Public (Not logged in}',
                is_panel_default_for_this_user: 'N',
                panel_schedule_start_time: '2022-01-12 10:00:00',
                panel_schedule_end_time: '2022-01-12 10:00:00',
            },
        ],
    },
];

export const userListPanels = [
    {
        user_group: 'PUBLIC',
        user_group_name: 'Public (Not logged in}',
        scheduled_panels: [
            {
                panel_id: 3,
                panel_admin_notes: 'Testing 3',
                panel_title: 'Exam Help',
                panel_content:
                    "<p>Currently studying for exams?</p><ul><li>Private study rooms available</li><li>Extended library hours</li><li>Extended facility operating hours</li></ul><p>Please note: Ensure that you have <strong>All the information you need</strong> before commencing your studies</p>For further information, please visit <a href='http://library.uq.edu.au'> services for students</a> page for resources and advice.</p>",

                panel_schedule_start_time: '2022-01-12 10:00:00',
                panel_schedule_end_time: '2022-01-12 10:00:00',
                panel_created_at: '2022-11-06T23:59',
            },
        ],
        default_panel: {
                panel_id: 1,
                panel_admin_notes: 'Panel ID 1 Test',
                panel_title: 'Welcome Students',
                panel_content:
                    "<p>Visit our <a href='http://library.uq.edu.au'> services for students</a> page to make the most of your library this semester:</p><ul><li>Access learning resources for your courses, our Assignment Planner tool, and subject and referencing guides.</li><li>Build new skills with our Digital Essentials modules and discover in-person and online (LinkedIn Learning) training options.</li></ul>",
       }
    },
    {
        user_group: 'REMUG',
        user_group_name: 'Remote Undergraduate',
        scheduled_panels: [],
        default_panel: {
           
                panel_id: 1,
                panel_admin_notes: 'Panel ID 1 Test',
                panel_title: 'Welcome Students',
                panel_content:
                    "<p>Visit our <a href='http://library.uq.edu.au'> services for students</a> page to make the most of your library this semester:</p><ul><li>Access learning resources for your courses, our Assignment Planner tool, and subject and referencing guides.</li><li>Build new skills with our Digital Essentials modules and discover in-person and online (LinkedIn Learning) training options.</li></ul>",             
       }
    },
    {
        user_group: 'LOCUG',
        user_group_name: 'Local Undergraduate',
        scheduled_panels: [
            {
                panel_id: 3,
                panel_admin_notes: 'Testing 3',
                panel_title: 'Exam Help',
                panel_content:
                    "<p>Currently studying for exams?</p><ul><li>Private study rooms available</li><li>Extended library hours</li><li>Extended facility operating hours</li></ul><p>Please note: Ensure that you have <strong>All the information you need</strong> before commencing your studies</p>For further information, please visit <a href='http://library.uq.edu.au'> services for students</a> page for resources and advice.</p>",

                panel_schedule_start_time: '2022-01-12 10:00:00',
                panel_schedule_end_time: '2022-01-12 10:00:00',
                panel_created_at: '2022-11-06T23:59',
            },
            {
                panel_id: 2,
                admin_notes: 'Testing Panel ID 2',
                panel_title: 'Xmas Break',
                panel_content:
                    "<p>Please note the following services will be unavailable during the christmas break:</p><ul><li>Enrolment Services.</li><li>Councelling services</li><li>Additional professional services such as vaccinations</li></ul><p>For further information, please visit <a href='http://library.uq.edu.au'> services for students</a> page to make informed decisions.</p>",
        
                panel_schedule_start_time: '2022-01-12 10:00:00',
                panel_schedule_end_time: '2022-01-12 10:00:00',
                panel_created_at: '2022-11-06T23:59',
            }
        ],
        default_panel: {
            panel_id: 1,
            panel_admin_notes: 'Panel ID 1 Test',
            panel_title: 'Welcome Students',
            panel_content:
                "<p>Visit our <a href='http://library.uq.edu.au'> services for students</a> page to make the most of your library this semester:</p><ul><li>Access learning resources for your courses, our Assignment Planner tool, and subject and referencing guides.</li><li>Build new skills with our Digital Essentials modules and discover in-person and online (LinkedIn Learning) training options.</li></ul>",
        }
    },
    {
        user_group: 'EMPTY',
        user_group_name: 'Intentionally Empty Group',
        scheduled_panels: [
            
        ],
        default_panel: {
        }
    },
];