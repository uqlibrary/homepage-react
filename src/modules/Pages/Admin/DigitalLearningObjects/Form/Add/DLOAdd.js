import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { useAccountContext } from 'context';

import DlorForm from 'modules/Pages/Admin/DigitalLearningObjects/Form/DlorForm';
import DlorAdminBreadcrumbs from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/DlorAdminBreadcrumbs';
import { isDlorAdminUser } from 'helpers/access';
import InformationBox from 'modules/Pages/DigitalLearningObjects/SharedComponents/InformationBox';
import { Typography } from '@mui/material';

const moment = require('moment-timezone');

export const DLOAdd = ({
    actions,
    dlorItemCreating,
    dlorCreatedItemError,
    dlorCreatedItem,
    dlorTeamList,
    dlorTeamListLoading,
    dlorTeamListError,
    dlorFileTypeList,
    dlorFileTypeListLoading,
    dlorFileTypeListError,
    dlorFilterList,
    dlorFilterListLoading,
    dlorFilterListError,
    dlorAdminNotesLoading,
    dlorAdminNotesLoaded,
    dlorAdminNotesLoadError,
    dlorAdminNotes,
}) => {
    const { account } = useAccountContext();
    console.log('ACCOUNT', account);

    // function getTodayPlusOneYear(baseDate = null) {
    //     const today = baseDate || moment();
    //     return today
    //         .add(1, 'year')
    //         .hour(0)
    //         .minute(1) // 1 minute past midnight
    //         .format('YYYY-MM-DDTHH:mm');
    // }

    function getToday() {
        return moment()
            .hour(0)
            .minute(1)
            .format('YYYY-MM-DD');
    }

    const formDefaults = {
        object_title: '',
        object_description: '',
        object_summary: '',
        object_owning_team_id: 1,
        object_link_url: '',
        object_download_instructions: 'Add this object to your course.',
        object_publishing_user: account?.id,
        object_status: isDlorAdminUser(account) ? 'new' : 'submitted',
        object_review_date_next: getToday(), // This will be changing to review_date_last.
        object_restrict_to: 'none',
        // team_name_add: '',
        // team_manager_add: '',
        // team_email_add: '',
        object_keywords_string: '',
        facets: [],
        object_link_interaction_type: 'none',
        object_is_featured: 0,
        object_cultural_advice: 0,
        notificationText: '',
    };

    console.log('Form Defaults', formDefaults);

    return (
        <Fragment>
            <StandardPage title="Digital Learning Hub Management">
                <DlorAdminBreadcrumbs
                    breadCrumbList={[
                        {
                            title: 'Create an Object for the Digital Learning Hub',
                        },
                    ]}
                />
                <section aria-live="assertive">
                    {!!!isDlorAdminUser(account) && (
                        <InformationBox
                            prompt="Submit this form to request your digital learning object to be added to the Digital Learning Hub."
                            identifier="UserAdd"
                            linkUrl="https://guides.library.uq.edu.au/research-and-teaching-staff/link-embed-resources/digital-learning-objects#instructions"
                            linkText="Submit an object has instructions and information."
                        />
                    )}
                    <Typography
                        component="p"
                        variant="body2"
                        sx={{ marginBottom: '20px', color: '#992222', fontWeight: 'bold' }}
                    >
                        * = Required fields
                    </Typography>
                    <DlorForm
                        actions={actions}
                        dlorItemSaving={dlorItemCreating}
                        dlorSavedItemError={dlorCreatedItemError}
                        dlorSavedItem={dlorCreatedItem}
                        dlorTeamList={dlorTeamList}
                        dlorTeamListLoading={dlorTeamListLoading}
                        dlorTeamListError={dlorTeamListError}
                        dlorFilterList={dlorFilterList}
                        dlorFilterListLoading={dlorFilterListLoading}
                        dlorFilterListError={dlorFilterListError}
                        formDefaults={formDefaults}
                        dlorFileTypeList={dlorFileTypeList}
                        dlorFileTypeListLoading={dlorFileTypeListLoading}
                        dlorFileTypeListError={dlorFileTypeListError}
                        dlorAdminNotesLoading={dlorAdminNotesLoading}
                        dlorAdminNotesLoaded={dlorAdminNotesLoaded}
                        dlorAdminNotesLoadError={dlorAdminNotesLoadError}
                        dlorAdminNotes={dlorAdminNotes}
                        mode="add"
                    />
                </section>
            </StandardPage>
        </Fragment>
    );
};

DLOAdd.propTypes = {
    actions: PropTypes.any,
    dlorItemCreating: PropTypes.bool,
    dlorCreatedItemError: PropTypes.any,
    dlorCreatedItem: PropTypes.object,
    dlorTeamList: PropTypes.array,
    dlorTeamListLoading: PropTypes.bool,
    dlorTeamListError: PropTypes.any,
    dlorFileTypeList: PropTypes.array,
    dlorFileTypeListLoading: PropTypes.bool,
    dlorFileTypeListError: PropTypes.any,
    dlorFilterList: PropTypes.array,
    dlorFilterListLoading: PropTypes.bool,
    dlorFilterListError: PropTypes.any,
    dlorAdminNotesLoading: PropTypes.bool,
    dlorAdminNotesLoaded: PropTypes.bool,
    dlorAdminNotesLoadError: PropTypes.any,
    dlorAdminNotes: PropTypes.array,
};

export default DLOAdd;
