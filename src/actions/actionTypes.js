export const getActionSuffix = action => action.substring(action.indexOf('@') + 1, action.length);
/* istanbul ignore next */
export const getAction = action => action.substring(0, action.indexOf('@') + 1);

// HOURS
export const LIB_HOURS_LOADING = 'LIB_HOURS_LOADING';
export const LIB_HOURS_FAILED = 'LIB_HOURS_FAILED';
export const LIB_HOURS_LOADED = 'LIB_HOURS_LOADED';

// PRINT BALANCE
export const PRINT_BALANCE_LOADING = 'PRINT_BALANCE_LOADING';
export const PRINT_BALANCE_FAILED = 'PRINT_BALANCE_FAILED';
export const PRINT_BALANCE_LOADED = 'PRINT_BALANCE_LOADED';

// COMPUTER AVAIL
export const COMP_AVAIL_LOADING = 'COMP_AVAIL_LOADING';
export const COMP_AVAIL_FAILED = 'COMP_AVAIL_FAILED';
export const COMP_AVAIL_LOADED = 'COMP_AVAIL_LOADED';

// LOANS
export const LOANS_LOADING = 'LOANS_LOADING';
export const LOANS_FAILED = 'LOANS_FAILED';
export const LOANS_LOADED = 'LOANS_LOADED';

// TRAINING EVENTS
export const TRAINING_LOADING = 'TRAINING_LOADING';
export const TRAINING_FAILED = 'TRAINING_FAILED';
export const TRAINING_LOADED = 'TRAINING_LOADED';

// PRIMO SUGGESTIONS
export const PRIMO_SUGGESTIONS_LOADING = 'PRIMO_SUGGESTIONS_LOADING';
export const PRIMO_SUGGESTIONS_FAILED = 'PRIMO_SUGGESTIONS_FAILED';
export const PRIMO_SUGGESTIONS_LOADED = 'PRIMO_SUGGESTIONS_LOADED';
export const PRIMO_SUGGESTIONS_CLEAR = 'PRIMO_SUGGESTIONS_CLEAR';

// PRIMO SUGGESTIONS
export const COURSE_RESOURCE_SUGGESTIONS_LOADING = 'COURSE_RESOURCE_SUGGESTIONS_LOADING';
export const COURSE_RESOURCE_SUGGESTIONS_FAILED = 'COURSE_RESOURCE_SUGGESTIONS_FAILED';
export const COURSE_RESOURCE_SUGGESTIONS_LOADED = 'COURSE_RESOURCE_SUGGESTIONS_LOADED';
export const COURSE_RESOURCE_SUGGESTIONS_CLEAR = 'COURSE_RESOURCE_SUGGESTIONS_CLEAR';

// Claim publication actions
export const POSSIBLY_YOUR_PUBLICATIONS_LOADING = 'POSSIBLY_YOUR_PUBLICATIONS_LOADING';
export const POSSIBLY_YOUR_PUBLICATIONS_LOADED = 'POSSIBLY_YOUR_PUBLICATIONS_LOADED';
export const POSSIBLY_YOUR_PUBLICATIONS_FAILED = 'POSSIBLY_YOUR_PUBLICATIONS_FAILED';

// Incomplete NTRO publication actions
export const INCOMPLETE_NTRO_PUBLICATIONS_LOADING = 'INCOMPLETE_NTRO_PUBLICATIONS_LOADING';
export const INCOMPLETE_NTRO_PUBLICATIONS_LOADED = 'INCOMPLETE_NTRO_PUBLICATIONS_LOADED';
export const INCOMPLETE_NTRO_PUBLICATIONS_FAILED = 'INCOMPLETE_NTRO_PUBLICATIONS_FAILED';

// export const COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING = 'COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING';
// export const COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED = 'COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED';
// export const COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED = 'COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED';

// export const HIDE_PUBLICATIONS_LOADING = 'HIDE_PUBLICATIONS_LOADING';
// export const HIDE_PUBLICATIONS_LOADED = 'HIDE_PUBLICATIONS_LOADED';
// export const HIDE_PUBLICATIONS_FAILED = 'HIDE_PUBLICATIONS_FAILED';
// export const HIDE_PUBLICATIONS_FAILED_RESET = 'HIDE_PUBLICATIONS_FAILED_RESET';

