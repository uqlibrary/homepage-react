import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import Typography from '@mui/material/Typography';

import localeGeneral from 'modules/Pages/Admin/TestTag/testTag.locale';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { hasAccess } from '../../helpers/auth';
import TestTagHeader from '../TestTagHeader/TestTagHeader';
import { useAccountUser } from '../../helpers/hooks';

const StyledWrapper = styled('div')(({ theme }) => ({
    '& .formControl': {
        minWidth: 120,
    },
    '& .formSelect': {
        minWidth: 120,
    },
    '& .expand': {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    '& .expandOpen': {
        transform: 'rotate(180deg)',
    },
}));

const StandardAuthPage = ({ title = '', locale = null, requiredPermissions, inclusive = true, children, ...props }) => {
    const { user, userLoading, userLoaded, privilege } = useAccountUser();
    const defaultAllow =
        (!!user && typeof user === 'object' && Object.keys(user).length > 0) || /* istanbul ignore next */ false;
    const userAllow = !!privilege
        ? hasAccess(privilege, requiredPermissions, inclusive)
        : /* istanbul ignore next */ null;
    const shouldHaveAccess = defaultAllow && userAllow;
    const headerDepartmentText = React.useMemo(
        () =>
            user
                ? locale?.header?.pageSubtitle?.(
                      user?.team_display_name ?? user?.user_team ?? /* istanbul ignore next */ '',
                      user?.department_display_name ?? user?.user_department ?? /* istanbul ignore next */ '',
                  )
                : /* istanbul ignore next */ '',
        [user, locale],
    );

    return (
        <StyledWrapper>
            <StandardPage title={title} {...props}>
                {!userLoading && !shouldHaveAccess && (
                    <Typography variant={'h6'}>{localeGeneral.pages.general.pageUnavailable}</Typography>
                )}
                {userLoaded && shouldHaveAccess && (
                    <>
                        <TestTagHeader departmentText={headerDepartmentText} breadcrumbs={locale?.breadcrumbs ?? []} />
                        {children}
                    </>
                )}
            </StandardPage>
        </StyledWrapper>
    );
};

StandardAuthPage.propTypes = {
    children: PropTypes.any.isRequired,
    title: PropTypes.string,
    user: PropTypes.object,
    locale: PropTypes.object,
    requiredPermissions: PropTypes.array,
    inclusive: PropTypes.bool,
};

export default React.memo(StandardAuthPage);
