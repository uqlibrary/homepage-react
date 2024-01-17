import React, { Fragment } from 'react';

import DocumentIcon from '@mui/icons-material/Description';
import CourtHouseIcon from '@mui/icons-material/AccountBalance';
import { SpacedArrowForwardIcon } from './SpacedArrowForwardIcon';

export default {
    title: 'Learning resources',
    search: {
        title: 'Course search',
        autocompleteResultsTitle: 'Matching courses',
        noOptionsText: 'Enter a course code to find a course',
        noResultsText: 'No matching courses found',
        placeholder: 'Search by course code or keyword',
        unavailableText: 'Learning Resource suggestions unavailable',
    },
    searchResultsTitle: 'Search results',
    notesTrimLength: 90,
    externalSubjectLocation: 'External Instruction',
    homepagePanel: {
        title: 'Learning resources',
        userCourseTitle: 'Your courses',
        noCourses: (
            <Fragment>
                <p>Your enrolled courses will appear here three weeks prior to the start of the semester.</p>
                <p>Search for learning resources above.</p>
            </Fragment>
        ),
    },
    myCourses: {
        title: 'My courses',
        none: {
            title: 'No enrolled courses available',
            description: (
                <Fragment>
                    <p>Your enrolled courses will appear here three weeks prior to the start of the semester.</p>
                    <p>Search for learning resources using the &apos;Course search&apos; tab, above.</p>
                </Fragment>
            ),
        },
        readingLists: {
            title: 'Course reading lists',
            courseLink: 'https://uq.rl.talis.com/courses/[coursecode].html',
        },
        examPapers: {
            title: 'Past exam papers',
            none: 'No Past Exam Papers for this course',
            unavailable: 'Exam papers list currently unavailable',
            footer: {
                noPastExams: {
                    linkOut: 'https://www.library.uq.edu.au/exams/',
                    linkLabel: 'Search for other exam papers',
                },
                morePastExams: {
                    linkOutPattern: 'https://www.library.uq.edu.au/exams/course/[courseCode]',
                    linkLabel: '[numberExcessExams] more past [examNumber]',
                },
            },
            visibleItemsCount: 2,
        },
        guides: {
            title: 'Subject guides',
            none: 'No subject guides for this course',
            unavailable: 'Subject guides list currently unavailable',
            footer: {
                links: [
                    {
                        icon: <DocumentIcon style={{ marginRight: 6 }} />,
                        id: 'referencingGuides',
                        linkLabel: 'Referencing guides',
                        linkTo: 'https://guides.library.uq.edu.au/referencing',
                    },
                    {
                        icon: <SpacedArrowForwardIcon />,
                        id: 'all-guides',
                        linkLabel: 'All library guides',
                        linkTo: 'https://guides.library.uq.edu.au',
                    },
                ],
            },
            visibleItemsCount: 3,
        },
        courseLinks: {
            title: 'Course links',
            links: [
                {
                    icon: <SpacedArrowForwardIcon />,
                    id: 'blackboard',
                    linkLabel: 'Learn.UQ (Blackboard)',
                    linkOutPattern: 'https://learn.uq.edu.au/',
                },
                {
                    icon: <SpacedArrowForwardIcon />,
                    id: 'ecp',
                    linkLabel: 'Electronic Course Profile',
                    linkOutPattern: 'https://www.uq.edu.au/study/course.html?course_code=[courseCode]',
                },
            ],
            legalResearchEssentials: {
                // displays with list above, but for LAWS subjects only
                icon: <CourtHouseIcon style={{ marginRight: 6 }} />,
                id: 'legalResearchEssentials',
                linkLabel: 'Legal Research Essentials',
                linkOutPattern: 'https://web.library.uq.edu.au/library-services/training/legal-research-essentials',
            },
        },
    },
};
