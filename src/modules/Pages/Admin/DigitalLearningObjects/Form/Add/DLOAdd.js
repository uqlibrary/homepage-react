import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const moment = require('moment-timezone');

import DlorForm from 'modules/Pages/Admin/DigitalLearningObjects/Form/DlorForm';

import { useAccountContext } from 'context';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

export const DLOAdd = ({
    actions,
    dlorItemCreating,
    dlorCreatedItemError,
    dlorCreatedItem,
    dlorTeam,
    dlorTeamLoading,
    dlorTeamError,
    dlorFileTypeList,
    dlorFileTypeListLoading,
    dlorFileTypeListError,
    dlorFilterList,
    dlorFilterListLoading,
    dlorFilterListError,
}) => {
    const { account } = useAccountContext();

    console.log('**** DLOAdd load=', dlorFileTypeListLoading, '; e=', dlorFileTypeListError, '; ', dlorFileTypeList);

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
        team_name: '',
        team_manager: '',
        team_email: '',
        object_keywords_string: '',
        facets: [],
        object_link_interaction_type: 'none',
        object_is_featured: 0,
    };

    return (
        <Fragment>
            <StandardPage title="Digital learning hub Management">
                <section aria-live="assertive">
                    <StandardCard title="Create an Object for the Digital learning hub">
                        <DlorForm
                            actions={actions}
                            dlorItemSaving={dlorItemCreating}
                            dlorSavedItemError={dlorCreatedItemError}
                            dlorSavedItem={dlorCreatedItem}
                            dlorTeam={dlorTeam}
                            dlorTeamLoading={dlorTeamLoading}
                            dlorTeamError={dlorTeamError}
                            dlorFilterList={dlorFilterList}
                            dlorFilterListLoading={dlorFilterListLoading}
                            dlorFilterListError={dlorFilterListError}
                            formDefaults={formDefaults}
                            dlorFileTypeList={dlorFileTypeList}
                            dlorFileTypeListLoading={dlorFileTypeListLoading}
                            dlorFileTypeListError={dlorFileTypeListError}
                            mode="add"
                        />
                    </StandardCard>
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
    dlorTeam: PropTypes.array,
    dlorTeamLoading: PropTypes.bool,
    dlorTeamError: PropTypes.any,
    dlorFileTypeList: PropTypes.array,
    dlorFileTypeListLoading: PropTypes.bool,
    dlorFileTypeListError: PropTypes.any,
    dlorFilterList: PropTypes.array,
    dlorFilterListLoading: PropTypes.bool,
    dlorFilterListError: PropTypes.any,
};

export default DLOAdd;
