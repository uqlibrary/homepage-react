export default {
    connectFooter: {
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
                imageAlt: 'Twitter icon',
                imageAriaLabel: 'Library on Twitter',
                imageSrc: '//assets.library.uq.edu.au/reusable-components/resources/social-media-icons/twitter.png',
                imageTitle: 'Twitter',
            },
            {
                dataTestid: 'connect-facebook-link',
                linktitle: 'Library on Facebook',
                linkTo: 'https://www.facebook.com/uniofqldlibrary',
                icon: 'FacebookIcon',
                imageAlt: 'Facebook icon',
                imageAriaLabel: 'Library on Facebook',
                imageTitle: 'Facebook',
            },
            {
                dataTestid: 'connect-instagram-link',
                linktitle: 'Library on Instagram',
                linkTo: 'https://www.instagram.com/uniofqldlibrary/',
                imageAlt: 'Instagram icon',
                imageAriaLabel: 'Library on YouTube',
                imageSrc: '//assets.library.uq.edu.au/reusable-components/resources/social-media-icons/instagram.png',
                imageTitle: 'YouTube',
            },
            {
                dataTestid: 'connect-youtube-link',
                linktitle: 'Library on YouTube',
                linkTo: 'https://www.youtube.com/user/uqlibrary',
                imageAlt: 'YouTube icon',
                imageAriaLabel: 'Library on YouTube',
                imageSrc: '//assets.library.uq.edu.au/reusable-components/resources/social-media-icons/youtube.png',
                imageTitle: 'YouTube',
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
                ariaLabel: 'Join Friends of the Library',
                dataTestid: 'connect-friends-link',
                id: 'joinFriend',
                label: 'Join Friends of the Library',
                linkTo: 'https://web.library.uq.edu.au/about-us/friends-library',
            },
            {
                ariaLabel: 'Give to the Library',
                dataTestid: 'connect-give-link',
                id: 'giveToLibrary',
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
                    abbrTitle: 'Australian Business Number',
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
                    abbrTitle: 'Commonwealth Register of Institutions and Courses for Overseas Students',
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
