import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { useAccountContext } from 'context';

import DlorForm from 'modules/Pages/Admin/DigitalLearningObjects/Form/DlorForm';
import DlorAdminBreadcrumbs from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/DlorAdminBreadcrumbs';

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
}) => {
    const { account } = useAccountContext();

    function getTodayPlusOneYear(baseDate = null) {
        const today = baseDate || moment();
        return today
            .add(1, 'year')
            .hour(0)
            .minute(1) // 1 minute past midnight
            .format('YYYY-MM-DDTHH:mm');
    }

    const formDefaults = {
        object_title: '',
        object_description: '',
        object_summary: '',
        object_owning_team_id: 1,
        object_link_url: '',
        object_download_instructions: '',
        object_publishing_user: account?.id,
        object_status: 'new',
        object_review_date_next: getTodayPlusOneYear(),
        // team_name_add: '',
        // team_manager_add: '',
        // team_email_add: '',
        object_keywords_string: '',
        facets: [],
        object_link_interaction_type: 'none',
        object_is_featured: 0,
        object_cultural_advice: 0,
    };

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
};

export default DLOAdd;
