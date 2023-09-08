import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import localeGeneral from '../../testTag.locale';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { hasAccess } from '../../helpers/auth';
import TestTagHeader from '../TestTagHeader/TestTagHeader';

const StandardAuthPage = ({
    title = '',
    locale = null,
    requiredPermissions = [],
    inclusive = true,
    children,
    ...props
}) => {
    const { userLoading, userLoaded, userError, user, privilege } = useSelector(state =>
        state.get('testTagUserReducer'),
    );

    const defaultAllow = (!!user && typeof user === 'object' && Object.keys(user).length > 0) || false;
    const userAllow = !!privilege ? hasAccess(privilege, requiredPermissions, inclusive) : null;
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
