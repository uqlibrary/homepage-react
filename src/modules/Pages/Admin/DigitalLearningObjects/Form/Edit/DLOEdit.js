import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import Typography from '@mui/material/Typography';

import DlorForm from 'modules/Pages/Admin/DigitalLearningObjects/Form/DlorForm';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import {
    getFileSizeString,
    getMinutesFromTotalSeconds,
    getSecondsFromTotalSeconds,
} from 'modules/Pages/DigitalLearningObjects/dlorHelpers';
import DlorAdminBreadcrumbs from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/DlorAdminBreadcrumbs';
import { useAccountContext } from 'context';

export const DLOEdit = ({
    actions,
    dlorItemLoading,
    dlorItemError,
    dlorItem,
    dlorItemUpdating,
    dlorUpdatedItemError,
    dlorUpdatedItem,
    dlorTeamList,
    dlorTeamListLoading,
    dlorTeamListError,
    dlorFilterList,
    dlorFilterListLoading,
    dlorFilterListError,
    dlorAdminNotesLoading,
    dlorAdminNotesLoaded,
    dlorAdminNotesLoadError,
    dlorAdminNotes,
}) => {
    const { account } = useAccountContext();
    const { dlorId } = useParams();

    React.useEffect(() => {
        /* istanbul ignore next */
        if (!dlorTeamListLoading && !dlorTeamListError && !dlorTeamList) {
            actions.loadOwningTeams();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        /* istanbul ignore next */
        if (!!dlorId) {
            actions.clearADlor();
            actions.loadADLOR(dlorId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dlorId]);

    if (!!dlorItemError) {
        return (
            <StandardPage title="Digital Learning Hub Management">
                <section aria-live="assertive">
                    <StandardCard title="Edit an Object for the Digital Learning Hub">
                        <Typography variant="body1" data-testid="dlor-form-error">
                            {dlorItemError}
                        </Typography>
                    </StandardCard>
                </section>
            </StandardPage>
        );
    }

    function getLinkSize(type) {
        if (dlorItem?.object_link_interaction_type === 'download') {
            if (type === 'unit' || type === 'amount') {
                return getFileSizeString(dlorItem?.object_link_size || /* istanbul ignore next */ '', type);
            }
            return null;
        } else if (dlorItem?.object_link_interaction_type === 'view') {
            if (type === 'minutes') {
                return getMinutesFromTotalSeconds(dlorItem?.object_link_size || /* istanbul ignore next */ '');
            } else if (type === 'seconds') {
                return getSecondsFromTotalSeconds(dlorItem?.object_link_size || /* istanbul ignore next */ '');
            }
            return null;
        }
        return '';
    }

    const formDefaults = {
        object_title: dlorItem?.object_title,
        object_description: dlorItem?.object_description,
        object_summary: dlorItem?.object_summary,
        object_owning_team_id: dlorItem?.object_owning_team_id,
        object_link_url: dlorItem?.object_link_url,
        object_download_instructions: dlorItem?.object_download_instructions || 'Add this object to your course.',
        object_publishing_user: dlorItem?.owner?.publishing_user_username,
        object_status: dlorItem?.object_status,
        object_restrict_to: dlorItem?.object_restrict_to,
        object_review_date_next: dlorItem?.object_review_date_next,
        team_name_edit: dlorItem?.owner.team_name,
        team_manager_edit: dlorItem?.owner.team_manager,
        team_email_edit: dlorItem?.owner.team_email,
        object_keywords_string: dlorItem?.object_keywords?.join(', '),
        facets: dlorItem?.object_filters,
        object_link_types: dlorItem?.object_link_types,
        object_link_interaction_type: dlorItem?.object_link_interaction_type,
        object_link_file_type: dlorItem?.object_link_file_type,
        object_link_size_units: getLinkSize('unit'),
        object_link_size_amount: getLinkSize('amount'),
        object_link_duration_minutes: getLinkSize('minutes'),
        object_link_duration_seconds: getLinkSize('seconds'),
        object_is_featured: dlorItem?.object_is_featured,
        object_cultural_advice: dlorItem?.object_cultural_advice,
        notificationText: '',
    };
    return (
        <Fragment>
            <StandardPage title="Digital Learning Hub - Edit Object">
                <DlorAdminBreadcrumbs
                    breadCrumbList={[
                        {
                            title: `Edit object: ${dlorItem?.object_title || ''}`,
                            id: 'edit-object',
                        },
                    ]}
                />
                <section aria-live="assertive">
                    <DlorForm
                        account={account}
                        actions={actions}
                        dlorItemSaving={dlorItemUpdating}
                        dlorSavedItemError={dlorUpdatedItemError}
                        dlorSavedItem={dlorUpdatedItem}
                        dlorItemLoading={dlorItemLoading}
                        dlorItem={dlorItem}
                        dlorItemError={dlorItemError}
                        dlorTeamList={dlorTeamList}
                        dlorTeamListLoading={dlorTeamListLoading}
                        dlorTeamListError={dlorTeamListError}
                        dlorFilterList={dlorFilterList}
                        dlorFilterListLoading={dlorFilterListLoading}
                        dlorFilterListError={dlorFilterListError}
                        dlorAdminNotesLoading={dlorAdminNotesLoading}
                        dlorAdminNotesLoaded={dlorAdminNotesLoaded}
                        dlorAdminNotesLoadError={dlorAdminNotesLoadError}
                        dlorAdminNotes={dlorAdminNotes}
                        formDefaults={formDefaults}
                        mode="edit"
                    />
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
    dlorTeamList: PropTypes.array,
    dlorTeamListLoading: PropTypes.bool,
    dlorTeamListError: PropTypes.any,
    dlorFilterList: PropTypes.array,
    dlorFilterListLoading: PropTypes.bool,
    dlorFilterListError: PropTypes.any,
    dlorAdminNotesLoading: PropTypes.bool,
    dlorAdminNotesLoaded: PropTypes.bool,
    dlorAdminNotesLoadError: PropTypes.any,
    dlorAdminNotes: PropTypes.array,
};

export default DLOEdit;
