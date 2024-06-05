import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@mui/styles';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import DlOTeamForm from 'modules/Pages/Admin/DigitalLearningObjects/Team/DlOTeamForm';
import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import DlorAdminBreadcrumbs from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/DlorAdminBreadcrumbs';

const useStyles = makeStyles(theme => ({
    titleBlock: {
        '& p:first-child': {
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            fontSize: 16,
            '& a': {
                color: 'rgba(0, 0, 0, 0.87)',
                textDecoration: 'underline',
            },
        },
    },
    errorMessage: {
        color: theme.palette.error.light,
        fontSize: '0.8em',
        marginTop: 2,
    },
}));

export const DLOTeamAdd = ({ actions, dlorItemCreating, dlorCreatedItemError, dlorCreatedItem }) => {
    const classes = useStyles();

    const formDefaults = {
        team_name: '',
        team_email: '',
        team_manager: '',
    };

    return (
        <StandardPage title="Digital Learning Hub - Add a new Team">
            <DlorAdminBreadcrumbs
                breadCrumbList={[
                    {
                        link: dlorAdminLink('/team/manage'),
                        title: 'Team management',
                    },
                    {
                        title: 'Add new team',
                    },
                ]}
            />
            <DlOTeamForm
                actions={actions}
                formDefaults={formDefaults}
                dlorTeamSaving={dlorItemCreating}
                dlorSavedTeamError={dlorCreatedItemError}
                dlorSavedTeam={dlorCreatedItem}
                mode="add"
            />
        </StandardPage>
    );
};

DLOTeamAdd.propTypes = {
    actions: PropTypes.any,
    dlorTeam: PropTypes.object,
    dlorTeamLoading: PropTypes.bool,
    dlorTeamError: PropTypes.any,
    dlorItemCreating: PropTypes.bool,
    dlorCreatedItemError: PropTypes.any,
    dlorCreatedItem: PropTypes.object,
};

export default DLOTeamAdd;
