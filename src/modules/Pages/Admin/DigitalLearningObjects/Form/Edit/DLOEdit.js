import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Typography from '@mui/material/Typography';

import DlorForm from 'modules/Pages/Admin/DigitalLearningObjects/Form/DlorForm';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

export const DLOEdit = ({
    actions,
    dlorItemLoading,
    dlorItemError,
    dlorItem,
    dlorItemUpdating,
    dlorUpdatedItemError,
    dlorUpdatedItem,
    dlorTeam,
    dlorTeamLoading,
    dlorTeamError,
    dlorFilterList,
    dlorFilterListLoading,
    dlorFilterListError,
}) => {
    const { dlorId } = useParams();
    // console.log('DLOEdit dlorItemLoading=', dlorItemLoading, '; error=', dlorItemError, '; response=', dlorItem);

    React.useEffect(() => {
        if (!dlorTeamLoading && !dlorTeamError && !dlorTeam) {
            actions.loadOwningTeams();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (!!dlorId) {
            actions.clearADlor();
            actions.loadADLOR(dlorId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dlorId]);

    if (!!dlorItemError) {
        return (
            <StandardPage title="Digital learning hub Management">
                <section aria-live="assertive">
                    <StandardCard title="Edit an Object for the Digital learning hub">
                        <Typography variant="body1" data-testid="dlor-form-error">
                            {dlorItemError}
                        </Typography>
                    </StandardCard>
                </section>
            </StandardPage>
        );
    }

    const formDefaults = {
        object_title: dlorItem?.object_title,
        object_description: dlorItem?.object_description,
        object_summary: dlorItem?.object_summary,
        object_owning_team_id: dlorItem?.object_owning_team_id,
        object_embed_type: dlorItem?.object_embed_type,
        object_link_url: dlorItem?.object_link_url,
        object_download_instructions: dlorItem?.object_download_instructions,
        object_publishing_user: dlorItem?.owner?.publishing_user_username,
        object_status: dlorItem?.object_status,
        object_review_date_next: dlorItem?.object_review_date_next,
        team_name: dlorItem?.team_name,
        team_manager: dlorItem?.team_manager,
        team_email: dlorItem?.team_email,
        object_keywords_string: dlorItem?.object_keywords?.join(', '),
        facets: dlorItem?.object_filters,
    };
    // console.log('DLOEdit formDefaults=', formDefaults);

    return (
        <Fragment>
            <StandardPage title="Digital learning hub Management">
                <section aria-live="assertive">
                    <StandardCard title="Edit an Object for the Digital learning hub">
                        <DlorForm
                            actions={actions}
                            dlorItemSaving={dlorItemUpdating}
                            dlorSavedItemError={dlorUpdatedItemError}
                            dlorSavedItem={dlorUpdatedItem}
                            dlorItemLoading={dlorItemLoading}
                            dlorItem={dlorItem}
                            dlorItemError={dlorItemError}
                            dlorTeam={dlorTeam}
                            dlorTeamLoading={dlorTeamLoading}
                            dlorTeamError={dlorTeamError}
                            dlorFilterList={dlorFilterList}
                            dlorFilterListLoading={dlorFilterListLoading}
                            dlorFilterListError={dlorFilterListError}
                            formDefaults={formDefaults}
                            mode="edit"
                        />
                    </StandardCard>
                </section>
            </StandardPage>
        </Fragment>
    );
};

DLOEdit.propTypes = {
    actions: PropTypes.any,
    dlorItemLoading: PropTypes.bool,
    dlorItemError: PropTypes.any,
    dlorItem: PropTypes.object,
    dlorItemUpdating: PropTypes.bool,
    dlorUpdatedItemError: PropTypes.any,
    dlorUpdatedItem: PropTypes.object,
    dlorTeam: PropTypes.array,
    dlorTeamLoading: PropTypes.bool,
    dlorTeamError: PropTypes.any,
    dlorFilterList: PropTypes.array,
    dlorFilterListLoading: PropTypes.bool,
    dlorFilterListError: PropTypes.any,
};

export default DLOEdit;
