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

export const LEARNING_RESOURCE_SUGGESTIONS_LOADING = 'LEARNING_RESOURCE_SUGGESTIONS_LOADING';
export const LEARNING_RESOURCE_SUGGESTIONS_FAILED = 'LEARNING_RESOURCE_SUGGESTIONS_FAILED';
export const LEARNING_RESOURCE_SUGGESTIONS_LOADED = 'LEARNING_RESOURCE_SUGGESTIONS_LOADED';
export const LEARNING_RESOURCE_SUGGESTIONS_CLEAR = 'LEARNING_RESOURCE_SUGGESTIONS_CLEAR';

// Claim publication actions
export const POSSIBLY_YOUR_PUBLICATIONS_LOADING = 'POSSIBLY_YOUR_PUBLICATIONS_LOADING';
export const POSSIBLY_YOUR_PUBLICATIONS_LOADED = 'POSSIBLY_YOUR_PUBLICATIONS_LOADED';
export const POSSIBLY_YOUR_PUBLICATIONS_FAILED = 'POSSIBLY_YOUR_PUBLICATIONS_FAILED';

// Incomplete NTRO publication actions
export const INCOMPLETE_NTRO_PUBLICATIONS_LOADING = 'INCOMPLETE_NTRO_PUBLICATIONS_LOADING';
export const INCOMPLETE_NTRO_PUBLICATIONS_LOADED = 'INCOMPLETE_NTRO_PUBLICATIONS_LOADED';
export const INCOMPLETE_NTRO_PUBLICATIONS_FAILED = 'INCOMPLETE_NTRO_PUBLICATIONS_FAILED';

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

export const SPOTLIGHTS_HOMEPAGE_LOADING = 'SPOTLIGHTS_HOMEPAGE_LOADING';
export const SPOTLIGHTS_HOMEPAGE_LOADED = 'SPOTLIGHTS_HOMEPAGE_LOADED';
export const SPOTLIGHTS_HOMEPAGE_FAILED = 'SPOTLIGHTS_HOMEPAGE_FAILED';
export const SPOTLIGHTS_LOADING = 'SPOTLIGHTS_LOADING';
export const SPOTLIGHTS_LOADED = 'SPOTLIGHTS_LOADED';
export const SPOTLIGHTS_FAILED = 'SPOTLIGHTS_FAILED';
export const SPOTLIGHTS_CLEAR = 'SPOTLIGHTS_CLEAR';
export const SPOTLIGHTS_DELETION_FAILED = 'SPOTLIGHTS_DELETION_FAILED';
export const SPOTLIGHTS_DELETION_SUCCESS = 'SPOTLIGHTS_DELETION_SUCCESS';

export const SPOTLIGHT_FAILED = 'SPOTLIGHT_FAILED';
export const SPOTLIGHT_LOADING = 'SPOTLIGHT_LOADING';
export const SPOTLIGHT_LOADED = 'SPOTLIGHT_LOADED';
export const SPOTLIGHT_CREATED = 'SPOTLIGHT_CREATED';
export const SPOTLIGHT_SAVING = 'SPOTLIGHT_SAVING';
export const SPOTLIGHT_SAVED = 'SPOTLIGHT_SAVED';
export const SPOTLIGHT_DELETED = 'SPOTLIGHT_DELETED';
export const SPOTLIGHT_CLEAR = 'SPOTLIGHT_CLEAR';

// Promo Panels
export const CLEAR_PROMO_UPDATED_STATUS = 'CLEAR_PROMO_UPDATED_STATUS';
export const PROMOPANEL_UPDATE_QUEUELENGTH = 'PROMOPANEL_UPDATE_QUEUELENGTH';
// test action - to remove
export const PROMOPANEL_DECREMENT_QUEUELENGTH = 'PROMOPANEL_DECREMENT_QUEUELENGTH';
export const PROMOPANEL_LOADING = 'PROMOPANEL_LOADING';
export const PROMOPANEL_LOAD_SUCCESS = 'PROMOPANEL_LOAD_SUCCESS';
export const PROMOPANEL_LOAD_FAILED = 'PROMOPANEL_LOAD_FAILED';

export const PROMOPANEL_LIST_LOADING = 'PROMOPANEL_LIST_LOADING';
export const PROMOPANEL_LIST_LOAD_SUCCESS = 'PROMOPANEL_LIST_LOAD_SUCCESS';
export const PROMOPANEL_LIST_LOAD_FAILED = 'PROMOPANEL_LIST_LOAD_FAILED';