// export const PUBLICATION_TO_CLAIM_SET = 'PUBLICATION_TO_CLAIM_SET';
// export const PUBLICATION_TO_CLAIM_CLEAR = 'PUBLICATION_TO_CLAIM_CLEAR';
//
// export const PUBLICATION_TO_CLAIM_LOADING = 'PUBLICATION_TO_CLAIM_LOADING';
// export const PUBLICATION_TO_CLAIM_LOADED = 'PUBLICATION_TO_CLAIM_LOADED';
// export const PUBLICATION_TO_CLAIM_FAILED = 'PUBLICATION_TO_CLAIM_FAILED';
//
// export const CLAIM_PUBLICATION_CREATE_PROCESSING = 'CLAIM_PUBLICATION_CREATE_PROCESSING';
// export const CLAIM_PUBLICATION_CREATE_COMPLETED = 'CLAIM_PUBLICATION_CREATE_COMPLETED';
// export const CLAIM_PUBLICATION_CREATE_FAILED = 'CLAIM_PUBLICATION_CREATE_FAILED';

// Search
/**
 * Action types
 * for specific source actions will create source@SEARCH_ACTION, eg SEARCH_LOADING@wos etc
 */

export const EXPORT_PUBLICATIONS_LOADING = 'EXPORT_PUBLICATIONS_LOADING';
export const EXPORT_PUBLICATIONS_LOADED = 'EXPORT_PUBLICATIONS_LOADED';
export const EXPORT_PUBLICATIONS_FAILED = 'EXPORT_PUBLICATIONS_FAILED';

export const AUTHOR_PUBLICATIONS_LOADING = 'AUTHOR_PUBLICATIONS_LOADING';
export const AUTHOR_PUBLICATIONS_LOADED = 'AUTHOR_PUBLICATIONS_LOADED';
export const AUTHOR_PUBLICATIONS_FAILED = 'AUTHOR_PUBLICATIONS_FAILED';

export const TRENDING_PUBLICATIONS_LOADING = 'TRENDING_PUBLICATIONS_LOADING';
export const TRENDING_PUBLICATIONS_LOADED = 'TRENDING_PUBLICATIONS_LOADED';
export const TRENDING_PUBLICATIONS_FAILED = 'TRENDING_PUBLICATIONS_FAILED';

export const TOP_CITED_PUBLICATIONS_LOADING = 'TOP_CITED_PUBLICATIONS_LOADING';
export const TOP_CITED_PUBLICATIONS_LOADED = 'TOP_CITED_PUBLICATIONS_LOADED';
export const TOP_CITED_PUBLICATIONS_FAILED = 'TOP_CITED_PUBLICATIONS_FAILED';

// Accounts/authors
export const CURRENT_ACCOUNT_LOADING = 'CURRENT_ACCOUNT_LOADING';
export const CURRENT_ACCOUNT_LOADED = 'CURRENT_ACCOUNT_LOADED';
export const CURRENT_ACCOUNT_ANONYMOUS = 'CURRENT_ACCOUNT_ANONYMOUS';
export const CURRENT_ACCOUNT_SESSION_EXPIRED = 'CURRENT_ACCOUNT_SESSION_EXPIRED';
export const CURRENT_ACCOUNT_SESSION_VALID = 'CURRENT_ACCOUNT_SESSION_VALID';
export const CLEAR_CURRENT_ACCOUNT_SESSION_FLAG = 'CLEAR_CURRENT_ACCOUNT_SESSION_FLAG';

export const CURRENT_AUTHOR_LOADING = 'CURRENT_AUTHOR_LOADING';
export const CURRENT_AUTHOR_LOADED = 'CURRENT_AUTHOR_LOADED';
export const CURRENT_AUTHOR_FAILED = 'CURRENT_AUTHOR_FAILED';
export const CURRENT_AUTHOR_SAVING = 'CURRENT_AUTHOR_SAVING';
export const CURRENT_AUTHOR_SAVED = 'CURRENT_AUTHOR_SAVED';
export const CURRENT_AUTHOR_SAVE_FAILED = 'CURRENT_AUTHOR_SAVE_FAILED';
export const CURRENT_AUTHOR_SAVE_RESET = 'CURRENT_AUTHOR_SAVE_RESET';

