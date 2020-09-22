import React from 'react';
import PublicIcon from '@material-ui/icons/Public';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import DescriptionIcon from '@material-ui/icons/Description';
import MovieIcon from '@material-ui/icons/Movie';
import InboxIcon from '@material-ui/icons/Inbox';
import StorageIcon from '@material-ui/icons/Storage';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import ListAltIcon from '@material-ui/icons/ListAlt';
import SchoolIcon from '@material-ui/icons/School';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';

export default {
    PrimoSearch: {
        typeSelect: {
            label: 'Search',
            items: [
                {
                    name: 'Library',
                    icon: <PublicIcon size="small" color="secondary" />,
                    placeholder: 'Find books, databases, conferences and more...',
                    link:
                        'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]&tab=61uq_all&search_scope=61UQ_All&sortby=rank&vid=61UQ&offset=0&facet=rtype,exclude,newspaper_articles,lk&facet=rtype,exclude,reviews,lk',
                },
                {
                    name: 'Books',
                    icon: <ImportContactsIcon size="small" color="secondary" />,
                    placeholder: 'Enter a keyword, title, author etc...',
                    link:
                        'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]&tab=61uq_all&search_scope=61UQ_All&sortby=rank&vid=61UQ&offset=0&facet=rtype,include,books,lk',
                },
                {
                    name: 'Journal articles',
                    icon: <SchoolIcon size="small" color="secondary" />,
                    placeholder: 'Enter a keyword, article title, author, publication etc ...',
                    link:
                        'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]&tab=61uq_all&search_scope=61UQ_All&vid=61UQ&offset=0&fctV=articles&facet=rtype,include,articles,lk',
                },
                {
                    name: 'Video & audio',
                    icon: <MovieIcon size="small" color="secondary" />,
                    placeholder: 'Enter a keyword, title, cast, crew, composer, artist etc...',
                    link:
                        'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]&tab=61uq_all&search_scope=61UQ_All&sortby=rank&vid=61UQ&offset=0&facet=rtype,include,media,lk',
                },
                {
                    name: 'Journals',
                    icon: <DescriptionIcon size="small" color="secondary" />,
                    placeholder: 'Enter journal or newspaper title',
                    link:
                        'https://search.library.uq.edu.au/primo-explore/search?query=title,contains,[keyword],AND&tab=61uq_all&vid=61UQ&search_scope=61UQ_All&sortby=rank&mfacet=rtype,include,journals,1,lk&mode=advanced&offset=0',
                },
                {
                    name: 'Physical items',
                    icon: <InboxIcon size="small" color="secondary" />,
                    placeholder: 'Enter a keyword, title, author etc...',
                    link:
                        'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]&tab=61uq_all&search_scope=61UQ_All&vid=61UQ&offset=0&facet=tlevel,include,physical_items,lk',
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
                display: [0, 1, 2, 3, 4, 5, 6],
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
    },
    LibraryServices: {
        links: [
            {
                title: 'Services for community',
                url: 'https://web.library.uq.edu.au/library-services/services-for-community',
            },
            {
                title: 'Services for hospital staff',
                url: 'https://web.library.uq.edu.au/library-services/services-for-hospital-staff',
            },
            {
                title: 'Services for professional staff',
                url: 'https://web.library.uq.edu.au/library-services/services-professional-staff',
            },
            {
                title: 'Services for researchers',
                url: 'https://web.library.uq.edu.au/library-services/services-researchers',
            },
            {
                title: 'Services for secondary schools',
                url: 'https://web.library.uq.edu.au/library-services/services-for-secondary-schools',
            },
            {
                title: 'Services for students',
                url: 'https://web.library.uq.edu.au/library-services/services-students',
            },
            {
                title: 'Services for teaching staff',
                url: 'https://web.library.uq.edu.au/library-services/services-teaching-staff',
            },
            {
                title: 'Services for UQ alumni',
                url: 'https://web.library.uq.edu.au/library-services/services-uq-alumni',
            },
            {
                title: 'Services for external and remote students',
                url:
                    'https://web.library.uq.edu.au/borrowing-requesting/how-borrow/borrowing-external-and-remote-students',
            },
        ],
    },
    Hours: [
        {
            title: 'Arch music',
            link: '#',
            location: '',
            hours: '7:30am-7:30pm',
            icon: <AccessTimeIcon style={{ color: '#CCC' }} />,
        },
        {
            title: 'AskUs',
            link: '#',
            location: '',
            hours: '8am-8pm',
            icon: <AccessTimeIcon style={{ color: '#CCC' }} />,
        },
        {
            title: 'Biol Sci',
            link: '#',
            location: '',
            hours: '24hrs',
            icon: <AccessTimeIcon style={{ color: 'green' }} />,
        },
        {
            title: 'Bundaberg',
            link: '#',
            location: '',
            hours: '8:30am-4:30am',
            icon: <AccessTimeIcon style={{ color: '#CCC' }} />,
        },
        {
            title: 'Central',
            link: '#',
            location: '',
            hours: '24hrs',
            icon: <AccessTimeIcon style={{ color: 'green' }} />,
        },
        {
            title: 'DHEngSci',
            link: '#',
            location: '',
            hours: '24hrs',
            icon: <AccessTimeIcon style={{ color: 'green' }} />,
        },
        {
            title: 'Duhig Study',
            link: '#',
            location: '',
            hours: '24hrs',
            icon: <AccessTimeIcon style={{ color: 'green' }} />,
        },
        {
            title: 'Fryer',
            link: '#',
            location: '',
            hours: '9am-5pm by appointment',
            icon: <AccessTimeIcon style={{ color: 'orange' }} />,
        },
        {
            title: 'Gatton',
            link: '#',
            location: '',
            hours: '24hrs',
            icon: <AccessTimeIcon style={{ color: 'green' }} />,
        },
        {
            title: 'Herston',
            link: '#',
            location: '',
            hours: 'Chat/Email/Phone',
            icon: <ImportantDevicesIcon style={{ color: 'orange' }} />,
        },
        {
            title: 'Harvey Bay',
            link: '#',
            location: '',
            hours: 'Online/Phone',
            icon: <ImportantDevicesIcon style={{ color: 'orange' }} />,
        },
        {
            title: 'Law',
            link: '#',
            location: '',
            hours: '24hrs',
            icon: <AccessTimeIcon style={{ color: 'green' }} />,
        },
        {
            title: 'PACE',
            link: '#',
            location: '',
            hours: '7am-10:30pm',
            icon: <AccessTimeIcon style={{ color: '#CCC' }} />,
        },
        {
            title: 'Rockhampton',
            link: '#',
            location: '',
            hours: 'Online/Phone',
            icon: <ImportantDevicesIcon style={{ color: 'orange' }} />,
        },
        {
            title: 'Toowoomba',
            link: '#',
            location: '',
            hours: '8:30am-4:30pm',
            icon: <AccessTimeIcon style={{ color: '#CCC' }} />,
        },
        {
            title: 'Whitty Mater',
            link: '#',
            location: '',
            hours: '6:30am-10pm',
            icon: <AccessTimeIcon style={{ color: '#CCC' }} />,
        },
    ],
};