export const PROMOPANEL_USERLIST_LOADING = 'PROMOPANEL_USERLIST_LOADING';
export const PROMOPANEL_USERLIST_LOAD_SUCCESS = 'PROMOPANEL_USERLIST_LOAD_SUCCESS';
export const PROMOPANEL_USERLIST_LOAD_FAILED = 'PROMOPANEL_USERLIST_LOAD_FAILED';

export const PROMOPANEL_CLEAR = 'PROMOPANEL_CLEAR';
export const PROMOPANEL_CLEAR_CURRENT = 'PROMOPANEL_CLEAR_CURRENT';
export const PROMOPANEL_CREATING = 'PROMOPANEL_CREATING';
export const PROMOPANEL_CREATE_SUCCESS = 'PROMOPANEL_CREATE_SUCCESS';
export const PROMOPANEL_CREATE_FAILED = 'PROMOPANEL_CREATE_FAILED';

export const PROMOPANEL_SAVING = 'PROMOPANEL_SAVING';
export const PROMOPANEL_SAVE_SUCCESS = 'PROMOPANEL_SAVE_SUCCESS';
export const PROMOPANEL_SAVE_FAILED = 'PROMOPANEL_SAVE_FAILED';

export const PROMOPANEL_DELETING = 'PROMOPANEL_DELETING';
export const PROMOPANEL_DELETE_FAILED = 'PROMOPANEL_DELETE_FAILED';
export const PROMOPANEL_DELETE_SUCCESS = 'PROMOPANEL_DELETE_SUCCESS';

export const PROMOPANEL_SCHEDULING = 'PROMOPANEL_SCHEDULING';
export const PROMOPANEL_SCHEDULE_FAILED = 'PROMOPANEL_SCHEDULE_FAILED';
export const PROMOPANEL_SCHEDULE_SUCCESS = 'PROMOPANEL_SCHEDULE_SUCCESS';

export const PROMOPANEL_UNSCHEDULING = 'PROMOPANEL_UNSCHEDULING';
export const PROMOPANEL_UNSCHEDULE_FAILED = 'PROMOPANEL_UNSCHEDULE_FAILED';
export const PROMOPANEL_UNSCHEDULE_SUCCESS = 'PROMOPANEL_UNSCHEDULE_SUCCESS';

export const PROMOPANEL_LIST_ACTIVE_LOADING = 'PROMOPANEL_LIST_ACTIVE_LOADING';
export const PROMOPANEL_LIST_ACTIVE_SUCCESS = 'PROMOPANEL_LIST_ACTIVE_SUCCESS';
export const PROMOPANEL_LIST_ACTIVE_FAILED = 'PROMOPANEL_LIST_ACTIVE_FAILED';

// Dashboard lure
export const APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE = 'APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE';
export const APP_ALERT_SHOW = 'APP_ALERT_SHOW';
export const APP_ALERT_HIDE = 'APP_ALERT_HIDE';
export const SET_REDIRECT_PATH = 'SET_REDIRECT_PATH';
export const CLEAR_REDIRECT_PATH = 'CLEAR_REDIRECT_PATH';

// GUIDES
export const GUIDES_LOADING = 'GUIDES_LOADING';
export const GUIDES_FAILED = 'GUIDES_FAILED';
export const GUIDES_LOADED = 'GUIDES_LOADED';
export const GUIDES_CLEAR = 'GUIDES_CLEAR';

// Exams for Learning Resources Panel & Page
export const EXAMS_LEARNING_RESOURCES_LOADING = 'EXAMS_LEARNING_RESOURCES_LOADING';
export const EXAMS_LEARNING_RESOURCES_FAILED = 'EXAMS_LEARNING_RESOURCES_FAILED';
export const EXAMS_LEARNING_RESOURCES_LOADED = 'EXAMS_LEARNING_RESOURCES_LOADED';
export const EXAMS_LEARNING_RESOURCES_CLEAR = 'EXAMS_LEARNING_RESOURCES_CLEAR';

// READING LIST
export const READING_LIST_LOADING = 'READING_LIST_LOADING';
export const READING_LIST_FAILED = 'READING_LIST_FAILED';
export const READING_LIST_LOADED = 'READING_LIST_LOADED';
export const READING_LIST_CLEAR = 'READING_LIST_CLEAR';

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

