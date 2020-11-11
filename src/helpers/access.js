/**

 * (matching ptype in breackets at start)
 * (1) UG: undergraduate (on campus) - sample users: vanilla, s1111111
 * (31) REMUG: remote undergraduate - sample users: s3333333
 * (5) ICTE: Institute of Continuing and TESOL Education
 *       Students learning english - sample users: uqstaff, uqresearcher, uqpkopit
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
const isUndergraduateLocal = account => !!account && ['UG'].includes(account.user_group);
const isUndergraduate = account =>
    isUndergraduateLocal(account) || (!!account && ['REMUG'].includes(account.user_group));
const isUndergraduateLOTE = account => !!account && ['ICTE'].includes(account.user_group);
const isUndergraduateVET = account => !!account && ['VET'].includes(account.user_group);

const isRHDLocal = account => !!account && ['CWPG', 'RHD'].includes(account.user_group);
const isRHD = account => !!((!!account && ['REMCWPG', 'REMRHD'].includes(account.user_group)) || isRHDLocal(account));
const isResearchStudent = account =>
    !!((!!account && ['RHD', 'REMRHD'].includes(account.user_group)) || isRHDLocal(account));

const isLibraryStaff = account => !!account && ['LIBRARYSTAFFB'].includes(account.user_group);
const isStaffAurion = account => !!account && ['AURION'].includes(account.user_group);
const isNonLibraryStaff = account => !!account && ['STAFF'].includes(account.user_group);
const isStaff = account => isNonLibraryStaff(account) || isLibraryStaff(account);

const isCommunityPaid = account => !!account && ['COMMU'].includes(account.user_group);
const isCommunityAlumni = account => !!account && ['ALUMNI'].includes(account.user_group);
const isCommunityHospital = account => !!account && ['HOSP'].includes(account.user_group);
const isCommunityAssociate = account => !!account && ['ASSOCIATE'].includes(account.user_group);
const isCommunityFryer = account => !!account && ['FRYVISITOR'].includes(account.user_group);
const isCommunityHonorary = account => !!account && ['HON'].includes(account.user_group);

// to be drawn from espace
const hasPublications = false;

// define which home page panel items and mylibrary popup items each user type can see

// "ptypes": for each function from uqlibrary-api/data/applicatons.json
// UG, STAFF, 33, HON, REMUG, CWPG, REMCWPG, 17, LIBRARYSTAFFB, RHD, REMRHD
export const seeCourseResources = account => !!(isUndergraduate(account) || isRHD(account) || isLibraryStaff(account));

// UG, REMUG, CWPG, REMCWPG, RHD, REMRHD, PROXY, 17, LIBRARYSTAFFB, ASSOCIATE, 14, ALUMNI, HOSP, 13, 10, 12
// , FRYVISITOR, SCHOOL, AURION, ICTE, COMMU
export const seeComputerAvailability = account =>
    isUndergraduateLocal(account) ||
    isRHDLocal(account) ||
    isCommunityPaid(account) ||
    isCommunityAlumni(account) ||
    isCommunityHospital(account) ||
    isLibraryStaff(account);

export const seeLibraryHours = account =>
    isUndergraduate(account) ||
    isUndergraduateLOTE(account) ||
    isRHD(account) ||
    isStaff(account) ||
    isCommunityPaid(account) ||
    isCommunityAlumni(account) ||
    isCommunityHospital(account) ||
    isCommunityAssociate(account) ||
    isCommunityFryer(account);

export const seeMasquerade = account => !!account && !!account.canMasquerade;

// UG, REMUG, CWPG, REMCWPG, RHD, REMRHD, 17, LIBRARYSTAFFB
export const seeRoomBookings = account =>
    isUndergraduateLocal(account) || isRHDLocal(account) || isLibraryStaff(account);

// UG, REMUG, CWPG, REMCWPG, RHD, REMRHD, STAFF, 33, HON, PROXY, 17, LIBRARYSTAFFB, ASSOCIATE, 14, ALUMNI, HOSP
// , 13, 10, 12, FRYVISITOR, SCHOOL, AURION, ICTE, COMMU
export const seeBorrowing = account =>
    isUndergraduate(account) ||
    isUndergraduateLOTE(account) ||
    isRHD(account) ||
    isCommunityAlumni(account) ||
    isStaff(account);

export const seeLoans = account => seeBorrowing(account);

// 1, 31, 11, 21, 2, 22, 3, 33, 34, 32, 17, 18, 25, 14, 4, 9, 7, 15, 8

// UG, 31, CWPG, REMCWPG, RHD, REMRHD, STAFF, 33, HON, VET, 17, LIBRARYSTAFFB, ASSOCIATE
// , 14, ALUMNI, HOSP, 7, AURION, COMMU
export const seeHolds = account =>
    isUndergraduateLocal(account) ||
    isResearchStudent()(account) ||
    isUndergraduateVET(account) ||
    isStaff(account) ||
    isStaffAurion(account) ||
    isCommunityAssociate(account) ||
    isCommunityAlumni(account) ||
    isCommunityHospital(account) ||
    isCommunityHonorary(account) ||
    isCommunityPaid(account);

// UG, RHD, STAFF, 33, HON, CWPG, 17, LIBRARYSTAFFB, REMCWPG, REMRHD, REMUG
export const seePrintBalance = account =>
    isUndergraduateLocal(account) ||
    isUndergraduateLOTE(account) ||
    isUndergraduateVET(account) ||
    isRHDLocal(account) ||
    isCommunityPaid(account) ||
    isCommunityAlumni(account) ||
    isCommunityHospital(account) ||
    isCommunityAssociate(account) ||
    isCommunityFryer(account) ||
    isCommunityHonorary(account) ||
    isLibraryStaff(account);

export const seeSavedItems = true;
export const seeSavedSearches = true;

// UG, RHD, STAFF, 33, HON, HOSP, CWPG, AURION, 17, LIBRARYSTAFFB, REMCWPG, REMRHD, ASSOCIATE, REMUG
export const seeDocumentDelivery = account =>
    isUndergraduateLocal(account) || isRHDLocal(account) || isStaff(account) || isCommunityHospital(account);

// RHD, REMRHD, STAFF, 33, HON, 17, LIBRARYSTAFFB
export const seePublicationMetrics = account =>
    isResearchStudent(account) ||
    isStaff(account) ||
    isCommunityHonorary(account) ||
    (isUndergraduate(account) && hasPublications);

export const seeTraining = true;

export const seeLibraryServices = true;

export const seeFeedback = true;
