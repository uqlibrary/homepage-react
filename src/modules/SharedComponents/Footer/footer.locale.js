import React from 'react';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import CreateIcon from '@material-ui/icons/Create';

export default {
    connectFooter: {
        buttonSocialHeader: 'Connect with us',
        buttonSocial: [
            {
                dataTestid: 'connect-blog-link',
                icon: <CreateIcon />,
                linkMouseOver: 'Library Blog',
                linkTo: 'https://web.library.uq.edu.au/blog',
            },
            {
                dataTestid: 'connect-twitter-link',
                icon: <TwitterIcon />,
                linkMouseOver: 'Library on Twitter',
                linkTo: 'https://twitter.com/UQ_Library',
            },
            {
                dataTestid: 'connect-facebook-link',
                icon: <FacebookIcon />,
                linkMouseOver: 'Library on Facebook',
                linkTo: 'https://www.facebook.com/uniofqldlibrary',
            },
            {
                dataTestid: 'connect-instagram-link',
                icon: <InstagramIcon />,
                linkMouseOver: 'Library on Instagram',
                linkTo: 'https://www.instagram.com/uniofqldlibrary/',
            },
            {
                dataTestid: 'connect-youtube-link',
                icon: <YouTubeIcon />,
                linkMouseOver: 'Library on YouTube',
                linkTo: 'https://www.youtube.com/user/uqlibrary',
            },
        ],
        internalLinks: [
            {
                dataTestid: 'connect-feedback-link',
                linklabel: 'Library feedback',
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
                linkTo: 'https://alumni.uq.edu.au/uq-library',
            },
        ],
    },
};