// Exam Suggestions
export const EXAM_SUGGESTIONS_LOADING = 'EXAM_SUGGESTIONS_LOADING';
export const EXAM_SUGGESTIONS_FAILED = 'EXAM_SUGGESTIONS_FAILED';
export const EXAM_SUGGESTIONS_LOADED = 'EXAM_SUGGESTIONS_LOADED';
export const EXAM_SUGGESTIONS_CLEAR = 'EXAM_SUGGESTIONS_CLEAR';

// Exam Results
export const EXAM_SEARCH_LOADING = 'EXAM_SEARCH_LOADING';
export const EXAM_SEARCH_FAILED = 'EXAM_SEARCH_FAILED';
export const EXAM_SEARCH_LOADED = 'EXAM_SEARCH_LOADED';
export const EXAM_SEARCH_CLEAR = 'EXAM_SEARCH_CLEAR';

// TEST AND TAG

// user
export const TESTTAG_USER_LOADING = 'TESTTAG_USER_LOADING';
export const TESTTAG_USER_LOADED = 'TESTTAG_USER_LOADED';
export const TESTTAG_USER_FAILED = 'TESTTAG_USER_FAILED';

// Dashboard onload
export const TESTTAG_DASHBOARD_CONFIG_LOADING = 'TESTTAG_DASHBOARD_CONFIG_LOADING';
export const TESTTAG_DASHBOARD_CONFIG_LOADED = 'TESTTAG_DASHBOARD_CONFIG_LOADED';
export const TESTTAG_DASHBOARD_CONFIG_FAILED = 'TESTTAG_DASHBOARD_CONFIG_FAILED';

// INSPECTION Initial config lists (sites, asset types, testing devices)
export const TESTTAG_INSPECTION_CONFIG_LOADING = 'TESTTAG_INSPECTION_CONFIG_LOADING';
export const TESTTAG_INSPECTION_CONFIG_LOADED = 'TESTTAG_INSPECTION_CONFIG_LOADED';
export const TESTTAG_INSPECTION_CONFIG_FAILED = 'TESTTAG_INSPECTION_CONFIG_FAILED';
export const TESTTAG_INSPECTION_CONFIG_CLEAR = 'TESTTAG_INSPECTION_CONFIG_CLEAR';

// Locations
export const TESTTAG_LOCATION_ADDING = 'TESTTAG_LOCATION_ADDING';
export const TESTTAG_LOCATION_ADDED = 'TESTTAG_LOCATION_ADDED';
export const TESTTAG_LOCATION_ADD_FAILED = 'TESTTAG_LOCATION_ADD_FAILED';
export const TESTTAG_LOCATION_UPDATING = 'TESTTAG_LOCATION_UPDATING';
export const TESTTAG_LOCATION_UPDATED = 'TESTTAG_LOCATION_UPDATED';
export const TESTTAG_LOCATION_UPDATE_FAILED = 'TESTTAG_LOCATION_UPDATE_FAILED';
export const TESTTAG_LOCATION_DELETING = 'TESTTAG_LOCATION_DELETING';
export const TESTTAG_LOCATION_DELETED = 'TESTTAG_LOCATION_DELETED';
export const TESTTAG_LOCATION_DELETE_FAILED = 'TESTTAG_LOCATION_DELETE_FAILED';

// Sites
export const TESTTAG_SITE_LIST_LOADING = 'TESTTAG_SITE_LIST_LOADING';
export const TESTTAG_SITE_LIST_LOADED = 'TESTTAG_SITE_LIST_LOADED';
export const TESTTAG_SITE_LIST_FAILED = 'TESTTAG_SITE_LIST_FAILED';
export const TESTTAG_SITE_LIST_CLEAR = 'TESTTAG_SITE_LIST_CLEAR';

// Buildings
export const TESTTAG_BUILDING_LIST_LOADING = 'TESTTAG_BUILDING_LIST_LOADING';
export const TESTTAG_BUILDING_LIST_LOADED = 'TESTTAG_BUILDING_LIST_LOADED';
export const TESTTAG_BUILDING_LIST_FAILED = 'TESTTAG_BUILDING_LIST_FAILED';
export const TESTTAG_BUILDING_LIST_CLEAR = 'TESTTAG_BUILDING_LIST_CLEAR';
// Floors
export const TESTTAG_FLOOR_LIST_LOADING = 'TESTTAG_FLOOR_LIST_LOADING';
export const TESTTAG_FLOOR_LIST_LOADED = 'TESTTAG_FLOOR_LIST_LOADED';
export const TESTTAG_FLOOR_LIST_FAILED = 'TESTTAG_FLOOR_LIST_FAILED';
export const TESTTAG_FLOOR_LIST_CLEAR = 'TESTTAG_FLOOR_LIST_CLEAR';
// Rooms
export const TESTTAG_ROOM_LIST_LOADING = 'TESTTAG_ROOM_LIST_LOADING';
export const TESTTAG_ROOM_LIST_LOADED = 'TESTTAG_ROOM_LIST_LOADED';
export const TESTTAG_ROOM_LIST_FAILED = 'TESTTAG_ROOM_LIST_FAILED';
export const TESTTAG_ROOM_LIST_CLEAR = 'TESTTAG_ROOM_LIST_CLEAR';

