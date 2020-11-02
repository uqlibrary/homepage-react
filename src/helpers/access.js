/**
 * UG: undergraduate (on campus) - sample users: vanilla, s1111111
 * REMUG: remote undergraduate - sample users: s3333333
 * ICTE: Institute of Continuing and TESOL Education
 *       Students learning english - sample users: uqstaff, uqresearcher, uqpkopit
 * CWPG: post graduate by course work (on campus) - sample users: s2222222
 * REMCWPG:  remote post graduate by course work
 * RHD: research & higher degree (on campus) (post grad by thesis)
 * REMRHD: remote research & higher degree (used to be REMHDR)
 * LIBRARYSTAFFB: Library staff - sample users: uqmasquerade, digiteamMember
 * STAFF: UQ academic and research staff (inc. general staff) - sample users: uqstaff, uqresearcher, uqpkopit
 * COMMU: extra-mural users - Community users (annual fee) - sample users: emcommunity
 * ALUMNI: extra-mural users - former students (both first year out (free) and later (fee) - sample users: emalumni
 * HOSP: extra-mural users - hospital staff - sample users: emhospital
 * ASSOCIATE: extra-mural users - staff employed by UQ controlled entities e.g. JKTech - sample users: emassociate
 * FRYVISITOR: extra-mural users - special membership of Fryer Library - sample users: emfryer
 * HON: extra-mural users - Honorary (inc. Adjunct and Indstury Fellow)
 * VET: VET students - Vocational Education and Training
 *
 * other types:
 * ATH
 * AURION (Staff Awaiting Aurion)
 * PROXY - Academic Proxy
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

// define which home page items and mylibrary panel items each user type can see

export const seeCourseResources = account => !!(isUndergraduate(account) || isRHD(account) || isLibraryStaff(account));

export const seeComputerAvailability = account =>
    isUndergraduateLocal(account) ||
    isRHDLocal(account) ||
    isCommunityPaid(account) ||
    isCommunityAlumni(account) ||
    isCommunityHospital(account) ||
    isLibraryStaff(account);

export const seeLibraryHours = account =>
    isUndergraduateLocal(account) ||
    isUndergraduateLOTE(account) ||
    isRHDLocal(account) ||
    isStaff(account) ||
    isCommunityPaid(account) ||
    isCommunityAlumni(account) ||
    isCommunityHospital(account) ||
    isCommunityAssociate(account) ||
    isCommunityFryer(account);

export const seeMasquerade = account => !!account && !!account.canMasquerade;

export const seeRoomBookings = account =>
    isUndergraduateLocal(account) || isRHDLocal(account) || isLibraryStaff(account);

export const seeLoans = account =>
    isUndergraduateLocal(account) ||
    isUndergraduateLOTE(account) ||
    isRHDLocal(account) ||
    isCommunityAlumni(account) ||
    isStaff(account);

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

export const seeDocumentDelivery = account =>
    isUndergraduateLocal(account) || isRHDLocal(account) || isStaff(account) || isCommunityHospital(account);

export const seePublicationMetrics = account =>
    isResearchStudent(account) || isStaff(account) || (isUndergraduate(account) && hasPublications);

export const seeTraining = true;

export const seeLibraryServices = true;

export const seeFeedback = true;
