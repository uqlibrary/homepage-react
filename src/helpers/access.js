import { default as locale } from 'modules/Index/components/locale';

/**
    Note: the mylibrary button is setup in reusable-webcomponents
    User settings also need to be created in that repo

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
 * (?) ATH
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

// everyone sees these, so could just be `true` but lets maintain the flexibility of passing the account
// (this means if an option changes from everyone to logged in, we only need to change the call internally here)
const everyoneCanSee = account => true || /* istanbul ignore next */ !!account;

const loggedinCanSee = account => !!account && !!account.id;

// define which home page panel items and mylibrary popup items each user type can see

export const seeCourseResources = account => {
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

export const seeMasquerade = account => loggedinCanSee(account) && !!account.canMasquerade;

export const seeRoomBookings = account =>
    !!account &&
    !!account.user_group &&
    [
        LIBRARY_STAFF,
        UNDERGRADUATE_GENERAL,
        UNDERGRADUATE_REMOTE,
        POSTGRAD_COURSEWORK,
        POSTGRAD_COURSEWORK_REMOTE,
        POSTGRAD_RESEARCH,
        POSTGRAD_RESEARCH_REMOTE,
        SHORT_FORM_CREDENTIAL_COURSE,
        SHORT_FORM_CREDENTIAL_COURSE_REMOTE,
    ].includes(account.user_group);

export const seeLoans = account => loggedinCanSee(account);

export const seePrintBalance = account => loggedinCanSee(account);

export const seeSavedItems = account => everyoneCanSee(account);

export const seeSavedSearches = account => everyoneCanSee(account);

export const seeDocumentDelivery = account =>
    loggedinCanSee(account) &&
    [
        UNDERGRADUATE_GENERAL,
        UNDERGRADUATE_REMOTE,
        POSTGRAD_COURSEWORK,
        POSTGRAD_COURSEWORK_REMOTE,
        POSTGRAD_RESEARCH,
        POSTGRAD_RESEARCH_REMOTE,
        EXTRAMURAL_ASSOCIATE,
        EXTRAMURAL_HOSPITAL,
        EXTRAMURAL_HONORARY,
        OTHER_STAFF,
        LIBRARY_STAFF,
        STAFF_AWAITING_AURION,
        SHORT_FORM_CREDENTIAL_COURSE,
        SHORT_FORM_CREDENTIAL_COURSE_REMOTE,
    ].includes(account.user_group);

export const seeEspace = (account, author) => loggedinCanSee(account) && !!author && !!author.aut_id;

export const seeLibraryServices = account => {
    if (!loggedinCanSee(account)) {
        return false;
    }
    // if the user has no services (should only be a brand new group we havent configured yet)
    // then dont display the panel
    const userServices = getUserServices(account);
    return !!userServices && userServices.length > 0;
};

export const isHospitalUser = account =>
    !!account && !!account.user_group && account.user_group === EXTRAMURAL_HOSPITAL;

export const seeFeedback = account => everyoneCanSee(account);

const hasSpotlightsADAccess = account => {
    return !!account && !!account.groups && account.groups.find(group => group.includes('lib_libapi_SpotlightAdmins'));
};

export const seeAlertsAdmin = account => {
    return !!account && !!hasSpotlightsADAccess(account);
};

export const isHdrStudent = account =>
    !!account &&
    account.class &&
    account.class.indexOf('IS_CURRENT') >= 0 &&
    account.class.indexOf('IS_UQ_STUDENT_PLACEMENT') >= 0;
