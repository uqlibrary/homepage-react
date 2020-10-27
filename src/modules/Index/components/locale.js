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
import InfoOutlined from '@material-ui/icons/InfoOutlined';

const primoPrefix = '&tab=61uq_all&search_scope=61UQ_All&sortby=rank&vid=61UQ&offset=0';

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
            icon: null,
            iconInfo: null,
        },
        {
            title: 'AskUs',
            link: '#',
            location: '',
            hours: '8am-8pm',
            icon: null,
            iconInfo: null,
        },
        {
            title: 'Biol Sci',
            link: '#',
            location: '',
            hours: '24hrs',
            icon: <AccessTimeIcon style={{ color: 'green' }} />,
            iconInfo: 'Part of this location is open 24hrs',
        },
        {
            title: 'Bundaberg',
            link: '#',
            location: '',
            hours: '8:30am-4:30am',
            icon: null,
            iconInfo: null,
        },
        {
            title: 'Central',
            link: '#',
            location: '',
            hours: '24hrs',
            icon: <AccessTimeIcon style={{ color: 'green' }} />,
            iconInfo: 'Part of this location is open 24hrs',
        },
        {
            title: 'DHEngSci',
            link: '#',
            location: '',
            hours: '24hrs',
            icon: <AccessTimeIcon style={{ color: 'green' }} />,
            iconInfo: 'Part of this location is open 24hrs',
        },
        {
            title: 'Duhig Study',
            link: '#',
            location: '',
            hours: '24hrs',
            icon: <AccessTimeIcon style={{ color: 'green' }} />,
            iconInfo: 'Part of this location is open 24hrs',
        },
        {
            title: 'Fryer',
            link: '#',
            location: '',
            hours: '9am-5pm by appointment',
            icon: <AccessTimeIcon style={{ color: 'orange' }} />,
            iconInfo: 'Part of this location is open 24hrs',
        },
        {
            title: 'Gatton',
            link: '#',
            location: '',
            hours: '24hrs',
            icon: <AccessTimeIcon style={{ color: 'green' }} />,
            iconInfo: 'Part of this location is open 24hrs',
        },
        {
            title: 'Herston',
            link: '#',
            location: '',
            hours: 'Chat/Email/Phone',
            icon: <ImportantDevicesIcon style={{ color: 'orange' }} />,
            iconInfo: 'Online via Chat/Email/Phone only',
        },
        {
            title: 'Harvey Bay',
            link: '#',
            location: '',
            hours: 'Online/Phone',
            icon: <ImportantDevicesIcon style={{ color: 'orange' }} />,
            iconInfo: 'Online via Chat/Phone only',
        },
        {
            title: 'Law',
            link: '#',
            location: '',
            hours: '24hrs',
            icon: <AccessTimeIcon style={{ color: 'green' }} />,
            iconInfo: 'Part of this location is open 24hrs',
        },
        {
            title: 'PACE',
            link: '#',
            location: '',
            hours: '7am-10:30pm',
            icon: <InfoOutlined style={{ color: '#316799' }} />,
            iconInfo: 'Extended study space hours',
        },
        {
            title: 'Rockhampton',
            link: '#',
            location: '',
            hours: 'Online/Phone',
            icon: <ImportantDevicesIcon style={{ color: 'orange' }} />,
            iconInfo: 'Online via Chat/Phone only',
        },
        {
            title: 'Toowoomba',
            link: '#',
            location: '',
            hours: '8:30am-4:30pm',
            icon: null,
        },
        {
            title: 'Whitty Mater',
            link: '#',
            location: '',
            hours: '6:30am-10pm',
            icon: null,
        },
    ],
    Computers: [
        {
            title: 'Arch Music',
            link: '#',
            free: 16,
            total: 41,
        },
        {
            title: 'Biol Sci',
            link: '#',
            free: 60,
            total: 205,
        },
        {
            title: 'Central Library',
            link: '#',
            free: 13,
            total: 80,
        },
        {
            title: 'DHEngSci',
            link: '#',
            free: 41,
            total: 132,
        },
        {
            title: 'DuhigStudy',
            link: '#',
            free: 64,
            total: 196,
        },
        {
            title: 'Gatton',
            link: '#',
            free: 48,
            total: 101,
        },
        {
            title: 'Herston',
            link: '#',
            free: 22,
            total: 38,
        },
        {
            title: 'Law Library',
            link: '#',
            free: 15,
            total: 125,
        },
        {
            title: 'PACE',
            link: '#',
            free: 33,
            total: 58,
        },
        {
            title: 'Whitty',
            link: '#',
            free: 4,
            total: 9,
        },
    ],
    Training: [
        {
            date: 'Tuesday 22nd September 2020',
            day: 'Tuesday',
            dayDate: 22,
            monthDate: 'September',
            title: 'NVivo Pro - Next steps',
            time: '9:30am',
            format: 'Online',
            link: '#',
        },
        {
            date: 'Wednesday 23rd September 2020',
            day: 'Wednesday',
            dayDate: 23,
            monthDate: 'September',
            title: 'Excel: processing data',
            time: '9:30am',
            format: 'Online',
            link: '#',
        },
        {
            date: 'Wednesday 23rd September 2020',
            day: 'Wednesday',
            dayDate: 23,
            monthDate: 'September',
            title: 'Endnote: getting started',
            time: '1:30pm',
            format: 'Online',
            link: '#',
        },
        {
            date: 'Wednesday 23rd September 2020',
            day: 'Wednesday',
            dayDate: 23,
            monthDate: 'September',
            title: 'EndNote for thesis and publications writing',
            time: '1:30pm',
            format: 'Online',
            link: '#',
        },
        {
            date: 'Thursday 24th September 2020',
            day: 'Thursday',
            dayDate: 24,
            monthDate: 'September',
            title: 'R data manipulation with RStudio and dplyr:',
            time: '9:30am',
            format: 'Online',
            link: '#',
        },
        {
            date: 'Thursday 24th September 2020',
            day: 'Thursday',
            dayDate: 24,
            monthDate: 'September',
            title: 'Researcher Lunchbox Session: Who’s looking at your research?',
            time: '12:00pm',
            format: 'Online',
            link: '#',
        },
    ],
};
