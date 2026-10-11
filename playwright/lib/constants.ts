export const baseURL = 'http://localhost:2020';
// Per-test istanbul coverage is split: each partial holds only the hit counts (s/f/b) keyed by file
// and structure hash; the invariant structure (statementMap/fnMap/branchMap) is written once per file
// to the sibling structure dir. The ReportMerger rejoins them (see collectCoverageAsync / ReportMerger).
export const istanbulReportPartialsDir = 'coverage/playwright/partials';
export const istanbulStructureDir = 'coverage/playwright-structure';
export const DLOR_ADMIN_USER = 'dloradmn';
export const DLOR_OBJECT_OWNER = 'uqstaff';
export const DLOR_NO_EDIT_USER = 's1111111';

export const COLOR_UQPURPLE = 'rgb(81, 36, 122)';
export const COLOR_GLOBAL_ALERT_RED = 'rgb(214, 41, 41)'; // #d62929, DS $error-500
export const COLOUR_UQ_WARNING_50 = 'rgb(254, 248, 232)'; // #fef8e8
export const COLOR_UQ_ERROR_50 = 'rgb(251, 234, 234)'; // #fbeaea;
