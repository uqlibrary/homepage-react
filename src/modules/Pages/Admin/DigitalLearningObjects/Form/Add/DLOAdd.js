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
    dlorItemError,
    dlorItem,
    dlorTeam,
    dlorTeamLoading,
    dlorTeamError,
    dlorFilterList,
    dlorFilterListLoading,
    dlorFilterListError,
}) => {
    // !!dlorItem && console.log('DLOAdd creating=', dlorItemCreating, '; error=', dlorItemError, '; response=', dlorItem);
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
        object_embed_type: 'link',
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
    };

    return (
        <Fragment>
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <StandardCard title="Create alert">
                        <DlorForm
                            actions={actions}
                            dlorItemCreating={dlorItemCreating}
                            dlorItemError={dlorItemError}
                            dlorItem={dlorItem}
                            dlorTeam={dlorTeam}
                            dlorTeamLoading={dlorTeamLoading}
                            dlorTeamError={dlorTeamError}
                            dlorFilterList={dlorFilterList}
                            dlorFilterListLoading={dlorFilterListLoading}
                            dlorFilterListError={dlorFilterListError}
                            formDefaults={formDefaults}
                        />
                    </StandardCard>
                </section>
            </StandardPage>
        </Fragment>
    );
};

DLOAdd.propTypes = {
    actions: PropTypes.any,
    dlorItemCreating: PropTypes.object,
    dlorItemError: PropTypes.any,
    dlorItem: PropTypes.object,
    dlorTeam: PropTypes.array,
    dlorTeamLoading: PropTypes.bool,
    dlorTeamError: PropTypes.any,
    dlorFilterList: PropTypes.array,
    dlorFilterListLoading: PropTypes.bool,
    dlorFilterListError: PropTypes.any,
};

export default DLOAdd;
