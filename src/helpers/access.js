import { default as locale } from 'modules/Index/components/locale';

/**
 Making changes? User settings need to be also created in repo reusable_webcomponents

 * (matching ptype in brackets at start, where it is an older type )
 * (1) UG: undergraduate (on campus) - sample users: vanilla, s1111111
 * (31) REMUG: remote undergraduate - sample users: s3333333
 * (5) ICTE: Institute of Continuing and TESOL Education - Students learning english
 * (11) CWPG: post graduate by course work (on campus) - sample users: s2222222
 * (21) REMCWPG:  remote post graduate by course work
 * (2) RHD: research & higher degree (on campus) (post grad by thesis)
 * (22) REMRHD: remote research & higher degree (used to be REMHDR)
 * (18) LIBRARYSTAFFB: Library staff - sample users: uqmasquerade, digiteamMember
 * (3) STAFF: UQ academic and research staff (inc. general staff) - sample users: uqstaff, uqresearcher, uqpkopit
 * (8) COMMU: extra-mural users - Community users (annual fee) - sample users: emcommunity
 * (4) ALUMNI: extra-mural users - former students (both first year out (free) and later (fee) - sample users: emalumni
 * (9) HOSP: extra-mural users - hospital staff - sample users: emhospital
 * (25) ASSOCIATE: extra-mural users - staff employed by UQ controlled entities e.g. JKTech - sample users: emassociate
 * (27) FRYVISITOR: extra-mural users - special membership of Fryer Library - sample users: emfryer
 * (34) HON: extra-mural users - Honorary (inc. Adjunct and Indstury Fellow)
 * (32) VET: VET students - Vocational Education and Training
 * SFC: Short Form Credential course students
 * REMSFC: Remote Short Form Credential course students
 *
 * other types:
 * (?) ATH - Academic Title Holder (Health)
 * (15) AURION (Staff Awaiting Aurion)
 * (32) PROXY - Academic Proxy
 */
const UNDERGRADUATE_GENERAL = 'UG';
const UNDERGRADUATE_REMOTE = 'REMUG';
const UNDERGRADUATE_TESOL = 'ICTE';
const UNDERGRADUATE_VOCATIONAL = 'VET';
const SHORT_FORM_CREDENTIAL_COURSE = 'SFC';
const SHORT_FORM_CREDENTIAL_COURSE_REMOTE = 'REMSFC';

const POSTGRAD_COURSEWORK = 'CWPG';
const POSTGRAD_COURSEWORK_REMOTE = 'REMCWPG';
const POSTGRAD_RESEARCH_REMOTE = 'REMRHD';
const POSTGRAD_RESEARCH = 'RHD';

const LIBRARY_STAFF = 'LIBRARYSTAFFB';
const OTHER_STAFF = 'STAFF';
const STAFF_AWAITING_AURION = 'AURION';

const EXTRAMURAL_COMMUNITY_PAID = 'COMMU';
const EXTRAMURAL_ALUMNI = 'ALUMNI';
const EXTRAMURAL_HOSPITAL = 'HOSP';
const EXTRAMURAL_ASSOCIATE = 'ASSOCIATE';
const EXTRAMURAL_FRYER = 'FRYVISITOR';
const EXTRAMURAL_HONORARY = 'HON';
const EXTRAMURAL_PROXY = 'PROXY';

export const TRAINING_FILTER_GENERAL = 104;
export const TRAINING_FILTER_HOSPITAL = 360;

// what is displayed in the User Services panel on the homepage, determined per group
const userGroupServices = {
    [UNDERGRADUATE_GENERAL]: ['servicesforstudents', 'ithelp', 'digitalessentials'],
    [UNDERGRADUATE_REMOTE]: ['servicesforstudents', 'servicesforexternal', 'ithelp', 'digitalessentials'],
    [UNDERGRADUATE_TESOL]: ['servicesforstudents', 'ithelp', 'digitalessentials'],
    [UNDERGRADUATE_VOCATIONAL]: ['servicesforstudents', 'ithelp', 'digitalessentials'],
    [POSTGRAD_COURSEWORK]: ['servicesforstudents', 'ithelp', 'digitalessentials'],
    [POSTGRAD_COURSEWORK_REMOTE]: ['servicesforstudents', 'ithelp', 'digitalessentials', 'servicesforexternal'],
    [POSTGRAD_RESEARCH]: ['servicesforhdrs', 'ithelp'],
    [POSTGRAD_RESEARCH_REMOTE]: ['servicesforhdrs', 'ithelp', 'servicesforexternal'],
    [SHORT_FORM_CREDENTIAL_COURSE]: ['servicesforstudents', 'ithelp', 'digitalessentials'],
    [SHORT_FORM_CREDENTIAL_COURSE_REMOTE]: ['servicesforstudents', 'ithelp', 'digitalessentials'],

    [LIBRARY_STAFF]: [
        'servicesforstudents',
        'servicesforhdrs',
        'servicesforcommunity',
        'servicesforhospital',
        'servicesforprofessional',
        'servicesforresearchers',
        'servicesforsecondary',
        'servicesforteaching',
        'servicesforalumni',
        'servicesforexternal',
    ],
    [OTHER_STAFF]: ['servicesforprofessional', 'servicesforresearchers', 'servicesforteaching'],
    [STAFF_AWAITING_AURION]: ['servicesforprofessional', 'servicesforresearchers', 'servicesforteaching'],

    [EXTRAMURAL_COMMUNITY_PAID]: ['servicesforcommunity'],
    [EXTRAMURAL_ALUMNI]: ['servicesforalumni'],
    [EXTRAMURAL_HOSPITAL]: ['servicesforhospital', 'requestliteraturesearch'],
    [EXTRAMURAL_ASSOCIATE]: ['servicesforcommunity'],
    [EXTRAMURAL_FRYER]: ['servicesforcommunity'],
    [EXTRAMURAL_HONORARY]: ['servicesforcommunity'],
    [EXTRAMURAL_PROXY]: ['servicesforcommunity'],
};

