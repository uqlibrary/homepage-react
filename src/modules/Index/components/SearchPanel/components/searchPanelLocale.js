import React from 'react';

import DescriptionIcon from '@material-ui/icons/Description';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import InboxIcon from '@material-ui/icons/Inbox';
import ListAltIcon from '@material-ui/icons/ListAlt';
import MovieIcon from '@material-ui/icons/Movie';
import PublicIcon from '@material-ui/icons/Public';
import SchoolIcon from '@material-ui/icons/School';
import StorageIcon from '@material-ui/icons/Storage';

const primoPrefix = '&tab=61uq_all&search_scope=61UQ_All&sortby=rank&vid=61UQ&offset=0';

export const searchPanelLocale = {
    typeSelect: {
        label: 'Search',
        items: [
            {
                name: 'Library',
                icon: <PublicIcon size="small" color="secondary" />,
                placeholder: 'Find books, databases, conferences and more...',
                link:
                    'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]' +
                    primoPrefix +
                    '&facet=rtype,exclude,newspaper_articles,lk&facet=rtype,exclude,reviews,lk',
            },
            {
                name: 'Books',
                icon: <ImportContactsIcon size="small" color="secondary" />,
                placeholder: 'Enter a keyword, title, author etc...',
                link:
                    'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]' +
                    primoPrefix +
                    '&facet=rtype,include,books',
            },
            {
                name: 'Journal articles',
                icon: <SchoolIcon size="small" color="secondary" />,
                placeholder: 'Enter a keyword, article title, author, publication etc ...',
                link:
                    'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]' +
                    primoPrefix +
                    '&facet=rtype,include,articles',
            },
            {
                name: 'Video & audio',
                icon: <MovieIcon size="small" color="secondary" />,
                placeholder: 'Enter a keyword, title, cast, crew, composer, artist etc...',
                link:
                    'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]' +
                    primoPrefix +
                    '&mfacet=rtype,include,videos,1&mfacet=rtype,include,audios,1',
            },
            {
                name: 'Journals',
                icon: <DescriptionIcon size="small" color="secondary" />,
                placeholder: 'Enter journal or newspaper title',
                link:
                    'https://search.library.uq.edu.au/primo-explore/search?query=title,contains,[keyword],AND' +
                    primoPrefix +
                    '&mfacet=rtype,include,newspapers,1&mfacet=rtype,include,journals,1&mode=advanced',
            },
            {
                name: 'Physical items',
                icon: <InboxIcon size="small" color="secondary" />,
                placeholder: 'Enter a keyword, title, author etc...',
                link:
                    'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]' +
                    primoPrefix +
                    '&facet=tlevel,include,physical_items',
            },
            {
                name: 'Databases',
                icon: <StorageIcon size="small" color="secondary" />,
                placeholder: 'Enter database title',
                link:
                    'https://search.library.uq.edu.au/primo-explore/dbsearch?query=any,contains,[keyword]&tab=jsearch_slot&vid=61UQ&offset=0&databases=any,[keyword]',
            },
            {
                name: 'Past exam papers',
                icon: <FindInPageIcon size="small" color="secondary" />,
                placeholder: 'Enter a course code',
                link: 'https://www.library.uq.edu.au/exams/papers.php?stub=[keyword]',
            },
            {
                name: 'Course reading lists',
                icon: <ListAltIcon size="small" color="secondary" />,
                placeholder: 'Enter a course code',
                link: 'https://uq.rl.talis.com/search.html?q=[keyword]',
            },
        ],
    },
    links: [
        {
            label: 'Search help',
            link: 'https://web.library.uq.edu.au/research-tools-techniques/uq-library-search',
            display: [0, 1, 2, 3, 4, 5],
        },
        {
            label: 'Advanced search',
            link: 'https://search.library.uq.edu.au/primo-explore/search?vid=61UQ&sortby=rank&mode=advanced',
            display: [0, 1, 2, 3, 4, 5],
        },
        {
            label: 'Database search',
            link: 'https://search.library.uq.edu.au/primo-explore/dbsearch?vid=61UQ',
            display: [0, 1, 2, 3, 4, 5],
        },
        {
            label: 'Database help',
            link:
                'https://web.library.uq.edu.au/research-tools-techniques/search-techniques/where-and-how-search/searching-databases',
            display: [6],
        },
        {
            label: 'Browse databases',
            link: 'https://search.library.uq.edu.au/primo-explore/dbsearch?vid=61UQ',
            display: [6],
        },
        {
            label: 'Browse search',
            link: 'https://search.library.uq.edu.au/primo-explore/browse?vid=61UQ&sortby=rank',
            display: [0, 1, 2, 3, 4, 5],
        },
        {
            label: 'Browse courses',
            link: 'https://search.library.uq.edu.au/primo-explore/browse?vid=61UQ&sortby=rank',
            display: [7, 8],
        },
    ],
};
