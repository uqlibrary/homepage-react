import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import DlOTeamForm from 'modules/Pages/Admin/DigitalLearningObjects/Team/DlOTeamForm';
import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import DlorAdminBreadcrumbs from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/DlorAdminBreadcrumbs';

export const DLOTeamEdit = ({
    actions,
    dlorTeam,
    dlorTeamLoading,
    dlorTeamError,
    dlorItemUpdating,
    dlorUpdatedItemError,
    dlorUpdatedItem,
}) => {
    const { dlorTeamId } = useParams();

    useEffect(() => {
        /* istanbul ignore else */
        if (!!dlorTeamId) {
            actions.loadADLORTeam(dlorTeamId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dlorTeamId]);

    return (
        <StandardPage title="Digital Learning Hub - Edit Team">
            <DlorAdminBreadcrumbs
                breadCrumbList={[
                    {
                        link: dlorAdminLink('/team/manage'),
                        title: 'Team management',
                    },
                    {
                        title: `Edit team: ${dlorTeam?.data?.team_name || ''}`,
                        id: 'edit-team',
                    },
                ]}
            />
            <DlOTeamForm
                actions={actions}
                formDefaults={dlorTeam?.data}
                dlorTeamLoading={dlorTeamLoading}
                dlorTeamError={dlorTeamError}
                dlorTeamSaving={dlorItemUpdating}
                dlorSavedTeamError={dlorUpdatedItemError}
                dlorSavedTeam={dlorUpdatedItem}
                mode="edit"
            />
        </StandardPage>
    );
};

DLOTeamEdit.propTypes = {
    actions: PropTypes.any,
    dlorTeam: PropTypes.object,
    dlorTeamLoading: PropTypes.bool,
    dlorTeamError: PropTypes.any,
    dlorItemUpdating: PropTypes.bool,
    dlorUpdatedItemError: PropTypes.any,
    dlorUpdatedItem: PropTypes.object,
};

export default DLOTeamEdit;
