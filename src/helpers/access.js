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
// const UNDERGRADUATE_TESOL = 'ICTE';
// const UNDERGRADUATE_VOCATIONAL = 'VET';
const SHORT_FORM_CREDENTIAL_COURSE = 'SFC';
const SHORT_FORM_CREDENTIAL_COURSE_REMOTE = 'REMSFC';

const POSTGRAD_COURSEWORK = 'CWPG';
const POSTGRAD_COURSEWORK_REMOTE = 'REMCWPG';
// const POSTGRAD_RESEARCH_REMOTE = 'REMRHD';
// const POSTGRAD_RESEARCH = 'RHD';

const LIBRARY_STAFF = 'LIBRARYSTAFFB';
const OTHER_STAFF = 'STAFF';
// const STAFF_AWAITING_AURION = 'AURION';

// const EXTRAMURAL_COMMUNITY_PAID = 'COMMU';
// const EXTRAMURAL_ALUMNI = 'ALUMNI';
const EXTRAMURAL_HOSPITAL = 'HOSP';
// const EXTRAMURAL_ASSOCIATE = 'ASSOCIATE';
// const EXTRAMURAL_FRYER = 'FRYVISITOR';
const EXTRAMURAL_HONORARY = 'HON';
// const EXTRAMURAL_PROXY = 'PROXY';

export const TRAINING_FILTER_GENERAL = 104;
export const TRAINING_FILTER_HOSPITAL = 360;

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

const userHasAdGroup = (ADGroupName, account) =>
    !!account && !!account.groups && !!account.groups.find(group => group.includes(ADGroupName));

export const isTestTagAdminUser = account =>
    isLoggedInUser(account) && userHasAdGroup('lib_libapi_TestTagUsers', account);

export const isAlertsAdminUser = account =>
    isLoggedInUser(account) && userHasAdGroup('lib_libapi_SpotlightAdmins', account);

export const isDlorAdminUser = account => isLoggedInUser(account) && userHasAdGroup('lib_dlor_admins', account);

export const isHospitalUser = account =>
    isLoggedInUser(account) && !!account.user_group && account.user_group === EXTRAMURAL_HOSPITAL;

export const isHdrStudent = account =>
    isLoggedInUser(account) &&
    account.class &&
    account.class.indexOf('IS_CURRENT') >= 0 &&
    account.class.indexOf('IS_UQ_STUDENT_PLACEMENT') >= 0;

export const isEspaceAuthor = (account, author) => isLoggedInUser(account) && !!author && !!author.aut_id;
