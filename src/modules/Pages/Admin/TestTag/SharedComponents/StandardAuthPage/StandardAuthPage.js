import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';

import Typography from '@mui/material/Typography';

import localeGeneral from '../../testTag.locale';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { hasAccess } from '../../helpers/auth';
import TestTagHeader from '../TestTagHeader/TestTagHeader';

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
    const { userLoading, userLoaded, userError, user, privilege } = useSelector(state =>
        state.get('testTagUserReducer'),
    );

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
                      user?.department_display_name ?? user?.user_department ?? /* istanbul ignore next */ '',
                  )
                : /* istanbul ignore next */ '',
        [user, locale],
    );

    return (
        <StyledWrapper>
            <StandardPage title={title} {...props}>
                {!userLoading && (userLoaded || userError) && !shouldHaveAccess && (
                    <Typography variant={'h6'}>{localeGeneral.pages.general.pageUnavailable}</Typography>
                )}
                {userLoaded && !userError && shouldHaveAccess && (
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