export const getUserServices = (account, serviceLocale = null) => {
    const thislocale = serviceLocale === null ? locale : serviceLocale;
    const allLibraryServices = thislocale.LibraryServices?.links || [];
    if (allLibraryServices.length === 0) {
        return [];
    }

    if (!account || !account.user_group) {
        return [];
    }

    const userGroupService = userGroupServices[account.user_group] || [];
    return userGroupService
        .map(service => allLibraryServices.find(i => (i.id || '') === service))
        .filter(i => i !== undefined);
};

const isLoggedInUser = account => !!account && !!account.id;

// define which home page panel items each user type can see

export const canSeeLearningResources = account => {
    return (
        !!account &&
        !!account.id &&
        [
            UNDERGRADUATE_GENERAL,
            UNDERGRADUATE_REMOTE,
            OTHER_STAFF,
            LIBRARY_STAFF,
            POSTGRAD_COURSEWORK,
            POSTGRAD_COURSEWORK_REMOTE,
            EXTRAMURAL_HONORARY,
            SHORT_FORM_CREDENTIAL_COURSE,
            SHORT_FORM_CREDENTIAL_COURSE_REMOTE,
        ].includes(account.user_group)
    );
};

export const canSeeLoans = account => isLoggedInUser(account);

export const canSeePrintBalance = account => isLoggedInUser(account);

export const canSeeLibraryServices = account => {
    if (!isLoggedInUser(account)) {
        return false;
    }
    const userServices = getUserServices(account);
    // if the user has no services (should only be a brand new group we havent configured yet)
    // then don't display the panel
    return !!userServices && userServices.length > 0;
};

const userHasAdGroup = (ADGroupName, account) =>
    !!account && !!account.groups && !!account.groups.find(group => group.includes(ADGroupName));

export const isSpotlightsAdminUser = account =>
    isLoggedInUser(account) && userHasAdGroup('lib_libapi_SpotlightAdmins', account);

export const isTestTagAdminUser = account =>
    isLoggedInUser(account) && userHasAdGroup('lib_libapi_TestTagUsers', account);

export const isAlertsAdminUser = account =>
    isLoggedInUser(account) && userHasAdGroup('lib_libapi_SpotlightAdmins', account);

export const isPromoPanelAdminUser = account =>
    isLoggedInUser(account) && userHasAdGroup('lib_libapi_SpotlightAdmins', account);

// TODO: use new AD group!!!!!!
export const isDlorAdminUser = account =>
    isLoggedInUser(account) && userHasAdGroup('lib_libapi_SpotlightAdmins', account);

export const isHospitalUser = account =>
    isLoggedInUser(account) && !!account.user_group && account.user_group === EXTRAMURAL_HOSPITAL;

export const isHdrStudent = account =>
    isLoggedInUser(account) &&
    account.class &&
    account.class.indexOf('IS_CURRENT') >= 0 &&
    account.class.indexOf('IS_UQ_STUDENT_PLACEMENT') >= 0;

export const isEspaceAuthor = (account, author) => isLoggedInUser(account) && !!author && !!author.aut_id;

// note: this logic is duplicated in reusable
/* istanbul ignore next */
export function getHomepageLink(hostname = null, protocol = null, port = null, pathname = null, search = null) {
    const _protocol = protocol === null ? window.location.protocol : protocol;
    const _hostname = hostname === null ? window.location.hostname : hostname;
    let homepagelink = 'https://www.library.uq.edu.au';
    if (_hostname === 'homepage-development.library.uq.edu.au') {
        const _pathname = pathname === null ? window.location.pathname : pathname;
        homepagelink = `${_protocol}//${_hostname}${_pathname}#/`;
    } else if (_hostname === 'dev-homepage.library.uq.edu.au') {
        // local dev against staging api eg http://dev-homepage.library.uq.edu.au:2020/#/digital-learning-objects with npm run start:url
        const _port = port === null ? window.location.port : port;
        homepagelink = `${_protocol}//${_hostname}:${_port}/#/`;
    } else if (_hostname.endsWith('.library.uq.edu.au')) {
        homepagelink = `${_protocol}//${_hostname}`;
    } else if (_hostname === 'localhost') {
        const _port = port === null ? window.location.port : port;
        const _search = search === null ? window.location.search : search;
        const urlParams = new URLSearchParams(_search);
        const userParam = urlParams.get('user');
        const linkParameters = !!userParam ? `?user=${userParam}` : '';
        homepagelink = `${_protocol}//${_hostname}:${_port}/${linkParameters}`;
    }
    // console.log('getHomepageLink:: homepagelink=', homepagelink);
    return homepagelink;
}
