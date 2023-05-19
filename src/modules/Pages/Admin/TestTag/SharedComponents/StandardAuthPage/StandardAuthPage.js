import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import { loadUser } from 'data/actions';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { hasAccess } from '../../helpers/auth';
import TestTagHeader from '../TestTagHeader/TestTagHeader';

const StandardAuthPage = ({
    title = '',
    locale = null,
    requiredPermissions = [],
    inclusive = true,
    children = null,
    ...props
} = {}) => {
    const dispatch = useDispatch();
    const { userLoading, userLoaded, userError, user, privilege } = useSelector(state =>
        state.get('testTagUserReducer'),
    );
    React.useEffect(() => {
        if (!userLoading && !userLoaded && !userError) {
            dispatch(loadUser());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLoading, userLoaded, userError]);

    const defaultAllow = (!!user && typeof user === 'object' && Object.keys(user).length > 0) || false;
    const userAllow = !!privilege ? hasAccess(privilege, requiredPermissions, inclusive) : null;
    const shouldHaveAccess = defaultAllow && userAllow;
    const headerDepartmentText = React.useMemo(
        () =>
            user
                ? locale?.header?.pageSubtitle?.(
                      user?.department_display_name ??
                          /* istanbul ignore next */ user?.user_department ??
                          /* istanbul ignore next */ '',
                  )
                : /* istanbul ignore next */ '',
        [user, locale],
    );
    return (
        <StandardPage title={title} {...props}>
            {userLoading && <ContentLoader message="Checking" />}
            {!userLoading && (userLoaded || userError) && !shouldHaveAccess && (
                <Typography variant={'h6'}>Page is unavailable</Typography>
            )}
            {userLoaded && !userError && shouldHaveAccess && (
                <>
                    <TestTagHeader
                        departmentText={headerDepartmentText}
                        requiredText={locale?.header?.requiredText}
                        breadcrumbs={locale?.breadcrumbs ?? []}
                    />
                    {children}
                </>
            )}
        </StandardPage>
    );
};

StandardAuthPage.propTypes = {
    title: PropTypes.string,
    user: PropTypes.object,
    locale: PropTypes.object,
    requiredPermissions: PropTypes.array,
    inclusive: PropTypes.bool,
    children: PropTypes.any,
};

export default React.memo(StandardAuthPage);