export const SPOTLIGHTS_CURRENT_LOADING = 'SPOTLIGHTS_CURRENT_LOADING';
export const SPOTLIGHTS_CURRENT_LOADED = 'SPOTLIGHTS_CURRENT_LOADED';
export const SPOTLIGHTS_CURRENT_FAILED = 'SPOTLIGHTS_CURRENT_FAILED';
export const SPOTLIGHTS_LOADING = 'SPOTLIGHTS_LOADING';
export const SPOTLIGHTS_LOADED = 'SPOTLIGHTS_LOADED';
export const SPOTLIGHTS_FAILED = 'SPOTLIGHTS_FAILED';
export const SPOTLIGHTS_CLEAR = 'SPOTLIGHTS_CLEAR';
export const SPOTLIGHTS_DELETION_FAILED = 'SPOTLIGHTS_DELETION_FAILED';
export const SPOTLIGHTS_DELETION_SUCCESS = 'SPOTLIGHTS_DELETION_SUCCESS';

export const SPOTLIGHTS_BATCHUPDATE_UNDERWAY = 'SPOTLIGHTS_BATCHUPDATE_UNDERWAY';
export const SPOTLIGHTS_BATCHUPDATE_SUCCEEDED = 'SPOTLIGHTS_BATCHUPDATE_SUCCEEDED';
export const SPOTLIGHTS_BATCHUPDATE_FAILED = 'SPOTLIGHTS_BATCHUPDATE_FAILED';

export const SPOTLIGHT_FAILED = 'SPOTLIGHT_FAILED';
export const SPOTLIGHT_LOADING = 'SPOTLIGHT_LOADING';
export const SPOTLIGHT_LOADED = 'SPOTLIGHT_LOADED';
export const SPOTLIGHT_CREATED = 'SPOTLIGHT_CREATED';
export const SPOTLIGHT_SAVING = 'SPOTLIGHT_SAVING';
export const SPOTLIGHT_SAVED = 'SPOTLIGHT_SAVED';
export const SPOTLIGHT_DELETED = 'SPOTLIGHT_DELETED';
export const SPOTLIGHT_CLEAR = 'SPOTLIGHT_CLEAR';

export const CURRENT_AUTHOR_DETAILS_LOADING = 'CURRENT_AUTHOR_DETAILS_LOADING';
export const CURRENT_AUTHOR_DETAILS_LOADED = 'CURRENT_AUTHOR_DETAILS_LOADED';
export const CURRENT_AUTHOR_DETAILS_FAILED = 'CURRENT_AUTHOR_DETAILS_FAILED';

export const AUTHORS_LOADING = 'AUTHORS_LOADING';
export const AUTHORS_LOADED = 'AUTHORS_LOADED';
export const AUTHORS_LOAD_FAILED = 'AUTHORS_LOAD_FAILED';
export const CLEAR_AUTHORS_LIST = 'CLEAR_AUTHORS_LIST';

// Records
export const CREATE_RECORD_RESET = 'CREATE_RECORD_RESET';
export const CREATE_RECORD_SAVING = 'CREATE_RECORD_SAVING';
export const CREATE_RECORD_SUCCESS = 'CREATE_RECORD_SUCCESS';
export const CREATE_RECORD_FAILED = 'CREATE_RECORD_FAILED';

export const ADMIN_CREATE_RECORD_RESET = 'ADMIN_CREATE_RECORD_RESET';
export const ADMIN_CREATE_RECORD_SAVING = 'ADMIN_CREATE_RECORD_SAVING';
export const ADMIN_CREATE_RECORD_SUCCESS = 'ADMIN_CREATE_RECORD_SUCCESS';
export const ADMIN_CREATE_RECORD_FAILED = 'ADMIN_CREATE_RECORD_FAILED';

export const SEARCH_COLLECTION_LOADING = 'SEARCH_COLLECTION_LOADING';
export const SEARCH_COLLECTION_LOADED = 'SEARCH_COLLECTION_LOADED';
export const SEARCH_COLLECTION_FAILED = 'SEARCH_COLLECTION_FAILED';

export const CREATE_COLLECTION_SAVING = 'CREATE_COLLECTION_SAVING';
export const CREATE_COLLECTION_FAILED = 'CREATE_COLLECTION_FAILED';
export const CREATE_COLLECTION_SUCCESS = 'CREATE_COLLECTION_SUCCESS';

export const SEARCH_COMMUNITIES_LOADING = 'SEARCH_COMMUNITIES_LOADING';
export const SEARCH_COMMUNITIES_LOADED = 'SEARCH_COMMUNITIES_LOADED';
export const SEARCH_COMMUNITIES_FAILED = 'SEARCH_COMMUNITIES_FAILED';

