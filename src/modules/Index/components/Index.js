/* eslint max-len: 0 */
import React, { useEffect } from 'react';
import ContentLoader from 'react-content-loader';
import { lazy } from 'react';
import { PropTypes } from 'prop-types';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { greeting, isEscapeKeyPressed, lazyRetry } from 'helpers/general';

import LibraryUpdates from 'modules/Index/components/subComponents/LibraryUpdates';
import NavigationCardWrapper from './subComponents/NavigationCardWrapper';
import {
    loadPrintBalance,
    searcheSpacePossiblePublications,
    searcheSpaceIncompleteNTROPublications,
    loadLibHours,
    loadCompAvail,
    loadTrainingEvents,
    loadDrupalArticles,
    loadJournalSearchFavourites,
    loadLoans,
} from 'data/actions';
import { canSeeLearningResources, isEspaceAuthor } from 'helpers/access';

const EspaceLinks = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/EspaceLinks')));
const Locations = lazy(() => lazyRetry(() => import('./subComponents/Locations')));
const LearningResourcesPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/LearningResourcesPanel')));
// const PastExamPapers = lazy(() => lazyRetry(() => import('./subComponents/PastExamPapersPanel')));
const Training = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Training')));
const ReferencingPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/ReferencingPanel')));
const ReadPublish = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/ReadPublish')));
const CataloguePanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/CataloguePanel')));

const StyledPortalContainer = styled('div')(() => ({
    paddingTop: 48,
    paddingBottom: 48,
    backgroundColor: '#51247a',
    '@media (max-width: 640px)': {
        paddingBottom: 24,
        paddingTop: 24,
    },
}));

const StyledH1 = styled('h1')(({ theme }) => ({
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 16,
    fontSize: '40px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '120%',
    letterSpacing: '0.4px',
    backgroundColor: theme.palette.primary.light,
    color: '#fff',
    fontFamily: 'Montserrat, Helvetica, Arial, sans-serif',
    '@media (max-width: 640px)': {
       paddingBottom: 24,
    },
}));

const StyledBookingLink = styled(Link)(({ theme }) => ({
    color: 'black',
    fontWeight: 400,
    textDecorationColor: theme.palette.primary.light,
    '& span': {
        color: theme.palette.primary.light,
        display: 'block',
        paddingTop: '13px',
    },
}));

const StyledHeading = styled(Typography)(() => ({
    fontSize: '32px',
    fontWeight: 500,
    marginTop: '1rem',
}));

const StyledGridWrapper = styled('div')(() => ({
    marginLeft: '-32px',
    marginRight: '-32px',
    paddingRight: '32px',
    backgroundColor: '#f3f3f4',
    '@media (max-width: 1200px)': {
        marginLeft: '-24px',
    },
}));

const StyledLocationBox = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    border: '1px solid #DCDCDD',
    borderRadius: '0 0 4px 4px',
    boxShadow: '0px 12px 24px 0px rgba(25, 21, 28, 0.05)',
    marginTop: '2px',
    minWidth: '66%',
    zIndex: 999,
    position: 'absolute',
    top: 50,
    left: 0,
    [theme.breakpoints.down('uqDsDesktop')]: {
        minWidth: '80%',
    },
    [theme.breakpoints.down('uqDsTablet')]: {
        minWidth: '95%',
        left: 5,
    },
}));

const StyledButtonWrapperDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row-reverse',

    '& button': {
        color: theme.palette.primary.light,
        fontSize: '16px',
        marginTop: '6px',
        textDecoration: 'underline',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
            '-webkit-text-decoration': 'none',
        },
    },
    '& a': {
        fontSize: '16px',
        height: '40px',
        paddingBlock: '6px',
        marginLeft: '32px',
    },
}));