// Assets
export const TESTTAG_ASSETS_LOADING = 'TESTTAG_ASSETS_LOADING';
export const TESTTAG_ASSETS_LOADED = 'TESTTAG_ASSETS_LOADED';
export const TESTTAG_ASSETS_FAILED = 'TESTTAG_ASSETS_FAILED';
export const TESTTAG_ASSETS_CLEAR = 'TESTTAG_ASSETS_CLEAR';
export const TESTTAG_ASSETS_MINE_LOADING = 'TESTTAG_ASSETS_MINE_LOADING';
export const TESTTAG_ASSETS_MINE_LOADED = 'TESTTAG_ASSETS_MINE_LOADED';
export const TESTTAG_ASSETS_MINE_FAILED = 'TESTTAG_ASSETS_MINE_FAILED';
export const TESTTAG_ASSETS_MINE_CLEAR = 'TESTTAG_ASSETS_MINE_CLEAR';

// Save inspection
export const TESTTAG_SAVE_INSPECTION_SAVING = 'TESTTAG_SAVE_INSPECTION_SAVING';
export const TESTTAG_SAVE_INSPECTION_SUCCESS = 'TESTTAG_SAVE_INSPECTION_SUCCESS';
export const TESTTAG_SAVE_INSPECTION_FAILED = 'TESTTAG_SAVE_INSPECTION_FAILED';
export const TESTTAG_SAVE_INSPECTION_CLEAR = 'TESTTAG_SAVE_INSPECTION_CLEAR';

// Save asset type
export const TESTTAG_SAVE_ASSET_TYPE_SAVING = 'TESTTAG_SAVE_ASSET_TYPE_SAVING';
export const TESTTAG_SAVE_ASSET_TYPE_SUCCESS = 'TESTTAG_SAVE_ASSET_TYPE_SUCCESS';
export const TESTTAG_SAVE_ASSET_TYPE_FAILED = 'TESTTAG_SAVE_ASSET_TYPE_FAILED';
export const TESTTAG_SAVE_ASSET_TYPE_CLEAR = 'TESTTAG_SAVE_ASSET_TYPE_CLEAR';

// Inspection Device management
export const TESTTAG_INSPECTION_DEVICES_LOADING = 'TESTTAG_INSPECTION_DEVICES_LOADING';
export const TESTTAG_INSPECTION_DEVICES_LOADED = 'TESTTAG_INSPECTION_DEVICES_LOADED';
export const TESTTAG_INSPECTION_DEVICES_FAILED = 'TESTTAG_INSPECTION_DEVICES_FAILED';
export const TESTTAG_INSPECTION_DEVICES_CLEAR = 'TESTTAG_INSPECTION_DEVICES_CLEAR';
export const TESTTAG_INSPECTION_DEVICES_ADDING = 'TESTTAG_INSPECTION_DEVICES_ADDING';
export const TESTTAG_INSPECTION_DEVICES_ADDED = 'TESTTAG_INSPECTION_DEVICES_ADDED';
export const TESTTAG_INSPECTION_DEVICES_ADD_FAILED = 'TESTTAG_INSPECTION_DEVICES_ADD_FAILED';
export const TESTTAG_INSPECTION_DEVICES_UPDATING = 'TESTTAG_INSPECTION_DEVICES_UPDATING';
export const TESTTAG_INSPECTION_DEVICES_UPDATED = 'TESTTAG_INSPECTION_DEVICES_UPDATED';
export const TESTTAG_INSPECTION_DEVICES_UPDATE_FAILED = 'TESTTAG_INSPECTION_DEVICES_UPDATE_FAILED';
export const TESTTAG_INSPECTION_DEVICES_DELETING = 'TESTTAG_INSPECTION_DEVICES_DELETING';
export const TESTTAG_INSPECTION_DEVICES_DELETED = 'TESTTAG_INSPECTION_DEVICES_DELETED';
export const TESTTAG_INSPECTION_DEVICES_DELETE_FAILED = 'TESTTAG_INSPECTION_DEVICES_DELETE_FAILED';

