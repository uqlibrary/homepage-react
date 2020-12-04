import React from 'react';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import MailIcon from '@material-ui/icons/Mail';
import PhoneIcon from '@material-ui/icons/Phone';
import DescriptionIcon from '@material-ui/icons/Description';
import ChatIcon from '@material-ui/icons/Chat';

export const askUsLocale = {
    askUs: {
        title: 'Ask us',
        links: [
            {
                title: 'FAQ',
                url: 'https://support.my.uq.edu.au/app/library/faqs',
                icon: <ImportContactsIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
                ariaLabel: '',
            },
            {
                title: 'Chat',
                url: 'https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45',
                icon: <ChatIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
                ariaLabel: '',
            },
            {
                title: 'Email',
                url: 'mailto:askus@library.uq.edu.au',
                icon: <MailIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
                ariaLabel: 'Email askus@library.uq.edu.au',
            },
            {
                title: 'Phone',
                url: 'https://web.library.uq.edu.au/contact-us',
                icon: <PhoneIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
                ariaLabel: '',
            },
            {
                title: 'Contact form',
                url: 'https://support.my.uq.edu.au/app/library/contact',
                icon: <DescriptionIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
                ariaLabel: '',
            },
            {
                title: 'Exam support',
                url: 'https://web.library.uq.edu.au/contact-us',
                icon: <SupervisorAccountIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
                ariaLabel: '',
            },
        ],
        lastLink: {
            title: 'More ways to contact us',
            url: 'https://web.library.uq.edu.au/contact-us',
            icon: '',
        },
    },
};
