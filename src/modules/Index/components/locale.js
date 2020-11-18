import React from 'react';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import { primoSearch } from 'modules/Index/components/PrimoSearch/components/primoSearchLocale';

export default {
    PrimoSearch: primoSearch,
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
