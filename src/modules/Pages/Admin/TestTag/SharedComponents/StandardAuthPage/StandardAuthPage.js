import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { AUTH_URL_LOGIN } from 'config';

import localeGeneral from '../../testTag.locale';
import { loadUser } from 'data/actions';
import notfoundLocale from 'modules/Pages/NotFound/components/notfound.locale';
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
    const { account, accountLoading } = useSelector(state => state.get('accountReducer'));
    const isLoggedOut = accountLoading === false && !account;

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

    if (isLoggedOut) {
        // This only fires redirects if it's NOT one of the following three environments.
        /* istanbul ignore next */
        if (
            process.env.NODE_ENV !== 'test' &&
            process.env.NODE_ENV !== 'cc' &&
            process.env.NODE_ENV !== 'development'
        ) {
            window.location.assign(`${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`);
        }
        return <StandardPage standardPageId="authentication-required" {...notfoundLocale.authenticationRequired} />;
    }
    return (
        <StandardPage title={title} {...props}>
            {userLoading && <ContentLoader message={localeGeneral.pages.general.checkingAuth} />}
            {!userLoading && (userLoaded || userError) && !shouldHaveAccess && (
                <Typography variant={'h6'}>{localeGeneral.pages.general.pageUnavailable}</Typography>
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