export const CREATE_COMMUNITY_SAVING = 'CREATE_COMMUNITY_SAVING';
export const CREATE_COMMUNITY_FAILED = 'CREATE_COMMUNITY_FAILED';
export const CREATE_COMMUNITY_SUCCESS = 'CREATE_COMMUNITY_SUCCESS';

// View records
export const VIEW_RECORD_CLEAR = 'VIEW_RECORD_CLEAR';

export const VIEW_RECORD_LOADING = 'VIEW_RECORD_LOADING';
export const VIEW_RECORD_LOADED = 'VIEW_RECORD_LOADED';
export const VIEW_RECORD_LOAD_FAILED = 'VIEW_RECORD_LOAD_FAILED';
export const VIEW_RECORD_UNLOCK = 'VIEW_RECORD_UNLOCK';
export const VIEW_RECORD_DELETED = 'VIEW_RECORD_DELETED';

export const VIEW_RECORD_CULTURAL_SENSITIVITY_STATEMENT_HIDE = 'VIEW_RECORD_CULTURAL_SENSITIVITY_STATEMENT_HIDE';

// Fix records
export const FIX_RECORD_SET = 'FIX_RECORD_SET';
export const FIX_RECORD_CLEAR = 'FIX_RECORD_CLEAR';

export const FIX_RECORD_LOADING = 'FIX_RECORD_LOADING';
export const FIX_RECORD_LOADED = 'FIX_RECORD_LOADED';
export const FIX_RECORD_LOAD_FAILED = 'FIX_RECORD_LOAD_FAILED';

export const FIX_RECORD_PROCESSING = 'FIX_RECORD_PROCESSING';
export const FIX_RECORD_SUCCESS = 'FIX_RECORD_SUCCESS';
export const FIX_RECORD_UNCLAIM_SUCCESS = 'FIX_RECORD_UNCLAIM_SUCCESS';
export const FIX_RECORD_FAILED = 'FIX_RECORD_FAILED';

// Search keys
export const SEARCH_KEY_LOOKUP_LOADING = 'SEARCH_KEY_LOOKUP_LOADING';
export const SEARCH_KEY_LOOKUP_LOADED = 'SEARCH_KEY_LOOKUP_LOADED';
export const SEARCH_KEY_LOOKUP_FAILED = 'SEARCH_KEY_LOOKUP_FAILED';

// Controlled vocabularies
export const VOCABULARIES_LOADING = 'VOCABULARIES_LOADING';
export const VOCABULARIES_LOADED = 'VOCABULARIES_LOADED';
export const VOCABULARIES_LOAD_FAILED = 'VOCABULARIES_LOAD_FAILED';

// Dashboard lure
export const APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE = 'APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE';
export const APP_ALERT_SHOW = 'APP_ALERT_SHOW';
export const APP_ALERT_HIDE = 'APP_ALERT_HIDE';
export const SET_REDIRECT_PATH = 'SET_REDIRECT_PATH';
export const CLEAR_REDIRECT_PATH = 'CLEAR_REDIRECT_PATH';

// digiteam batch import - fetch list of directories for importing
export const DIRECTORY_LIST_LOADING = 'DIRECTORY_LIST_LOADING';
export const DIRECTORY_LIST_LOADED = 'DIRECTORY_LIST_LOADED';
export const DIRECTORY_LIST_FAILED = 'DIRECTORY_LIST_FAILED';

// digiteam batch import - submit import request
export const BATCH_IMPORT_REQUESTING = 'BATCH_IMPORT_REQUESTING';
export const BATCH_IMPORT_REQUESTED = 'BATCH_IMPORT_REQUESTED';
export const BATCH_IMPORT_REQUEST_FAILED = 'BATCH_IMPORT_REQUEST_FAILED';

// Security
export const SECURITY_POLICY_LOADING = 'SECURITY_POLICY_LOADING';
export const SECURITY_POLICY_LOADED = 'SECURITY_POLICY_LOADED';
export const SECURITY_POLICY_LOAD_FAILED = 'SECURITY_POLICY_LOAD_FAILED';

export const SECURITY_POLICY_SAVING = 'SECURITY_POLICY_SAVING';
export const SECURITY_POLICY_SAVED = 'SECURITY_POLICY_SAVED';
export const SECURITY_POLICY_SAVE_FAILED = 'SECURITY_POLICY_SAVE_FAILED';