const StyledGridItemLoggedIn = styled(Grid)(({ theme }) => ({
    paddingLeft: '24px',
    marginBottom: '24px',
    // [theme.breakpoints.down('uqDsDesktop')]: {
    //     paddingRight: '24px',
    // },
    [theme.breakpoints.up('uqDsDesktopXL')]: {
        paddingLeft: '32px',
        marginBottom: '32px',
    },
}));

export const Index = ({
    account,
    accountLoading,
    author,
    libHours,
    libHoursLoading,
    libHoursError,
    // computerAvailability,
    // computerAvailabilityLoading,
    // computerAvailabilityError,
    trainingEvents,
    trainingEventsLoading,
    trainingEventsError,
    printBalance,
    printBalanceLoading,
    possibleRecords,
    possibleRecordsLoading,
    incompleteNTRO,
    incompleteNTROLoading,
    drupalArticleList,
    drupalArticlesError,
    journalSearchList,
    journalSearchLoading,
    journalSearchError,
    loans,
    loansLoading,

}) => {
    const dispatch = useDispatch();

    // handle the location opener
    const [locationOpen, setLocationOpen] = React.useState(false);
    const locationsRef = React.useRef(null);
    const closeOnClickOutsideDialog = (e) => {
        if (locationsRef.current && !locationsRef.current.contains(e.target)) {
            setLocationOpen(false);
        }
    };
    const closeOnEscape = (e) => {
        if (isEscapeKeyPressed(e)) {
            setLocationOpen(false);
        }
    };
    const handleLocationOpenerClick = () => {
        const showLocation = setInterval(() => {
            setLocationOpen(!locationOpen);

            const locationButton = document.getElementById('location-dialog-controller');
            !!locationButton && (locationButton.ariaExpanded = !locationOpen);

            if (!locationOpen) {
                document.addEventListener('mousedown', closeOnClickOutsideDialog);
                document.addEventListener('keydown', closeOnEscape);
            } else {
                document.removeEventListener('mousedown', closeOnClickOutsideDialog);
                document.removeEventListener('keydown', closeOnEscape);
            }

            clearInterval(showLocation);
        }, 10);
        return () => {
            document.removeEventListener('mousedown', closeOnClickOutsideDialog);
            document.removeEventListener('keydown', closeOnEscape);
        };
    };
    const isLocationOpen = Boolean(locationOpen);

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.removeAttribute('secondleveltitle');
        !!siteHeader && siteHeader.removeAttribute('secondLevelUrl');
    }, []);

    // drupal article stuff here.

    useEffect(() => {
        if (!drupalArticleList || drupalArticleList?.length < 1) {
            dispatch(loadDrupalArticles());
        }
    }, [drupalArticleList, dispatch]);

    // Journal Search favourites here
    useEffect(() => {
        if (accountLoading === false && !!account) {
            dispatch(loadJournalSearchFavourites());
        }
    }, [accountLoading, account, dispatch]);

    // useEffect(() => {
    //     if (accountLoading === false) {
    //         dispatch(loadLibHours());
    //         // dispatch(loadCompAvail());
    //     }
    // }, [accountLoading, dispatch]);

    useEffect(() => {
        if (accountLoading === false) {
            dispatch(loadTrainingEvents(account));
        }
    }, [account, accountLoading, dispatch]);
    useEffect(() => {
        if (accountLoading === false && !!account && !printBalance && printBalanceLoading === null) {
            dispatch(loadPrintBalance());
        }
    }, [accountLoading, account, printBalance, printBalanceLoading, dispatch]);
    useEffect(() => {
        if (
            accountLoading === false &&
            !!account &&
            !!author &&
            !!author.aut_id &&
            !possibleRecords &&
            possibleRecordsLoading === null
        ) {
            dispatch(searcheSpacePossiblePublications());
        }
    }, [accountLoading, account, author, possibleRecords, possibleRecordsLoading, dispatch]);
    useEffect(() => {
        if (
            accountLoading === false &&
            !!account &&
            !!author &&
            !!author.aut_id &&
            !incompleteNTRO &&
            incompleteNTROLoading === null
        ) {
            dispatch(searcheSpaceIncompleteNTROPublications());
        }
    }, [accountLoading, account, author, incompleteNTRO, incompleteNTROLoading, dispatch]);

    useEffect(() => {
        if (accountLoading === false && !!account && !loans && loansLoading === null) {
            console.log('dispatching');
            dispatch(loadLoans());
        }
    }, [accountLoading, account, loans, loansLoading, dispatch]);

    const hourslist = [];
    hourslist.push({ 'lid': 3823, 'name': 'Architecture and Music', 'category': 'library', 'desc': '', 'url': 'https://web.library.uq.edu.au/locations-hours/architecture-music-library', 'contact': '', 'lat': '', 'long': '', 'color': '#1C6DBD', 'fn': '', 'day': 'Tuesday', 'times': { 'status': 'not-set' }, 'rendered': '', 'abbr': 'Arch Music', 'departments': [{ 'lid': 10451, 'name': 'Collections & space', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3823, 'day': 'Tuesday', 'times': { 'status': 'open', 'hours': [{ 'from': '7:30am', 'to': '7:30pm' }], 'currently_open': true }, 'rendered': '7:30am - 7:30pm', 'open': '07:30:00', 'close': '19:30:00' }, { 'lid': 10779, 'name': 'AskUs desk', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3823, 'day': 'Tuesday', 'times': { 'status': 'text', 'text': '8am–7:30pm Virtual Service', 'currently_open': false }, 'rendered': '8am–7:30pm Virtual Service' }] });
    hourslist.push({ 'lid': 4986, 'name': 'AskUs chat & phone assistance', 'category': 'library', 'desc': '', 'url': 'https://web.library.uq.edu.au/contact-us', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'fn': '', 'day': 'Tuesday', 'times': { 'status': 'not-set' }, 'rendered': '', 'abbr': 'AskUs', 'departments': [{ 'lid': 4987, 'name': 'Chat', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 4986, 'day': 'Tuesday', 'times': { 'status': 'open', 'hours': [{ 'from': '8am', 'to': '8pm' }], 'currently_open': true }, 'rendered': '8am - 8pm', 'open': '08:00:00', 'close': '20:00:00' }, { 'lid': 10490, 'name': 'Phone', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 4986, 'day': 'Tuesday', 'times': { 'status': 'open', 'hours': [{ 'from': '8am', 'to': '8pm' }], 'currently_open': true }, 'rendered': '8am - 8pm', 'open': '08:00:00', 'close': '20:00:00' }] });
    hourslist.push({ 'lid': 3824, 'name': 'Biological Sciences', 'category': 'library', 'desc': '', 'url': 'https://web.library.uq.edu.au/locations-hours/biological-sciences-library', 'contact': '', 'lat': '', 'long': '', 'color': '#0E6E0E', 'fn': 'UQ ID card access after hours. Touch your card to the reader for entry.', 'day': 'Tuesday', 'times': { 'status': 'not-set' }, 'rendered': '', 'abbr': 'Biol Sci', 'departments': [{ 'lid': 3829, 'name': 'Study space', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3824, 'day': 'Tuesday', 'times': { 'status': '24hours', 'currently_open': true }, 'rendered': '24 Hours', 'open': '00:00:00', 'close': '24:00:00' }, { 'lid': 10792, 'name': 'AskUs desk', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3824, 'day': 'Tuesday', 'times': { 'status': 'text', 'text': '8am–8pm Virtual Service', 'currently_open': false }, 'rendered': '8am–8pm Virtual Service' }] });
    hourslist.push({ 'lid': 3842, 'name': 'Central', 'category': 'library', 'desc': '', 'url': 'https://web.library.uq.edu.au/locations-hours/central-library', 'contact': '', 'lat': '', 'long': '', 'color': '#0E6E0E', 'fn': 'UQ ID card access to the building after hours. Touch your card to the reader for entry.', 'day': 'Tuesday', 'times': { 'status': 'not-set' }, 'rendered': '', 'abbr': 'Central', 'departments': [{ 'lid': 10457, 'name': 'Collections & space', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3842, 'day': 'Tuesday', 'times': { 'status': '24hours', 'currently_open': true }, 'rendered': '24 Hours', 'open': '00:00:00', 'close': '24:00:00' }, { 'lid': 3843, 'name': 'AskUs desk', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3842, 'day': 'Tuesday', 'times': { 'status': 'open', 'hours': [{ 'from': '8am', 'to': '6pm' }], 'currently_open': true }, 'rendered': '8am - 6pm', 'open': '08:00:00', 'close': '18:00:00' }] });
    hourslist.push({ 'lid': 3825, 'name': 'Dorothy Hill Engineering and Sciences', 'category': 'library', 'desc': '', 'url': 'https://web.library.uq.edu.au/locations-hours/dorothy-hill-engineering-and-sciences-library', 'contact': '', 'lat': '', 'long': '', 'color': '#1C6DBD', 'fn': '', 'day': 'Tuesday', 'times': { 'status': 'not-set' }, 'rendered': '', 'abbr': 'DHEngSci', 'departments': [{ 'lid': 10458, 'name': 'Study space', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3825, 'day': 'Tuesday', 'times': { 'status': '24hours', 'currently_open': true }, 'rendered': '24 Hours', 'open': '00:00:00', 'close': '24:00:00' }, { 'lid': 9419, 'name': 'High Use collection', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3825, 'day': 'Tuesday', 'times': { 'status': '24hours', 'currently_open': true }, 'rendered': '24 Hours', 'open': '00:00:00', 'close': '24:00:00' }, { 'lid': 3826, 'name': 'AskUs desk', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3825, 'day': 'Tuesday', 'times': { 'status': 'open', 'hours': [{ 'from': '9am', 'to': '5pm' }], 'currently_open': true }, 'rendered': '9am - 5pm', 'open': '09:00:00', 'close': '17:00:00' }] });
    hourslist.push({ 'lid': 3830, 'name': 'Duhig Tower', 'category': 'library', 'desc': '', 'url': 'https://web.library.uq.edu.au/locations-hours/duhig-tower', 'contact': '', 'lat': '', 'long': '', 'color': '#0E6E0E', 'fn': '', 'day': 'Tuesday', 'times': { 'status': 'not-set' }, 'rendered': '', 'abbr': 'Duhig Study', 'departments': [{ 'lid': 3831, 'name': 'Study space', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3830, 'day': 'Tuesday', 'times': { 'status': '24hours', 'currently_open': true }, 'rendered': '24 Hours', 'open': '00:00:00', 'close': '24:00:00' }] });
    hourslist.push({ 'lid': 3967, 'name': 'Dutton Park Health Sciences', 'category': 'library', 'desc': '', 'url': 'https://web.library.uq.edu.au/locations-hours/dutton-park-health-sciences-library', 'contact': '', 'lat': '', 'long': '', 'color': '#1C6DBD', 'fn': 'Access to the building after hours is via the level 4 entry on Cornwall Street only.', 'day': 'Tuesday', 'times': { 'status': 'not-set' }, 'rendered': '', 'abbr': 'Dutton Park', 'departments': [{ 'lid': 3970, 'name': 'Collections & space', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3967, 'day': 'Tuesday', 'times': { 'status': 'open', 'hours': [{ 'from': '7am', 'to': '10:30am' }], 'currently_open': false }, 'rendered': '7am - 10:30am', 'open': '07:00:00', 'close': '22:30:00' }, { 'lid': 3969, 'name': 'AskUs desk', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3967, 'day': 'Tuesday', 'times': { 'status': 'open', 'hours': [{ 'from': '9am', 'to': '5pm' }], 'currently_open': true }, 'rendered': '9am - 5pm', 'open': '09:00:00', 'close': '17:00:00' }] });
    hourslist.push({ 'lid': 3832, 'name': 'Fryer', 'category': 'library', 'desc': '', 'url': 'https://web.library.uq.edu.au/locations-hours/fw-robinson-reading-room', 'contact': '', 'lat': '', 'long': '', 'color': '#1C6DBD', 'fn': 'The reading room is by appointment only.', 'day': 'Tuesday', 'times': { 'status': 'not-set' }, 'rendered': '', 'abbr': 'Fryer', 'departments': [{ 'lid': 3851, 'name': 'Service & collections', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3832, 'day': 'Tuesday', 'times': { 'status': 'ByApp', 'currently_open': true }, 'rendered': 'By Appointment' }] });
    hourslist.push({ 'lid': 3833, 'name': 'JK Murray (UQ Gatton)', 'category': 'library', 'desc': '', 'url': 'https://web.library.uq.edu.au/locations-hours/uq-gatton-library-jk-murray-library', 'contact': '', 'lat': '', 'long': '', 'color': '#0E6E0E', 'fn': 'UQ ID card access after hours. Touch your card to the reader for entry.', 'day': 'Tuesday', 'times': { 'status': 'not-set' }, 'rendered': '', 'abbr': 'Gatton', 'departments': [{ 'lid': 8867, 'name': 'Collections & space', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3833, 'day': 'Tuesday', 'times': { 'status': '24hours', 'currently_open': true }, 'rendered': '24 Hours', 'open': '00:00:00', 'close': '24:00:00' }, { 'lid': 3834, 'name': 'AskUs desk', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3833, 'day': 'Tuesday', 'times': { 'status': 'open', 'hours': [{ 'from': '9am', 'to': '5pm' }], 'currently_open': true }, 'rendered': '9am - 5pm', 'open': '09:00:00', 'close': '17:00:00' }] });
    // hourslist.push({"lid":3838,"name":"Herston Health Sciences","category":"library","desc":"<p style=\\"box-sizing: border-box; color: rgb(34, 34, 34); font-family: Roboto, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;\\">The library provides resources and services to support the teaching, learning and research needs of:</p>\\r\\n\\r\\n<ul style=\\"box-sizing: border-box; color: rgb(34, 34, 34); font-family: Roboto, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;\\">\\r\\n\\t<li style=\\"box-sizing: border-box;\\">UQ staff and students</li>\\r\\n\\t<li style=\\"box-sizing: border-box;\\">Staff of the Royal Brisbane and Women&#39;s Hospital (RBWH) and the</li>\\r\\n\\t<li style=\\"box-sizing: border-box;\\">Lady Cilento Children&#39;s Hospital</li>\\r\\n</ul>\\r\\n\\r\\n<p style=\\"box-sizing: border-box; color: rgb(34, 34, 34); font-family: Roboto, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;\\">RBWH &amp; Lady Cilento Children&#39;s Hospital&nbsp;staff see&nbsp;<a href=\\"https://web.library.uq.edu.au/library-services/services-hospital-staff\\" style=\\"box-sizing: border-box; color: rgb(35, 119, 203); text-decoration: none; background-color: transparent;\\">services for hospital staff</a>&nbsp;for more information.</p>","url":"https://web.library.uq.edu.au/locations-hours/herston-health-sciences-library","contact":"","lat":"","long":"","color":"#0E6E0E","fn":"After hours swipe card access to the 24/7 space from external corridor.","day":"Tuesday","times":{"status":"not-set"},"rendered":"","abbr":"Herston","departments":[{"lid":10726,"name":"Collections & space","category":"department","desc":"","url":"","contact":"","lat":"","long":"","color":"#000000","parent_lid":3838,"day":"Tuesday","times":{"status":"open","hours":[{"from":"8am","to":"5pm"}],"currently_open":true},"rendered":"8am - 5pm","open":"08:00:00","close":"17:00:00"},{"lid":10727,"name":"AskUs desk","category":"department","desc":"","url":"","contact":"","lat":"","long":"","color":"#000000","parent_lid":3838,"day":"Tuesday","times":{"status":"open","hours":[{"from":"8am","to":"5pm"}],"currently_open":true},"rendered":"8am - 5pm","open":"08:00:00","close":"17:00:00"},{"lid":3840,"name":"Training room","category":"department","desc":"","url":"","contact":"","lat":"","long":"","color":"#000000","parent_lid":3838,"day":"Tuesday","times":{"status":"24hours","currently_open":true},"rendered":"24 Hours","open":"00:00:00","close":"24:00:00"}]});
    hourslist.push({ 'lid': 3841, 'name': 'Walter Harrison Law', 'category': 'library', 'desc': '', 'url': 'https://web.library.uq.edu.au/locations-hours/law-library-walter-harrison-library', 'contact': '', 'lat': '', 'long': '', 'color': '#1C6DBD', 'fn': 'UQ ID card access after hours. Touch your card to the reader for entry.', 'day': 'Tuesday', 'times': { 'status': 'not-set' }, 'rendered': '', 'abbr': 'Law', 'departments': [{ 'lid': 4801, 'name': 'Collections & space', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3841, 'day': 'Tuesday', 'times': { 'status': '24hours', 'currently_open': true }, 'rendered': '24 Hours', 'open': '00:00:00', 'close': '24:00:00' }, { 'lid': 10780, 'name': 'AskUs desk', 'category': 'department', 'desc': '', 'url': '', 'contact': '', 'lat': '', 'long': '', 'color': '#000000', 'parent_lid': 3841, 'day': 'Tuesday', 'times': { 'status': 'text', 'text': '8am–8pm Virtual Service', 'currently_open': false }, 'rendered': '8am–8pm Virtual Service' }] });
    hourslist.push({ 'lid': 3966, 'name': 'Whitty building, Mater', 'category': 'library', 'desc': '', 'url': 'https://web.library.uq.edu.au/locations-hours', 'contact': '', 'lat': '', 'long': '', 'color': '#0E6E0E', 'fn': 'Access to Whitty Building is restricted to UQ Mater students on clinical placement.', 'day': 'Tuesday', 'times': { 'status': 'not-set' }, 'rendered': '', 'abbr': 'Whitty Mater' });

    const libHoursOverride = {};
    libHoursOverride.locations = hourslist;

    return (
        <React.Suspense fallback={<ContentLoader message="Loading"/>}>
            <StyledPortalContainer id="search-portal-container" data-testid="search-portal-container">
                <StandardPage>
                    <StyledH1>Library</StyledH1>
                    <search-portal theme="dark" />
                </StandardPage>
            </StyledPortalContainer>
            <div style={{ borderBottom: '1px solid hsla(203, 50%, 30%, 0.15)' }}>
                <div className="layout-card" style={{ position: 'relative' }}>
                    <StyledButtonWrapperDiv style={{ position: 'relative' }}>
                        <StyledBookingLink
                            href="https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb"
                            data-testid="homepage-hours-bookit-link"
                        >
                            <span>
                                Book a room
                            </span>
                        </StyledBookingLink>
                        <Button
                            id="location-dialog-controller"
                            data-testid="hours-accordion-open"
                            onClick={handleLocationOpenerClick}
                            aria-haspopup="true"
                            aria-expanded="false"
                            aria-controls="locations-wrapper"
                        >
                            Library locations
                            {!!locationOpen ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                        </Button>
                    </StyledButtonWrapperDiv>
                    <Fade in={!!isLocationOpen}>
                        <StyledLocationBox
                            id={'locations-wrapper'}
                            aria-labelledby="location-dialog-controller"
                            ref={locationsRef}
                            role={'dialog'}>
                            <Locations
                                libHours={libHoursOverride}
                                libHoursLoading={libHoursLoading}
                                libHoursError={false}
                                account={account}
                            />
                        </StyledLocationBox>
                    </Fade>
                </div>
            </div>
            {accountLoading === false && !!account && (
                <StandardPage>
                    <StyledGridWrapper>
                        <Grid container>
                            <Grid item uqDsMobile={12} sx={{ marginBottom: '32px', marginLeft: '24px' }}>
                                <StyledHeading component={'h2'} data-testid="homepage-user-greeting">
                                    {greeting()}, {account.firstName || /* istanbul ignore next */ ''}
                                </StyledHeading>
                            </Grid>
                            <Grid item>
                                <Grid container>
                                    <Grid item uqDsDesktop={4}>
                                        <Grid container>
                                            <StyledGridItemLoggedIn item uqDsMobile={12} data-testid="primo-panel">
                                                <CataloguePanel account={account} loans={loans} printBalance={printBalance} />
                                            </StyledGridItemLoggedIn>
                                            <StyledGridItemLoggedIn item uqDsMobile={12} data-testid="training-panel">
                                                <Training
                                                    trainingEvents={trainingEvents}
                                                    trainingEventsLoading={trainingEventsLoading}
                                                    trainingEventsError={trainingEventsError}
                                                />
                                            </StyledGridItemLoggedIn>
                                        </Grid>
                                    </Grid>
                                    <Grid item uqDsDesktop={8}>
                                        <Grid container>
                                            {canSeeLearningResources(account) && (
                                                <StyledGridItemLoggedIn item uqDsMobile={12} data-testid="learning-resources-panel">
                                                    <LearningResourcesPanel account={account} history={history}/>
                                                </StyledGridItemLoggedIn>
                                            )}

                                            <Grid item uqDsDesktop={6}>
                                                <Grid container>
                                                    <StyledGridItemLoggedIn  item uqDsMobile={12} data-testid="referencing-panel">
                                                        <ReferencingPanel account={account} />
                                                    </StyledGridItemLoggedIn>
                                                    <StyledGridItemLoggedIn  item uqDsMobile={12} data-testid="readpublish-panel">
                                                        <ReadPublish account={account} journalSearchList={journalSearchList} journalSearchError={journalSearchError} journalSearchLoading={journalSearchLoading} />
                                                    </StyledGridItemLoggedIn>
                                                </Grid>
                                            </Grid>
                                            <Grid item uqDsDesktop={6}>
                                                <Grid container>
                                                    {isEspaceAuthor(account, author) && (
                                                        <StyledGridItemLoggedIn item uqDsMobile={12} data-testid="espace-links-panel">
                                                            <EspaceLinks
                                                                author={author}
                                                                possibleRecords={possibleRecords}
                                                                incompleteNTRORecords={incompleteNTRO}
                                                            />
                                                        </StyledGridItemLoggedIn>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </StyledGridWrapper>
                </StandardPage>
            )}
            <NavigationCardWrapper account={account} accountLoading={accountLoading} />

            <LibraryUpdates drupalArticleList={drupalArticleList} drupalArticlesError={drupalArticlesError} />
        </React.Suspense>
    );
};

Index.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
    author: PropTypes.object,
    actions: PropTypes.any,
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.bool,
    computerAvailability: PropTypes.array,
    computerAvailabilityLoading: PropTypes.bool,
    computerAvailabilityError: PropTypes.bool,
    trainingEvents: PropTypes.any,
    trainingEventsLoading: PropTypes.bool,
    trainingEventsError: PropTypes.bool,
    possibleRecords: PropTypes.object,
    possibleRecordsLoading: PropTypes.bool,
    incompleteNTRO: PropTypes.object,
    incompleteNTROLoading: PropTypes.bool,
    drupalArticleList: PropTypes.array,
    drupalArticlesLoading: PropTypes.bool,
    drupalArticlesError: PropTypes.bool,
    journalSearchList: PropTypes.any,
    journalSearchLoading: PropTypes.bool,
    journalSearchError: PropTypes.bool,
    loans: PropTypes.any,
    loansLoading: PropTypes.bool,
};

export default Index;
