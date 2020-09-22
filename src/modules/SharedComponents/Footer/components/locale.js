import React from 'react';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';

export default {
    connectFooter: {
        buttonSocialLabel: 'Connect with us',
        buttonSocial: [
            {
                dataTestid: 'connect-blog-link',
                linklabel: 'Blog',
                linktitle: 'Library Blog',
                linkTo: 'https://web.library.uq.edu.au/blog',
            },
            {
                dataTestid: 'connect-twitter-link',
                linktitle: 'Library on Twitter',
                linkTo: 'https://twitter.com/UQ_Library',
                icon: <TwitterIcon />,
            },
            {
                dataTestid: 'connect-facebook-link',
                linktitle: 'Library on Facebook',
                linkTo: 'https://www.facebook.com/uniofqldlibrary',
                icon: <FacebookIcon />,
            },
            {
                dataTestid: 'connect-instagram-link',
                linktitle: 'Library on Instagram',
                linkTo: 'https://www.instagram.com/uniofqldlibrary/',
                icon: <InstagramIcon />,
            },
            {
                dataTestid: 'connect-youtube-link',
                linktitle: 'Library on YouTube',
                linkTo: 'https://www.youtube.com/user/uqlibrary',
                icon: <YouTubeIcon />,
            },
        ],
        internalLinks: [
            {
                dataTestid: 'connect-feedback-link',
                linklabel: 'Feedback',
                linkTo: 'https://support.my.uq.edu.au/app/library/feedback',
            },
            {
                dataTestid: 'connect-participate-link',
                linklabel: 'Help us improve',
                linkTo: 'https://web.library.uq.edu.au/about-us/participate-customer-research',
            },
            {
                dataTestid: 'connect-sitemap-link',
                linklabel: 'Site Map',
                linkTo: 'https://web.library.uq.edu.au/sitemap',
            },
        ],
        givingLinks: [
            {
                dataTestid: 'connect-friends-link',
                label: 'Join Friends of the Library',
                linkTo: 'https://web.library.uq.edu.au/about-us/friends-library',
            },
            {
                dataTestid: 'connect-give-link',
                label: 'Give to the Library',
                linkTo: 'https://www.uq.edu.au/giving/organisations/university-queensland-library',
            },
        ],
    },
    minimalFooter: {
        leftColumn: {
            line1: [
                {
                    type: 'text',
                    text: '© The University of Queensland',
                },
            ],
            line2: [
                {
                    type: 'text',
                    text: 'Enquiries:',
                },
                {
                    type: 'link',
                    dataTestid: 'footer-enquiries-link',
                    linkLabel: '+61 7 3365 1111',
                    linktitle: 'UQ Enquiries phone number',
                    linkTo: 'tel:+61733651111',
                },
                {
                    type: 'divider',
                },
                {
                    type: 'link',
                    dataTestid: 'footer-contacts-link',
                    linkLabel: 'Contact directory',
                    linkTo: 'http://uq.edu.au/contacts',
                },
            ],
            line3: [
                {
                    type: 'abbr',
                    abbrDisplay: 'ABN',
                    abbrMouseoverText: 'Australian Business Number',
                },
                {
                    type: 'space',
                },
                {
                    type: 'text',
                    text: '63 942 912 684:',
                },
                {
                    type: 'divider',
                },
                {
                    type: 'abbr',
                    abbrDisplay: 'CRICOS',
                    abbrabbrMouseoverText: 'Commonwealth Register of Institutions and Courses for Overseas Students',
                },
                {
                    type: 'space',
                },
                {
                    type: 'link',
                    dataTestid: 'footer-cricos-link',
                    linkLabel: '00025B',
                    linktitle: 'Provider number',
                    linkTo: 'https://www.uq.edu.au/about/cricos-link',
                },
            ],
        },
        rightColumn: {
            line1: [
                {
                    type: 'header',
                    text: 'Emergency',
                },
            ],
            line2: [
                {
                    type: 'text',
                    text: 'Phone:',
                },
                {
                    type: 'link',
                    dataTestid: 'footer-emergency-link',
                    linkLabel: '3365 3333',
                    linktitle: 'UQ Emergency phone number',
                    linkTo: 'tel:+61733653333',
                },
            ],
        },
        bottomBlock: {
            line1: [
                {
                    type: 'link',
                    dataTestid: 'footer-terms-link',
                    linkLabel: 'Privacy & Terms of use',
                    linkTo: 'https://www.uq.edu.au/terms-of-use/',
                },
                {
                    type: 'divider',
                },
                {
                    type: 'link',
                    dataTestid: 'footer-feedback-link',
                    linkLabel: 'Feedback',
                    linkTo: 'https://support.my.uq.edu.au/app/library/feedback',
                },
            ],
        },
    },
};