// Admin edit
export const ADMIN_UPDATE_WORK_PROCESSING = 'ADMIN_UPDATE_WORK_PROCESSING';
export const ADMIN_UPDATE_WORK_SUCCESS = 'ADMIN_UPDATE_WORK_SUCCESS';
export const ADMIN_UPDATE_WORK_FAILED = 'ADMIN_UPDATE_WORK_PROCESSING';

export const COLLECTION_UPDATING = 'COLLECTION_UPDATING';
export const COLLECTION_UPDATE_SUCCESS = 'COLLECTION_UPDATE_SUCCESS';
export const COLLECTION_UPDATE_FAILED = 'COLLECTION_UPDATE_FAILED';

export const COMMUNITY_UPDATING = 'COMMUNITY_UPDATING';
export const COMMUNITY_UPDATE_SUCCESS = 'COMMUNITY_UPDATE_SUCCESS';
export const COMMUNITY_UPDATE_FAILED = 'COMMUNITY_UPDATE_FAILED';

// ISSN links
export const ISSN_SHERPA_LOADING = 'ISSN_SHERPA_LOADING';
export const ISSN_SHERPA_LOADED = 'ISSN_SHERPA_LOADED';
export const ISSN_SHERPA_LOAD_FAILED = 'ISSN_SHERPA_LOAD_FAILED';

export const ISSN_ULRICHS_LOADING = 'ISSN_ULRICHS_LOADING';
export const ISSN_ULRICHS_LOADED = 'ISSN_ULRICHS_LOADED';
export const ISSN_ULRICHS_LOAD_FAILED = 'ISSN_ULRICHS_LOAD_FAILED';

export const UNLOCK_RECORD_INPROGRESS = 'UNLOCK_RECORD_INPROGRESS';
export const UNLOCK_RECORD_SUCCESS = 'UNLOCK_RECORD_SUCCESS';
export const UNLOCK_RECORD_FAILED = 'UNLOCK_RECORD_FAILED';

// GUIDES
export const GUIDES_LOADING = 'GUIDES_LOADING';
export const GUIDES_FAILED = 'GUIDES_FAILED';
export const GUIDES_LOADED = 'GUIDES_LOADED';
export const GUIDES_CLEAR = 'GUIDES_CLEAR';

// EXAMS
export const EXAMS_LOADING = 'EXAMS_LOADING';
export const EXAMS_FAILED = 'EXAMS_FAILED';
export const EXAMS_LOADED = 'EXAMS_LOADED';
export const EXAMS_CLEAR = 'EXAMS_CLEAR';

// READING LIST
export const READING_LIST_LOADING = 'READING_LIST_LOADING';
export const READING_LIST_FAILED = 'READING_LIST_FAILED';
export const READING_LIST_LOADED = 'READING_LIST_LOADED';
export const READING_LIST_CLEAR = 'READING_LIST_CLEAR';

// SECURE COLLECTION
export const SECURE_COLLECTION_LOADING = 'SECURE_COLLECTION_LOADING';
export const SECURE_COLLECTION_FAILED = 'SECURE_COLLECTION_FAILED';
export const SECURE_COLLECTION_LOADED = 'SECURE_COLLECTION_LOADED';
export const SECURE_COLLECTION_CLEAR = 'SECURE_COLLECTION_CLEAR';

// ALERTS
export const ALERTS_LOADING = 'ALERTS_LOADING';
export const ALERTS_FAILED = 'ALERTS_FAILED';
export const ALERTS_LOADED = 'ALERTS_LOADED';
export const ALERTS_CLEAR = 'ALERTS_CLEAR';

export const ALERT_FAILED = 'ALERT_FAILED';
export const ALERT_LOADING = 'ALERT_LOADING';
export const ALERT_LOADED = 'ALERT_LOADED';
export const ALERT_SAVED = 'ALERT_SAVED';
export const ALERT_DELETED = 'ALERT_DELETED';
export const ALERT_CLEAR = 'ALERT_CLEAR';

// UPLOADING FILES TO S3 PUBLIC FILES
export const PUBLIC_FILE_UPLOADING = 'PUBLIC_FILE_UPLOADING';
export const PUBLIC_FILE_UPLOADED = 'PUBLIC_FILE_UPLOADED';
export const PUBLIC_FILE_UPLOAD_FAILED = 'PUBLIC_FILE_UPLOAD_FAILED';
export const PUBLIC_FILE_UPLOAD_CLEARED = 'PUBLIC_FILE_UPLOAD_CLEARED';
