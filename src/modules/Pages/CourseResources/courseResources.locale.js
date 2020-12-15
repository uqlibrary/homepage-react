import React, { Fragment } from 'react';

import DocumentIcon from '@material-ui/icons/Description';
import CourtHouseIcon from '@material-ui/icons/AccountBalance';
import { SpacedArrowForwardIcon } from './components/SpacedArrowForwardIcon';

export default {
    title: 'Course resources',
    search: {
        title: 'Course search',
    },
    notesTrimLength: 90,
    myCourses: {
        title: 'My courses',
        none: {
            title: 'No enrolled courses available',
            description: (
                <Fragment>
                    <p>Your enrolled courses will appear here three weeks prior to the start of the semester.</p>
                    <p>Search for course resources using the &quot;Course search&quot; tab, above.</p>
                </Fragment>
            ),
        },
        readingLists: {
            title: 'Reading list',
            error: {
                none: 'No reading list for this course',
                unavailable: 'Reading list currently unavailable',
                multiple: 'More than one reading list found for [classnumber]. Please select a list:',
                footer: {
                    linkLabel: 'Search other reading lists',
                    linkOut: 'http://lr.library.uq.edu.au/index.html',
                },
            },
            footer: {
                linkLabel: '[numberExcessReadingLists] more [readingListNumber]',
            },
            visibleItemsCount: 2,
        },
        examPapers: {
            title: 'Past exam papers',
            none: 'No Past Exam Papers for this course',
            unavailable: 'Exam papers list currently unavailable',
            morePastExams: '[numberExcessExams] more past [examNumber]',
            footer: {
                linkOutPattern: 'https://www.library.uq.edu.au/exams/papers.php?stub=[courseCode]',
                linkLabel: 'Search for other exam papers',
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
