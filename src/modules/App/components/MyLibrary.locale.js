import React from 'react';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import SchoolIcon from '@material-ui/icons/School';
import PrintIcon from '@material-ui/icons/Print';
import AssessmentIcon from '@material-ui/icons/Assessment';
import RoomServiceIcon from '@material-ui/icons/RoomService';
import YoutubeSearchedForIcon from '@material-ui/icons/YoutubeSearchedFor';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FeedbackIcon from '@material-ui/icons/Feedback';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { pathConfig } from 'config/routes';
import {
    seeCourseResources,
    seeDocumentDelivery,
    seeFeedback,
    seeLoans,
    seeMasquerade,
    seePrintBalance,
    seePublicationMetrics,
    seeRoomBookings,
    seeSavedItems,
    seeSavedSearches,
} from 'helpers/access';

export const myLibraryLocale = {
    title: 'My library',
    items: [
        {
            dataTestid: 'borrowing',
            label: 'Borrowing',
            link: 'https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=loans&lang=en_US',
            icon: <ImportContactsIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
            condition: seeLoans,
            ariaLabel: '',
        },
        {
            dataTestid: 'course-resources',
            label: 'Course resources',
            link: pathConfig.courseresources,
            icon: <SchoolIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
            condition: seeCourseResources,
            ariaLabel: '',
        },
        {
            dataTestid: 'document-delivery',
            label: 'Document delivery',
            link: 'https://qu.relais-host.com/my/request.html?requestType=open',
            icon: <SchoolIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
            condition: seeDocumentDelivery,
            ariaLabel: '',
        },
        {
            dataTestid: 'masquerade',
            label: 'Masquerade',
            link: pathConfig.admin.masquerade,
            icon: <SupervisorAccountIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
            condition: seeMasquerade,
            ariaLabel: '',
        },
        {
            dataTestid: 'print-balance',
            label: 'Printing balance',
            link: 'https://lib-print.library.uq.edu.au:9192/user',
            icon: <PrintIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
            condition: seePrintBalance,
            ariaLabel: '',
        },
        {
            dataTestid: 'espace',
            label: 'eSpace dashboard',
            link: 'https://eSpace.library.uq.edu.au/dashboard',
            icon: <AssessmentIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
            condition: seePublicationMetrics,
            ariaLabel: '',
        },
        {
            dataTestid: 'room-bookings',
            label: 'Room bookings',
            link: 'https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb',
            icon: <RoomServiceIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
            condition: seeRoomBookings,
            ariaLabel: '',
        },
        {
            dataTestid: 'saved-items',
            label: 'Saved items',
            link: 'https://search.library.uq.edu.au/primo-explore/favorites?vid=61UQ&lang=en_US&section=items',
            icon: <FavoriteIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
            condition: seeSavedItems,
            ariaLabel: '',
        },
        {
            dataTestid: 'saved-searches',
            label: 'Saved searches',
            link:
                'https://search.library.uq.edu.au/primo-explore/login?vid=61UQ&targetURL=https%3A%2F%2Fsearch.library.uq.edu.au%2Fprimo-explore%2Ffavorites%3Fvid%3D61UQ%26lang%3Den_US%26section%3Dqueries',
            icon: <YoutubeSearchedForIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
            condition: seeSavedSearches,
            ariaLabel: '',
        },
        {
            dataTestid: 'feedback',
            label: 'Feedback',
            link: 'https://support.my.uq.edu.au/app/library/feedback',
            icon: <FeedbackIcon color={'secondary'} style={{ marginRight: 6, marginBottom: -6 }} />,
            condition: seeFeedback,
            ariaLabel: '',
        },
    ],
};
