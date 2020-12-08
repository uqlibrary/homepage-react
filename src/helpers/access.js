import { default as locale } from 'modules/Index/components/locale';

/**

 * (matching ptype in breackets at start)
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

// define which home page panel items and mylibrary popup items each user type can see

export const seeCourseResources = account => {
    return (
        !!account &&
        [
            UNDERGRADUATE_GENERAL,
            UNDERGRADUATE_REMOTE,
            OTHER_STAFF,
            LIBRARY_STAFF,
            POSTGRAD_COURSEWORK,
            POSTGRAD_COURSEWORK_REMOTE,
            EXTRAMURAL_HONORARY,
        ].includes(account.user_group)
    );
};

// everyone sees these, so could just be `true` but lets maintain the flexibility of passing the account
// (it also makes all the panels load predictably, as they all wait on the account check)
const everyoneCanSee = account => !!account || true;

export const seeComputerAvailability = account => everyoneCanSee(account);

export const seeOpeningHours = account => everyoneCanSee(account);

export const seeMasquerade = account => !!account && !!account.canMasquerade;

export const seeRoomBookings = account =>
    !!account &&
    [
        LIBRARY_STAFF,
        UNDERGRADUATE_GENERAL,
        UNDERGRADUATE_REMOTE,
        POSTGRAD_COURSEWORK,
        POSTGRAD_COURSEWORK_REMOTE,
        POSTGRAD_RESEARCH,
        POSTGRAD_RESEARCH_REMOTE,
    ].includes(account.user_group);

export const seeLoans = account => !!account;

export const seeFines = account =>
    !!account &&
    [
        UNDERGRADUATE_GENERAL,
        UNDERGRADUATE_REMOTE,
        UNDERGRADUATE_TESOL,
        UNDERGRADUATE_VOCATIONAL,
        POSTGRAD_COURSEWORK,
        POSTGRAD_COURSEWORK_REMOTE,
        POSTGRAD_RESEARCH,
        POSTGRAD_RESEARCH_REMOTE,
        EXTRAMURAL_COMMUNITY_PAID,
        EXTRAMURAL_ALUMNI,
        EXTRAMURAL_HOSPITAL,
        EXTRAMURAL_ASSOCIATE,
        EXTRAMURAL_FRYER,
        EXTRAMURAL_PROXY,
        EXTRAMURAL_HONORARY,
    ].includes(account.user_group);

export const seePrintBalance = account => !!account;

export const seeSavedItems = account => everyoneCanSee(account);

export const seeSavedSearches = account => everyoneCanSee(account);

export const seeDocumentDelivery = account =>
    !!account &&
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
    ].includes(account.user_group);

export const seeEspace = (account, author) => !!account && !!author;

export const seeTraining = account => everyoneCanSee(account);

export const seeLibraryServices = account => !!account;

export const seePromoPanel = account => everyoneCanSee(account);

export const seeFeedback = account => everyoneCanSee(account);

export const seeLoggedOut = account => !account;

const userGroupServices = {
    [UNDERGRADUATE_GENERAL]: ['servicesforstudents', 'ithelp', 'digitalessentials'],
    [UNDERGRADUATE_REMOTE]: ['servicesforstudents', 'servicesforexternal', 'ithelp', 'digitalessentials'],
    [UNDERGRADUATE_TESOL]: ['servicesforstudents', 'ithelp', 'digitalessentials'],
    [UNDERGRADUATE_VOCATIONAL]: ['servicesforstudents', 'ithelp', 'digitalessentials'],
    [POSTGRAD_COURSEWORK]: ['servicesforstudents', 'ithelp', 'digitalessentials'],
    [POSTGRAD_COURSEWORK_REMOTE]: ['servicesforstudents', 'ithelp', 'digitalessentials', 'servicesforexternal'],
    [POSTGRAD_RESEARCH]: ['servicesforhdrs', 'ithelp'],
    [POSTGRAD_RESEARCH_REMOTE]: ['servicesforhdrs', 'ithelp', 'servicesforexternal'],

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
    [EXTRAMURAL_HOSPITAL]: ['servicesforhospital'],
    [EXTRAMURAL_ASSOCIATE]: ['servicesforcommunity'],
    [EXTRAMURAL_FRYER]: ['servicesforcommunity'],
    [EXTRAMURAL_HONORARY]: ['servicesforcommunity'],
    [EXTRAMURAL_PROXY]: ['servicesforcommunity'],
};

export const getUserServices = account => {
    const allLibraryServices = locale.LibraryServices.links || [];
    if (!!account && !!account.user_group) {
        const userGroupService = userGroupServices[account.user_group];
        return userGroupService.map(service => allLibraryServices.find(i => i.id === service));
    }
    return [];
};