// List Asset Types
export const TESTTAG_ASSET_TYPES_LIST_LOADING = 'TESTTAG_ASSET_TYPES_LIST_LOADING';
export const TESTTAG_ASSET_TYPES_LIST_LOADED = 'TESTTAG_ASSET_TYPES_LIST_LOADED';
export const TESTTAG_ASSET_TYPES_LIST_FAILED = 'TESTTAG_ASSET_TYPES_LIST_FAILED';

// Create / Add asset type
export const TESTTAG_ASSET_TYPES_ADDING = 'TESTTAG_ASSET_TYPES_ADDING';
export const TESTTAG_ASSET_TYPES_ADDED = 'TESTTAG_ASSET_TYPES_ADDED';
export const TESTTAG_ASSET_TYPES_ADD_FAILED = 'TESTTAG_ASSET_TYPES_ADD_FAILED';

// Save Asset Types
export const TESTTAG_ASSET_TYPES_SAVING = 'TESTTAG_ASSET_TYPES_SAVING';
export const TESTTAG_ASSET_TYPES_SAVED = 'TESTTAG_ASSET_TYPES_SAVED';
export const TESTTAG_ASSET_TYPES_SAVE_FAILED = 'TESTTAG_ASSET_TYPES_SAVE_FAILED';

// Delete Asset Types
export const TESTTAG_ASSET_TYPES_DELETING = 'TESTTAG_ASSET_TYPES_DELETING';
export const TESTTAG_ASSET_TYPES_DELETED = 'TESTTAG_ASSET_TYPES_DELETED';
export const TESTTAG_ASSET_TYPES_DELETE_FAILED = 'TESTTAG_ASSET_TYPES_DELETE_FAILED';

// Delete and Reassign Asset Types
export const TESTTAG_ASSET_TYPES_REASSIGNING = 'TESTTAG_ASSET_TYPES_REASSIGNING';
export const TESTTAG_ASSET_TYPES_REASSIGNED = 'TESTTAG_ASSET_TYPES_REASSIGNED';
export const TESTTAG_ASSET_TYPES_REASSIGN_FAILED = 'TESTTAG_ASSET_TYPES_REASSIGN_FAILED';

// Inspections due
export const TESTTAG_INSPECTIONS_DUE_LOADING = 'TESTTAG_INSPECTIONS_DUE_LOADING';
export const TESTTAG_INSPECTIONS_DUE_LOADED = 'TESTTAG_INSPECTIONS_DUE_LOADED';
export const TESTTAG_INSPECTIONS_DUE_FAILED = 'TESTTAG_INSPECTIONS_DUE_FAILED';
export const TESTTAG_INSPECTIONS_DUE_CLEAR = 'TESTTAG_INSPECTIONS_DUE_CLEAR';

// Inspections by licenced user
export const TESTTAG_INSPECTIONS_BY_LICENCED_USER_LOADING = 'TESTTAG_INSPECTIONS_BY_LICENCED_USER_LOADINGG';
export const TESTTAG_INSPECTIONS_BY_LICENCED_USER_LOADED = 'TESTTAG_INSPECTIONS_BY_LICENCED_USER_LOADED';
export const TESTTAG_INSPECTIONS_BY_LICENCED_USER_FAILED = 'TESTTAG_INSPECTIONS_BY_LICENCED_USER_FAILED';
export const TESTTAG_LICENCED_INSPECTORS_LOADING = 'TESTTAG_LICENCED_INSPECTORS_LOADING';
export const TESTTAG_LICENCED_INSPECTORS_LOADED = 'TESTTAG_LICENCED_INSPECTORS_LOADED';
export const TESTTAG_LICENCED_INSPECTORS_FAILED = 'TESTTAG_LICENCED_INSPECTORS_FAILED';

// Bulk asset update
export const TESTTAG_BULK_ASSET_UPDATE_SAVING = 'TESTTAG_BULK_ASSET_UPDATE_SAVING';
export const TESTTAG_BULK_ASSET_UPDATE_SUCCESS = 'TESTTAG_BULK_ASSET_UPDATE_SUCCESS';
export const TESTTAG_BULK_ASSET_UPDATE_FAILED = 'TESTTAG_BULK_ASSET_UPDATE_FAILED';
export const TESTTAG_BULK_ASSET_UPDATE_CLEAR = 'TESTTAG_BULK_ASSET_UPDATE_CLEAR';
